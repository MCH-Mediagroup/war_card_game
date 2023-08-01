import React, { useState } from 'react';
// import CountdownTimer from './CountdownTimer';
import { useSelector, useDispatch } from 'react-redux'
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountdown';

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
          winState = 1
          console.log(`Timer Expired winState: ${winState}\n`)
  
        }
      }
      
     
      return (
        <>
          <div className='my-4 text-center'>
                {!firstRun && <CountdownTimer targetDate={dateTime} timerExpiredHandler={timerExpiredHandler} />} <br />
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
    props.timerExpiredHandler()
    return <ExpiredNotice />;
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