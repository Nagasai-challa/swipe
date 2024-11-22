import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to DataExtractor
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          "Your Gateway to Accurate and Efficient Data Solutions"
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
