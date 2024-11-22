import React, { useState } from "react";
import axios from "axios";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [data, setData] = useState({ invoices: [], products: [], customers: [] });
  const [activeTab, setActiveTab] = useState("invoices");
  const [formData, setFormData] = useState({});
  const [missingData, setMissingData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus("");
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("https://backend-0i4d.onrender.com/upload", formData);
      setUploadStatus("File uploaded successfully!");
      setData(response.data.generatedContent);
      console.log(response.data.generatedContent);

      
      findMissingData(response.data.generatedContent);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload file. Please try again.");
    }
  };

  
  const findMissingData = (content) => {
    const missing = [];
    Object.keys(content).forEach((tabName) => {
      content[tabName].forEach((row, rowIndex) => {
        Object.keys(row).forEach((col) => {
          if (row[col] === null || row[col] === undefined || row[col] === "") {
            missing.push({ tabName, rowIndex, col, label: col });
          }
        });
      });
    });
    setMissingData(missing);
  };

  
  const handleFormChange = (e, tabName, rowIndex, colName) => {
    const newFormData = { ...formData };
    newFormData[`${tabName}-${rowIndex}-${colName}`] = e.target.value;
    setFormData(newFormData);
  };

  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...data };
    
    missingData.forEach(({ tabName, rowIndex, col, label }) => {
      const value = formData[`${tabName}-${rowIndex}-${col}`];
      if (value !== undefined) {
        updatedData[tabName][rowIndex][col] = value;
      }
    });

    setData(updatedData);
    setMissingData([]);
  };

  const renderTable = (tabData, columns, tabName) => {
    if (!tabData || tabData.length === 0) {
      return <p>No data available for this tab.</p>;
    }

    return (
      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border border-gray-300 px-4 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabData.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => {
                const isInvalid = row[col] === null || row[col] === undefined || row[col] === "";
                return (
                  <td key={col} className="border border-gray-300 px-4 py-2">
                    {isInvalid ? (
                      <span className="text-red-600">Missing Data</span>
                    ) : (
                      row[col] || "N/A"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto border rounded shadow">
      <h1 className="text-xl font-bold mb-4">File Uploader</h1>
      <input type="file" onChange={handleFileChange} className="mb-4 block" />
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload File
      </button>
      {uploadStatus && (
        <p
          className={`mt-4 ${
            uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {uploadStatus}
        </p>
      )}

      {data && (
        <div className="mt-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-2 rounded ${
                activeTab === "invoices" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded ${
                activeTab === "products" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-4 py-2 rounded ${
                activeTab === "customers" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Customers
            </button>
          </div>

          <div>
            {activeTab === "invoices" &&
              renderTable(data.invoice_tab, [
                "Serial Number",
                "Customer Name",
                "Product Name",
                "Quantity (Qty)",
                "Tax",
                "Total Amount",
                "Date",
              ], "invoices")}

            {activeTab === "products" &&
              renderTable(data.products_tab, [
                "Name",
                "Quantity",
                "Unit Price",
                "Tax",
                "Price with Tax",
              ], "products")}

            {activeTab === "customers" &&
              renderTable(data.customer_tab, ["Customer Name", "Phone Number", "Total Purchase Amount"], "customers")}
          </div>

          
          {missingData.length > 0 && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Fill Missing Data</h2>
              <form onSubmit={handleFormSubmit}>
                {missingData.map(({ tabName, rowIndex, col, label }) => (
                  <div key={`${tabName}-${rowIndex}-${col}`} className="mb-4">
                    <label htmlFor={`${tabName}-${rowIndex}-${col}`} className="block mb-2">
                      Enter {label} for Row {rowIndex + 1}
                    </label>
                    <input
                      type="text"
                      id={`${tabName}-${rowIndex}-${col}`}
                      value={formData[`${tabName}-${rowIndex}-${col}`] || ""}
                      onChange={(e) => handleFormChange(e, tabName, rowIndex, col)}
                      className="border p-2 w-full"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update Table
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
