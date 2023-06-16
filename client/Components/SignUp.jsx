import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

const signUp = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate();

    const signUpClick = async (event) => {
        //prevent default needed to prevent default requests from triggering while waiting for fetch response
        event.preventDefault();
        try {
            // console.log('in event handler for signup click');
            let response = await fetch ('http://localhost:3000/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email, password: password})
            })

            response = await response.json();
            console.log('response from signup ', response);

            if (typeof response.result === 'number') {
                navigate('/home');
            }
            else {
                alert('This email address is already in use')
            }
        }
        catch (err) {
            console.log('An error occurred while sending email, password to the database from the signup page', err)
        }
    }

    return (
        <div className="signUpContainer">
            <h1 id="title">Focus.</h1>
            <input className="inputfield" type="text" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)}></input>
            <input className="inputfield" type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}></input>
            <button onClick={signUpClick}>Sign Up</button>
            <button className="textButton" onClick={() => navigate('/')}>Log In</button>
        </div>
    )
}

export default signUp;