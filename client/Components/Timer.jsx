import React from "react";
import { useState, useEffect } from "react";

const TimerBox = ({ activity , isTimerRunning, setIsTimerRunning, }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // declare let var interval without any assigning
  let interval;

  // declare the startTimer
  const startTimer = () => {
    //assign the interval to the interval ID
    // setInterval function returns an interval ID which uniquely identifies the interval, so you can remove it later by calling clearInterval()[from MDN Docs]
    interval = setInterval(() => {
      // setting a one second interval to increment the timer if start button has been clicked
      if (isTimerRunning) {
        // checks if the last second was 59, resets to 0 and increments minutes by 1 if so
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            // checks if the last minute was 59, resets to 0 and increments hours by 1 if so
            // running inside the last if statement to trigger a domino effect at the hour mark (e.g.: 0 hrs, 59 mins, 59 secs => 1:00:00)
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              } else {
                // if not, minutes just increments
                return prevMinutes + 1;
              }
            });
            return 0;
          } else {
            // if not, seconds just increments
            return prevSeconds + 1;
          }
        });
      }
    }, 1000);
  };

  // create function pauseTimer
  const pauseTimer = () => {
    // It pause the timer by invoking clearInterval function and pass the argument interval var which is interval ID
    clearInterval(interval);
  };

  // create function resetTimer
  const resetTimer = () => {
    // reset the hours,minutes,seconds state as 0 by invoking the stateSetter function
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  // // running useEffect
  useEffect(() => {
    // start the timer if activity state is available and isTimerRunning state is true
    if (activity.length > 0 && isTimerRunning) {
      startTimer();
    }
    // pause the timer if activity state is available and isTimerRunning state is false
    if (activity.length > 0 && !isTimerRunning) {
      pauseTimer();
    }

    // return the cleanup function to clear the interval when the component unmounts
    // I need little more time how it works
    return () => {
      pauseTimer();
    };
  }, [isTimerRunning]);

  //set another useEffect and subscribe the activity state
  useEffect(() => {
    // invoke the resetTimer and set isTimerRunning state as false to reset the timer & toggle
    resetTimer();
    setIsTimerRunning(false);
  }, [activity]);

  // // Is it better to declare 86 ~ 145 in higher component and passing as props?
  // // seems like these 2 function will be used in other components as well
  async function logStartTime() {
    // logs the exact current time
    const currentTime = new Date();
    // which data does backend expecting??????
    // old ver : logs the hour and minutes from currentTime, then writes startTime as military time (w/o colon) to send to the database for calculations
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const startTime = hours * 100 + minutes;
    // try and catch block
    try {
      const response = await fetch ('http://localhost:3000/switch', {
        //specify the method that is going to be used
        method: 'POST',
         /* Figure out which type of input that backend expect to recieve  */
        body: JSON.stringify({}),
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
        body: JSON.stringify({}),
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

  const handlePauseResume = (e) => {
    // // if timer will be paused after button clicked
    if(isTimerRunning) {
      e.preventDefault();
      // invoke logEndTime once timer pause button is clicked
      logEndTime();
      // make the isTimerRunning as default to stop running timer
      setIsTimerRunning(!isTimerRunning);
    } else {
      //if timer will be start after button clicked
      e.preventDefault();
      // invoke logStartTime once timer resume button is clicked
      logStartTime();
      // make the isTimerRunning as default to stop running timer 
    if (activity.length) {
      setIsTimerRunning(!isTimerRunning);
    }
    }
  };

  return (
    <div className="timerContainer">
      <h1 id="featureTitle">Timer</h1>
      <button onClick={handlePauseResume}>
        {" "}
        {isTimerRunning ? "Pause" : "Start"}{" "}
      </button>
      <p id="timer">{`${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</p>
    </div>
  )
};

export default TimerBox;
