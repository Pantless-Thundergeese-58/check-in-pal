import React from "react";
import { useNavigate } from "react-router-dom"

const LogInButton = () => {
  // declaring var for our hook
  const navigate = useNavigate();
  
  // holds hook functionality to redirect page ('/' -> '/switch')
  function switchTabs() {
    navigate('/home');
  }

  // returning a div with button 'Check in' with an onClick to call our switchTabs function
  return (
    <div className="checkin">
      <button onClick={switchTabs}>Check in</button>
    </div>
  )
}

export default LogInButton;