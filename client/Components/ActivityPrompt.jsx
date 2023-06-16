import React from 'react';
import { useState, useEffect, useRef } from 'react';

// drilling prop setActivity for use in our component
const ActivityPrompt = ({ activity, setActivity, userId, timerId, setTimerId }) => {
  // declaring input as a new state initially at '', with setter function setInput
  const [ input, setInput ] = useState('');
  // declaring preActivity state which shows was there any activity submitted before
  const [ prevActivity, setPrevActivity ] = useState(false);

  // focusing input field when component renders
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // holds refresh prevention, setActivity/setInput, starts time 
  function handleActivity (e) {
    //if previous activity is not available before user submit the new activity
    //send data to the backend with activity name and start time
    if(!prevActivity) {
      e.preventDefault();
      setActivity(input);
      // set preActivity to true
      setPrevActivity(true);
      logStartTime();
      setInput('');
    } else {
      //if previous activity is available before user submit the new activity
      // send data to the backend with end time
      e.preventDefault();
      // logEndTime with prev activity
      logEndTime();
      // update the activity
      setActivity(input);
      // logStartTime with new activity
      logStartTime();
      setInput('');
    }
  }

  // called from handleActivity(), async to ensure the promise is fulfilled first
  async function logStartTime() {
    // logs the exact current time
    const currentTime = new Date();
  
    // logs the hour and minutes from currentTime, then writes startTime as military time (w/o colon) to send to the database for calculations
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const startTime = hours * 100 + minutes;
    // try and catch block
    try {
      const response = await fetch ('http://localhost:3000/switch', {
        //specify the method that is going to be used
        method: 'POST',
        //parse data into the body
        body: JSON.stringify({activity: input, startTime: startTime}),
        // define headers
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // console log the message depends by the result of sending data
      if (typeof response.result === 'number') {
        setTimerId(response.result);
        console.log('Data has been sent to the database!');
      }
      else console.log('Failed to send data to the database');
    } catch (error) {
      // console log the error
      console.log('An error occurred while sending data to the database:', error);
    }
  }

  async function logEndTime() {
    // logs the exact current time
    const currentTime = new Date();

    // logs the hour and minutes from currentTime, then writes startTime as military time (w/o colon) to send to the database for calculations
    // which data does backend expecting?
    // const hours = currentTime.getHours();
    // const minutes = currentTime.getMinutes();
    // const startTime = hours * 100 + minutes;
    // try and catch block
    try {
      const response = await fetch ('http://localhost:3000/activity', {
        //specify the method that is going to be used
        method: 'PATCH',
        /* Figure out which type of input that backend expect to recieve  */
        body: JSON.stringify({ timer_id: timerId }),
        // define headers
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // console log the message depends by the result of sending data
      if (response.ok) console.log('Data has been sent to the database!');
      else console.log('Failed to send data to the database');
    } catch (error) {
      // console log the error
      console.log('An error occurred while sending data to the database:', error);
    }
  }

  // returning div inputwindow
  return (
  <div className='activityContainer'>
      <h1 id="featureTitle">Task</h1>
      <form id="textandbutton">
        <input className="inputfield" type="text" ref={inputRef} value={input} placeholder='eg: algo practice' onChange={e => setInput(e.target.value)}></input>
        <button id="inputbutton-password" onClick={handleActivity}>Submit</button>
      </form>
    <h1 id="activity">{activity}</h1>
  </div>
  )
}
//export 
export default ActivityPrompt;