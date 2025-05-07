import "../styles/Home.css"

function Home() {
  return (
    <div className="home-container">
      <div className="welcome-card">
        <h2>Welcome to the Website Analysis Tool</h2>
        <p>
          This tool helps you analyze websites for design and usability improvements. You can input a website URL or HTML code.
        </p>

        <div className="features">
          <div className="feature">
            <h3>URL Analysis</h3>
            <p>Enter a website URL to analyze its design and components.</p>
          </div>

          <div className="feature">
            <h3>HTML Analysis</h3>
            <p>Paste HTML code to get suggestions for improvement.</p>
          </div>
        </div>

        <div className="instructions">
          <h3>How to use:</h3>
          <ol>
            <li>Select your input type (URL or HTML)</li>
            <li>Provide the required input</li>
            <li>Click "Analyze Website"</li>
            <li>Review the suggestions and feedback</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Home