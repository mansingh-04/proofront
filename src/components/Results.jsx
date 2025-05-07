import { useState } from "react"
import "../styles/Results.css"

function Results({ data }) {
  const { source, category, analysis, suggestions, website_score, original_html } = data
  console.log("Results data:", data);
  console.log("Website score:", website_score);
  console.log("Score type:", typeof website_score);
  
  const [userScore, setUserScore] = useState(website_score || 50)
  const [feedbackStatus, setFeedbackStatus] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    cta: false,
    visual_hierarchy: false,
    copy_effectiveness: false,
    trust_signals: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  const getSuggestionText = (item) => {
    if (typeof item === 'string') {
      return item;
    } else if (item && typeof item === 'object') {
      return item.suggestion || item.text || JSON.stringify(item);
    }
    return "Invalid suggestion format";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; 
    if (score >= 60) return '#8BC34A'; 
    if (score >= 40) return '#FFC107'; 
    if (score >= 20) return '#FF9800'; 
    return '#F44336'; 
  };

  const getScoreRating = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Above Average';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    if (score >= 30) return 'Needs Improvement';
    if (score >= 20) return 'Poor';
    return 'Critical Issues';
  };

  const getRatingBackground = (score) => {
    if (score >= 80) return '#e8f5e9'; 
    if (score >= 60) return '#f1f8e9'; 
    if (score >= 40) return '#fff8e1'; 
    if (score >= 20) return '#fff3e0'; 
    return '#ffebee'; 
  };

  const handleFeedbackSubmit = async () => {

    setFeedbackStatus({ type: "loading", message: "Submitting your feedback..." });
    
    try {
      const htmlContent = original_html || "";
      
      if (!htmlContent) {
        setFeedbackStatus({ 
          type: "error", 
          message: "Cannot submit feedback: original HTML is not available" 
        });
        return;
      }
      
      const feedbackData = {
        html: htmlContent,
        user_score: parseInt(userScore, 10),
        user_feedback: {
          score_difference: parseInt(userScore, 10) - (website_score || 0),
          timestamp: new Date().toISOString()
        }
      };
      
      const serverUrls = [
        "http://localhost:5050/train-model",
        "http://127.0.0.1:5050/train-model", 
        "http://0.0.0.0:5050/train-model",
        "http://10.7.9.112:5050/train-model"
      ];
      
      let response = null;
      let error = null;
      
      for (const url of serverUrls) {
        try {
          response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedbackData)
          });
          
          if (response.ok) {
            break; 
          }
        } catch (err) {
          error = err;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(error || "Failed to submit feedback");
      }
      
      const result = await response.json();

      setFeedbackStatus({ 
        type: "success", 
        message: `Thank you for your feedback! Model updated from ${Math.round(result.old_score)} to ${Math.round(result.new_score)}.` 
      });
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackStatus({ 
        type: "error", 
        message: `Failed to submit feedback: ${error.message}` 
      });
    }
  };

  return (
    <div className="results-container">
      <h2>Website Analysis Results</h2>
      
      <div className="analysis-meta">
        <div className="source-info">
          <span className="label">Source:</span> {source}
        </div>
        <div className="category-info">
          <span className="label">Website Type:</span> {category}
        </div>
        
        {website_score !== null && website_score !== undefined ? (
          <div className="website-score-container">
            <div className="score-heading">Website Score</div>
            <div 
              className="website-score"
              style={{ 
                color: getScoreColor(website_score),
                borderColor: getScoreColor(website_score)
              }}
            >
              <div className="score-value">{Math.round(website_score)}</div>
              <div className="score-scale">/100</div>
            </div>
            <div 
              className="score-rating"
              style={{ 
                backgroundColor: getRatingBackground(website_score),
                color: getScoreColor(website_score)
              }}
            >
              {getScoreRating(website_score)}
            </div>
          </div>
        ) : (
          <div className="website-score-container" style={{ backgroundColor: '#ffeeee' }}>
            <div className="score-heading">Website Score</div>
            <div className="website-score" style={{ color: '#888', borderColor: '#888' }}>
              <div className="score-value">N/A</div>
            </div>
            <div className="score-rating">Not Available</div>
          </div>
        )}
      </div>

      <div className="suggestions-section">
        <h3>Priority Improvements</h3>
        <p className="section-description">
          These are the highest-impact changes we recommend for your website.
        </p>
        
        {suggestions && (
          <>
            <div className="component-section">
              <h4>
                <span className="category-icon cta">{getCategoryIcon('CTA')}</span>
                Call-to-Action (CTA)
              </h4>
              <ul className="high-priority-list">
                {suggestions.cta?.high_priority?.map((item, index) => (
                  <li key={`cta-high-${index}`}>{getSuggestionText(item)}</li>
                ))}
              </ul>
              {suggestions.cta?.additional?.length > 0 && (
                <button 
                  className="show-more-button" 
                  onClick={() => toggleSection('cta')}
                >
                  {expandedSections.cta ? 'Show Less' : 'Show More Suggestions'}
                </button>
              )}
              {expandedSections.cta && (
                <div className="additional-suggestions">
                  <ul>
                    {suggestions.cta?.additional?.map((item, index) => (
                      <li key={`cta-add-${index}`}>{getSuggestionText(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="component-section">
              <h4>
                <span className="category-icon hierarchy">{getCategoryIcon('Hierarchy')}</span>
                Visual Hierarchy
              </h4>
              <ul className="high-priority-list">
                {suggestions.visual_hierarchy?.high_priority?.map((item, index) => (
                  <li key={`vh-high-${index}`}>{getSuggestionText(item)}</li>
                ))}
              </ul>
              {suggestions.visual_hierarchy?.additional?.length > 0 && (
                <button 
                  className="show-more-button" 
                  onClick={() => toggleSection('visual_hierarchy')}
                >
                  {expandedSections.visual_hierarchy ? 'Show Less' : 'Show More Suggestions'}
                </button>
              )}
              {expandedSections.visual_hierarchy && (
                <div className="additional-suggestions">
                  <ul>
                    {suggestions.visual_hierarchy?.additional?.map((item, index) => (
                      <li key={`vh-add-${index}`}>{getSuggestionText(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="component-section">
              <h4>
                <span className="category-icon copy">{getCategoryIcon('Copy')}</span>
                Copy Effectiveness
              </h4>
              <ul className="high-priority-list">
                {suggestions.copy_effectiveness?.high_priority?.map((item, index) => (
                  <li key={`copy-high-${index}`}>{getSuggestionText(item)}</li>
                ))}
              </ul>
              {suggestions.copy_effectiveness?.additional?.length > 0 && (
                <button 
                  className="show-more-button" 
                  onClick={() => toggleSection('copy_effectiveness')}
                >
                  {expandedSections.copy_effectiveness ? 'Show Less' : 'Show More Suggestions'}
                </button>
              )}
              {expandedSections.copy_effectiveness && (
                <div className="additional-suggestions">
                  <ul>
                    {suggestions.copy_effectiveness?.additional?.map((item, index) => (
                      <li key={`copy-add-${index}`}>{getSuggestionText(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="component-section">
              <h4>
                <span className="category-icon trust">{getCategoryIcon('Trust')}</span>
                Trust Signals
              </h4>
              <ul className="high-priority-list">
                {suggestions.trust_signals?.high_priority?.map((item, index) => (
                  <li key={`trust-high-${index}`}>{getSuggestionText(item)}</li>
                ))}
              </ul>
              {suggestions.trust_signals?.additional?.length > 0 && (
                <button 
                  className="show-more-button" 
                  onClick={() => toggleSection('trust_signals')}
                >
                  {expandedSections.trust_signals ? 'Show Less' : 'Show More Suggestions'}
                </button>
              )}
              {expandedSections.trust_signals && (
                <div className="additional-suggestions">
                  <ul>
                    {suggestions.trust_signals?.additional?.map((item, index) => (
                      <li key={`trust-add-${index}`}>{getSuggestionText(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="analysis-section">
        <h3>Detailed Analysis</h3>
        {analysis && (
          <>
            <div className="component-analysis">
              <h4>
                <span className="category-icon cta">{getCategoryIcon('CTA')}</span>
                Call-to-Action (CTA)
              </h4>
              <ul>
                {analysis.cta?.observations?.map((observation, index) => (
                  <li key={`cta-obs-${index}`}>{typeof observation === 'string' ? observation : JSON.stringify(observation)}</li>
                ))}
              </ul>
            </div>

            <div className="component-analysis">
              <h4>
                <span className="category-icon hierarchy">{getCategoryIcon('Hierarchy')}</span>
                Visual Hierarchy
              </h4>
              <ul>
                {analysis.visual_hierarchy?.observations?.map((observation, index) => (
                  <li key={`vh-obs-${index}`}>{typeof observation === 'string' ? observation : JSON.stringify(observation)}</li>
                ))}
              </ul>
            </div>

            <div className="component-analysis">
              <h4>
                <span className="category-icon copy">{getCategoryIcon('Copy')}</span>
                Copy Effectiveness
              </h4>
              <ul>
                {analysis.copy_effectiveness?.observations?.map((observation, index) => (
                  <li key={`copy-obs-${index}`}>{typeof observation === 'string' ? observation : JSON.stringify(observation)}</li>
                ))}
              </ul>
            </div>

            <div className="component-analysis">
              <h4>
                <span className="category-icon trust">{getCategoryIcon('Trust')}</span>
                Trust Signals
              </h4>
              <ul>
                {analysis.trust_signals?.observations?.map((observation, index) => (
                  <li key={`trust-obs-${index}`}>{typeof observation === 'string' ? observation : JSON.stringify(observation)}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {source === "HTML input" && (
        <div className="user-feedback-section">
          <h3>Provide Your Feedback</h3>
          <p className="section-description">
            Help us improve our scoring model by providing your own assessment of this website.
          </p>
          
          <div className="feedback-form">
            <div className="score-input">
              <label htmlFor="user-score">Your Score (0-100):</label>
              <input 
                type="range" 
                id="user-score" 
                min="0" 
                max="100" 
                step="1"
                defaultValue={website_score || 50}
                onChange={(e) => setUserScore(e.target.value)}
              />
              <span className="score-display">{userScore}</span>
            </div>
            
            <button 
              className="submit-feedback-button"
              onClick={handleFeedbackSubmit}
            >
              Submit Feedback
            </button>
            
            {feedbackStatus && (
              <div className={`feedback-status ${feedbackStatus.type}`}>
                {feedbackStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
function getCategoryIcon(category) {
  switch(category) {
    case 'CTA':
      return '👆'
    case 'Hierarchy':
      return '📊'
    case 'Copy':
      return '📝'
    case 'Trust':
      return '🛡️'
    default:
      return '💡'
  }
}

export default Results