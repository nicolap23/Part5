const Notification = ({ message, type }) => {
    if (!message) return null
  
    const style = {
      color: type === "success" ? "green" : "red",
      background: "#ddd",
      fontSize: "20px",
      border: `2px solid ${type === "success" ? "green" : "red"}`,
      padding: "10px",
      marginBottom: "10px",
    }
  
    return <div style={style}>{message}</div>
  }
  
  export default Notification
  