import React, { useState } from 'react';
import Countdown  from 'react-countdown';
import { useSelector } from 'react-redux'

import Button from 'react-bootstrap/Button';



const TestTime2 = () => {

  const gametime = useSelector(state => state.wargame.gametime)

  const [dateTime, setDateTime] = useState(0)



  const [firstRun, setFirstRun] = useState(true)
  let [winState, setWinState] = useState(0)


  const MINUTES_TO_ADD = 60000 * gametime  // 3 minute

const handleStartClick = () => {
    
    if (firstRun){
      setDateTime(Date.now() + (MINUTES_TO_ADD))
      setFirstRun(false);
      }
      };


    const Completionist = () => <strong>Game Over!</strong>;

    // Renderer callback with condition
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        winState = 2

        // Render a completed state
        return (
          <div className='h2' >
        <Completionist />
       
      </div>)
      } else {
        // Render a countdown
        return (
          <div className='h2'>
          <strong>You have: </strong>
          <strong>{minutes} Minutes : {seconds} Seconds </strong>
          <strong>to finish! </strong>
        </div>
        );
      }
    };
    
     
      return (
        <>
          <div className='my-4 text-center'>
                {!firstRun && <Countdown date={dateTime} className='h2' autoStart={true} renderer={renderer} />} <br />
          </div>
          <Button  onClick={handleStartClick}>Simulate Play</Button>


        </>
      )
}



export default TestTime2;