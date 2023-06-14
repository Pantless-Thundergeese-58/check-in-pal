import React from "react";
import LogInButton from "../Components/LogInButton.jsx";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const LogIn = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate();

  // declare function that will be invoked once button is clicked
  async function logInClick (event) {
    
    //prevent default needed to prevent default requests from triggering while waiting for fetch response
    event.preventDefault();
    
    // fetch post request to backend
    try {
        let response = await fetch ('http://localhost:3000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email, password: password})
      })

      response = await response.json();
      console.log('response from login ', response);
      // if result id
      if (typeof response.result === 'number') {
        navigate('/main')
      }
      // if result false
      else {
        alert('Invalid email or password')
      }

    }
    catch (err) {
      console.log('An error occurred while sending email, password to the database from the login page:', err)
    }
    // set email & password back to empty string
  }
  
  function signUpClick() {
    navigate('/signup')
  }

  // returning the hompage div
  return (
    <div className="homepage">
      {/* Display the welcome message  */}
      <h1 id="welcome">Hi! I'm your check in pal.</h1>
      {/* Email input field */}
      <input id="login-email" type="text" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)}></input>
      {/* Password input field => should be chage the type as 'password' to not to display what user type in*/}
      <input id="login-password" type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}></input>
       {/* Login button */}
      <button onClick={logInClick}>Log In</button>
       {/* Figure out route */}
      <button onClick={signUpClick}>Sign Up</button>
    </div>
  );
}

export default LogIn;