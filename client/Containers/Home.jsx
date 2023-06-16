import React from "react";
import { useState } from "react";
import ActivityPrompt from '../Components/ActivityPrompt.jsx'
import TimerBox from '../Components/Timer.jsx'
import { Switch, Checkout} from '../Components/SwitchAndCheckout.jsx';

const Home = () => {

const [ activity, setActivity ] = useState('');
const [ taskSubmit, setTaskSubmit ] = useState(false);

  // consider updating classes/how styling is applied to components 
  return (
    <div>
      <div id="titleContainer">
        <h1 id="title">Focus.</h1>
      </div>
      <div className="featureContainer">
        <ActivityPrompt setActivity={setActivity} activity={activity} setTaskSubmit={setTaskSubmit} />
        <TimerBox activity={activity} taskSubmit={taskSubmit} setTaskSubmit={setTaskSubmit}/> 
      </div>
    </div>
  )
}

export default Home;1