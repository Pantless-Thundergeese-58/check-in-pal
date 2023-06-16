import React from "react";
import InputWindow from '../Components/ActivityPrompt.jsx';
import { Link } from 'react-router-dom';

// SwitchDisplay has a passed in props which are 'activity' and 'setActivity' from App.jsx
const SwitchDisplay = ({activity, setActivity}) => {


  
  // returning the switchpage div
  return (
    <>
      <div className="switchpage">
          {/* It renders Prompt.jsx and InputWindow.jsx and pass the 2 props to InputWindow */}
          <InputWindow activity={activity} setActivity={setActivity}/>
      </div>
    </>
  )
}

export default SwitchDisplay;