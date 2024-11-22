const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const fileManager = new GoogleAIFileManager("AIzaSyDZgAZpaucdNpXTMu3FObrLlHIs-ef_xdc");
const genAI = new GoogleGenerativeAI("AIzaSyDZgAZpaucdNpXTMu3FObrLlHIs-ef_xdc");

exports.processImage = async (filePath) => {
  try {
    // Upload file to Google AI File Manager
    const fileName = path.basename(filePath);
    const mimeType = "image/jpeg";  // Adjust this depending on the image type

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName: fileName,
    });

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );

    // Fetch the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Generate content from the uploaded image
    const result = await model.generateContent([
      {
        "text":
         `I have a image containing information on invoices, products, and customers. Please extract and display the data in the following table formats
        Invoices Tab:

        Table columns: Serial Number, Customer Name, Product Name, Quantity (Qty), Tax, Total Amount, and Date.
        Products Tab:

        Table columns: Name, Quantity, Unit Price, Tax, and Price with Tax.
        Customers Tab:

        Table columns: Customer Name, Phone Number, and Total Purchase Amount.
        Output the data for each tab in structured tables. Provide the result in 
        JSON. Ensure all required fields are populated based on the information in the image
        and name them as invoice_tab,products_tab,customer_tab`
      }
        ,
      {
        fileData: {
          fileUri: uploadResponse.file.uri,
          mimeType: uploadResponse.file.mimeType,
        },
      },
    ]);

    // Log the result
    const responseText = result.response.text();
    console.log("Response Text:", responseText);

    // Extract JSON from responseText (between first `{` and last `}`)
    const startIndex = responseText.indexOf('{');
    const endIndex = responseText.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1) {
      const jsonString = responseText.substring(startIndex, endIndex + 1); // Extract the JSON string

      console.log("Extracted JSON string:", jsonString);

      // Parse and return JSON
      const parsedJson = JSON.parse(jsonString);
      console.log("Parsed JSON:", parsedJson);

      return parsedJson;
    } else {
      console.error("No valid JSON format found in the response text.");
      return null;
    }
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
};
