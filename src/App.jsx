"use client"

import { useState } from "react"
import InputForm from "./components/InputForm"
import Results from "./components/Results"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorAlert from "./components/ErrorAlert"
import Home from "./components/Home"
import "./App.css"

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    setHasInteracted(true)

    console.log("Submitting data:", data)
    const originalHtml = data.html || null;
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
    const serverUrls = [
      "http://localhost:5050/components",
      "http://127.0.0.1:5050/components", 
      "http://0.0.0.0:5050/components",
      "http://10.7.9.112:5050/components"
    ];
    
    let lastError = null;
    
    for (const url of serverUrls) {
      try {
        console.log(`Trying to fetch from: ${url}`);
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
          let errorMsg = `Error: ${response.status} - ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMsg = errorData.error;
            }
          } catch (err) {
            console.error("Error parsing error response:", err);
          }
          throw new Error(errorMsg);
        }
        
        const result = await response.json();
        console.log("Response:", result);
        console.log("Score from server:", result.website_score, typeof result.website_score);
        
        if (originalHtml) {
          result.original_html = originalHtml;
        }
        
        setResults(result);
        setLoading(false);
        return; 
      } catch (err) {
        console.error(`Failed with URL ${url}:`, err);
        lastError = err;
      }
    }
    
    setError(lastError?.message || "Failed to connect to any server. Please check if the backend is running.");
    setLoading(false);
  }

  const resetResults = () => {
    setResults(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="app-container">
      <header>
        <h1>Website Analysis Tool</h1>
      </header>

      <main>
        <InputForm onSubmit={handleSubmit} onResetResults={resetResults} />

        {loading && <LoadingSpinner />}

        {error && <ErrorAlert message={error} />}

        {!hasInteracted && !loading && !error && <Home />}

        {results && !loading && <Results data={results} />}
      </main>

      <footer>
        <p>Website Analysis Tool &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App;