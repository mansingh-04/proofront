import "../styles/LoadingSpinner.css"

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Analyzing website content...</p>
    </div>
  )
}

export default LoadingSpinner
