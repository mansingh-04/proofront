import "../styles/ErrorAlert.css"

function ErrorAlert({ message }) {
  return (
    <div className="error-alert">
      <div className="error-icon">!</div>
      <p>{message}</p>
    </div>
  )
}

export default ErrorAlert
