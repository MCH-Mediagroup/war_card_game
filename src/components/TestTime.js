import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useTimer } from 'react-timer-hook';
import { useCountdown } from '../hooks/useCountdown';
import DateTimeDisplay from './DateTimeDisplay';
import Button from 'react-bootstrap/Button';

import {
  saveGameOver,
  saveWinStatus
} from '../store/interactions'


const TestTime = () => {

  const gametime = useSelector(state => state.wargame.gametime)
  const gameover = useSelector(state => state.wargame.gameover)
  const winstatus = useSelector(state => state.wargame.winstatus)


  const [dateTime, setDateTime] = useState(0)



  const [firstRun, setFirstRun] = useState(true)
  let [timerExpired, setTimerExpired] = useState(false)

  let [winState, setWinState] = useState(0)
  const dispatch = useDispatch()


  //const MINUTES_TO_ADD = 60000 * gametime  // 3 minute
  const MINUTES_TO_ADD = 60000 * .1  // 3 minute

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


const handleStartClick = () => {
    
    if (firstRun){
      setDateTime(Date.now() + (MINUTES_TO_ADD))
      setFirstRun(false);
      }
      };


      const timerExpiredHandler = () => {
        if (!timerExpired)
        {
          timerExpired = true
          //winState = 1
          setWinState(1)
          // forceUpdate()
          console.log(`Timer Expired winState: ${winState}\n`)
  
        }
      }
      const time = new Date();
  time.setSeconds(time.getSeconds() + 15); // 10 minutes timer
//   function rounds(a) {
//     var timer;
//     var r = 0;
//     r = a;
//     timer = setInterval(function () {
        
//     }, 100);
// }
      return (
        <>
          <div className='my-4 text-center'>
                {!firstRun && <CountdownTimer targetDate={dateTime} timerExpiredHandler={() => timerExpiredHandler()} />} <br />
                winState = {winState} 
                <div className="App">
      <h1>Counter: {counter}</h1>
      <Button onClick={clearInterval()}>Clear Interval</Button>
    </div>
          </div>
          <Button  onClick={handleStartClick}>Simulate Play</Button>


        </>
      )
}

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Game Over!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
      <a
        href="https://tapasadhikary.com"
        target="_blank"
        rel="noopener noreferrer"
        className="countdown-link"
      >
        <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
        <p>:</p>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
      </a>
    </div>
  );
};

const CountdownTimer = (props) => {
  const [days, hours, minutes, seconds] = useCountdown(props.targetDate);

  if (days + hours + minutes + seconds <= 0) {
    let ext = props.timerExpiredHandler
    return (
      <>
    <ExpiredNotice />
    <Button onClick={props.timerExpiredHandler}>
    Show
  </Button>
  </>
    );
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};



export default TestTime;