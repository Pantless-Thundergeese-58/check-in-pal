import React from "react";
import { useState } from "react";
import ActivityPrompt from '../Components/ActivityPrompt.jsx'
import TimerBox from '../Components/Timer.jsx'
import { Switch, Checkout} from '../Components/SwitchAndCheckout.jsx';

const Home = ({userId, timerId, setTimerId}) => {

const [ activity, setActivity ] = useState('');
const [ isTimerRunning, setIsTimerRunning ] = useState(false);
console.log('current user id', userId);

  // consider updating classes/how styling is applied to components 
  return (
    <div>
      <div id="titleContainer">
        <h1 id="title">Focus.</h1>
      </div>
      <div className="featureContainer">
        <ActivityPrompt activity={activity} setActivity={setActivity} userId={userId} timerId={timerId} setTimerId={setTimerId}/>
        <TimerBox activity={activity} isTimerRunning={isTimerRunning} setIsTimerRunning={setIsTimerRunning} /> 
      </div>
    </div>
  )
}

export default Home;