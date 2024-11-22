const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfHandler = require("./pdf.js");
const imageHandler = require("./image.js");
const excelHandler = require("./exceltest.js");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const fileExtension = path.extname(file.originalname).substring(1).toLowerCase();
    const newFilePath = path.join("uploads", file.originalname);
    
    // Rename file for better handling
    fs.renameSync(file.path, newFilePath);

    let result;

    if (fileExtension === "pdf") {
      result = await pdfHandler.processPDF(newFilePath);
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      result = await imageHandler.processImage(newFilePath);
    } else if (["xls", "xlsx", "csv"].includes(fileExtension)) {
      result = await excelHandler.processExcel(newFilePath);
    } else {
      fs.unlinkSync(newFilePath);
      return res.status(400).json({
        success: false,
        message: `Unsupported file type: ${fileExtension}`,
      });
    }

    res.json({
      success: true,
      message: "File uploaded and processed successfully!",
      generatedContent: result,
    });
  } catch (error) {
    console.error("Error during file upload or processing:", error);
    res.status(500).json({ success: false, message: "Error processing the file." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
