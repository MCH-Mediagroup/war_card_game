import React, { useState } from 'react';
import Countdown  from 'react-countdown';
import { useSelector } from 'react-redux'

import Button from 'react-bootstrap/Button';



const TestTime = () => {

  const gametime = useSelector(state => state.wargame.gametime)


  const [firstRun, setFirstRun] = useState(true)

  const MINUTES_TO_ADD = 60000 * gametime  // 3 minute

const handleStartClick = () => {
    
    if (firstRun){
        setFirstRun(false);
      }
      };


    const Completionist = () => <strong>Game Over!</strong>;

    // Renderer callback with condition
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
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
                {!firstRun && <Countdown date={Date.now() + (MINUTES_TO_ADD)} className='h2' autoStart={true} renderer={renderer} />} <br />
          </div>
          <Button  onClick={handleStartClick}>Simulate Play</Button>


        </>
      )
}



export default TestTime;