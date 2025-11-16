import React, { useState, useEffect } from "react";
import axios from "axios";

import cblogo from "./assets/cblogo.png";
import bg from "./assets/bg.png";
import "./ImageUpload.css"; // Import the separate CSS file

export default function ImageUpload() {
  const API_URL = "http://localhost:8000/predict";
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setData(null); // Clear previous results

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(API_URL, formData);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error sending file:", error);
      // Optional: Set a user-friendly error state
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Clean up the object URL when the component unmounts or selectedFile changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    // Automatically send file when a new preview is available
    if (preview) sendFile();
  }, [preview]);

  const clearAll = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
  };

  const confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : 0;

  return (
    <div className="app-container" style={{ backgroundImage: `url(${bg})` }}>
      {/* Header */}
      <header className="header">
        <h1 className="header-title">AgreNexus: Potato Disease Classification</h1>
        <img src={cblogo} alt="logo" className="header-logo" />
      </header>

      {/* Main Card */}
      <div className="main-card">
        <div className="upload-section">
          {!preview ? (
            <div className="file-input-wrapper">
              <label htmlFor="file-upload" className="custom-file-upload">
                Choose Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <p className="upload-prompt">Upload a potato leaf image</p>
            </div>
          ) : (
            <>
              <img src={preview} alt="Preview" className="image-preview" />
              {data && (
                <button onClick={clearAll} className="clear-button">
                  Upload New Image
                </button>
              )}
            </>
          )}
        </div>

        {/* Status and Result */}
        <div className="result-section">
          {loading && <p className="status-text loading">Processing...</p>}

          {data && (
            <div className="prediction-result">
              <h3 className="result-heading">Prediction Result</h3>
              <p className="result-item">
                <span className="result-label">Class:</span>{" "}
                <span className="result-value">{data.class}</span>
              </p>
              <p className="result-item">
                <span className="result-label">Confidence:</span>{" "}
                <span className="result-value-confidence">{confidence}%</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}