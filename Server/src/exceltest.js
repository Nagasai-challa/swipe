const XLSX = require('xlsx');
const fs = require('fs');

// Function to process Excel file
const processExcel = (filePath) => {
  try {
    // Load the Excel file
    const workbook = XLSX.readFile(filePath);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Access the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log(jsonData); // Logs the parsed data

    return jsonData; // Return the parsed data for further processing
  } catch (error) {
    console.error('Error processing the Excel file:', error);
    return null; // Return null in case of an error
  }
};

module.exports = { processExcel };