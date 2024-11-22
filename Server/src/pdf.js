const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI("AIzaSyDZgAZpaucdNpXTMu3FObrLlHIs-ef_xdc");
const fileManager = new GoogleAIFileManager("AIzaSyDZgAZpaucdNpXTMu3FObrLlHIs-ef_xdc");

exports.processPDF = async (filePath) => {
  try {
    // Upload file to Google AI File Manager
    const fileName = path.basename(filePath);
    const mimeType = "application/pdf"; // Adjust as needed for the actual file type

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

    // Generate content
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { 
        text: `I have a PDF document containing information on invoices, products, and customers. Please extract and display the data in the following table formats
        Invoices Tab:

        Table columns: Serial Number, Customer Name, Product Name, Quantity (Qty), Tax, Total Amount, and Date.
        Include all required columns.
        Products Tab:

        Table columns: Name, Quantity, Unit Price, Tax, and Price with Tax.
        
        Customers Tab:

        Table columns: Customer Name, Phone Number(Phone number data may sometimes appear with the label ph instead of Phone Number), and Total Purchase Amount.
        Output the data for each tab in structured tables. Provide the result in 
        JSON. Ensure all required fields are populated based on the information in the PDF
        and name them as invoice_tab,products_tab,customer_tab
        
        Sometimes, names like 'NextSpeed Technologies Pvt Ltd' might be misinterpreted as customers. Please treat them as company names and not customers. Here is an example:
      - Data: 'NextSpeed Technologies Pvt Ltd' should be classified as Company Name, not Customer Name.`,
      }
    ])

    //console.log("Raw result:", result);

    const responseText = result.response.text(); // Ensure this works correctly
    
    const startIndex = responseText.indexOf('{');
    const endIndex = responseText.lastIndexOf('}');
    const jsonString = responseText.substring(startIndex, endIndex + 1);
    const parsedJson = JSON.parse(jsonString);
    console.log(jsonString)
    return parsedJson;
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error("Failed to process PDF");
  } finally {
    // Cleanup: Delete the file after processing
    fs.unlinkSync(filePath);
  }
};
