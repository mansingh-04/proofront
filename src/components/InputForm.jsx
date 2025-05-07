"use client"

import { useState, useRef } from "react"
import "../styles/InputForm.css"

function InputForm({ onSubmit, onResetResults }) {
  const [inputType, setInputType] = useState("url")
  const [url, setUrl] = useState("")
  const [html, setHtml] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const fileInputRef = useRef(null)

  const handleInputTypeChange = (newType) => {
    setInputType(newType)
    // Reset results when changing input type
    if (onResetResults) {
      onResetResults()
    }
    // Reset image preview when changing types
    if (newType !== "image") {
      setImagePreview("")
      setImageFile(null)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prepare the data object to send to App.jsx
    const formData = {}

    if (inputType === "url") {
      formData.url = url
      onSubmit(formData)
    } else if (inputType === "html") {
      formData.html = html
      onSubmit(formData)
    } else if (inputType === "image" && imageFile) {
      // Convert image to base64 for submission
      const reader = new FileReader()
      reader.onloadend = () => {
        // The readAsDataURL result includes the MIME type prefix which we want to keep
        // Example: "data:image/jpeg;base64,/9j/4AAQSkZ..."
        formData.image = reader.result
        onSubmit(formData)
      }
      reader.readAsDataURL(imageFile)
    }
  }

  return (
    <div className="input-form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-selector">
          <button 
            type="button" 
            className={inputType === "url" ? "active" : ""} 
            onClick={() => handleInputTypeChange("url")}
          >
            URL
          </button>
          <button 
            type="button" 
            className={inputType === "html" ? "active" : ""} 
            onClick={() => handleInputTypeChange("html")}
          >
            HTML
          </button>
          <button 
            type="button" 
            className={inputType === "image" ? "active" : ""} 
            onClick={() => handleInputTypeChange("image")}
          >
            Screenshot
          </button>
        </div>

        <div className="input-field">
          {inputType === "url" && (
            <input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          )}

          {inputType === "html" && (
            <textarea
              placeholder="Paste HTML code here"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              required
              rows={8}
            />
          )}

          {inputType === "image" && (
            <div className="image-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <button
                type="button"
                className="file-upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                {imageFile ? "Change Image" : "Upload Screenshot"}
              </button>
              {imageFile && (
                <div className="file-name">
                  {imageFile.name}
                </div>
              )}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Website screenshot preview" />
                </div>
              )}
              {!imageFile && (
                <p className="upload-instructions">
                  Upload a screenshot of the website you want to analyze.
                  <br />
                  Supported formats: JPG, PNG, WEBP
                </p>
              )}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={inputType === "image" && !imageFile}
        >
          Analyze Website
        </button>
      </form>
    </div>
  )
}

export default InputForm