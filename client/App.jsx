import React from "react";
import LogIn from './Containers/LogIn.jsx';
import Home from './Containers/Home.jsx'
import SignUp from './Components/SignUp.jsx'
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

const App = () => {
   
  const [userId, setUserId] = useState('');
  const [timerId, setTimerId] = useState('');

  return (
     <Routes>
      <Route path="/" element={<LogIn userId={userId} setUserId={setUserId}/>} />
      <Route path="/signup" element={<SignUp userId={userId} setUserId={setUserId}/>} />
      <Route path="/home" element={<Home userId={userId} timerId={timerId} setTimerId={setTimerId}/>} />      
    </Routes>
  );
}

export default App;