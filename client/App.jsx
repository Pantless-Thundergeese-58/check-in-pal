import React from "react";
import LogIn from './Containers/LogIn.jsx';
import Home from './Containers/Home.jsx'
import SignUp from './Components/SignUp.jsx'
import { Routes, Route } from "react-router-dom";

const App = () => {
 
  return (
     <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />      
    </Routes>
  );
}

export default App;