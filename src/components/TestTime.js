import React, { useState, useEffect, useRef } from 'react';
import Countdown, { useCountdown, CountdownProps }  from 'react-countdown';

import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers'

import Alert from './Alert'

import {
  payPlayer,
  loadBalances,
  saveGameTime
} from '../store/interactions'


const TestTime = () => {
  const gametimes = useSelector(state => state.wargame.time)

  let [gameTime, setGameTime] = useState(0)
  const [firstRun, setFirstRun] = useState(true)

  //const countdownApiRef = useRef<CountdownApi | null>(null);
  let isBegun = true;
  const MINUTES_TO_ADD = 60000 * 1  // 3 minute

  const [timerTime, setTimerTime] = React.useState(Date.now() + MINUTES_TO_ADD);
  React.useEffect(() => {
   
    if (isBegun) setTimerTime(Date.now() + MINUTES_TO_ADD);
  }, [isBegun]);


  const dispatch = useDispatch()
      // Fetch Countdown
    // For Testing
    let GAME_TIMER = (new Date().getTime() + (MINUTES_TO_ADD)).toString().slice(0, 10);
    let gameOn = GAME_TIMER
    // For Testing

    saveGameTime(gameOn, dispatch)


  const loadInitialData = async () => {

    gameTime = (gameOn.toString() + '000')
    setGameTime(gameTime)
    saveGameTime(gameTime, dispatch)


    // saveGameTime(gameTime, dispatch)
    console.log(`Game Time: ${gameTime}\n`)
    console.log(`Game Times: ${gametimes}\n`)


}
const handleStartClick = () => {
    setTimerTime(Date.now() + MINUTES_TO_ADD)
    
    if (firstRun){
        setFirstRun(false);
      }
      };


    //   useEffect(() => {
    //     loadInitialData()
    //   }, []);

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
          {/* <Countdown date={Date.now() + 5000}>
    <Completionist />
  </Countdown>  <br /> */}
  {/* <Countdown
            key={timerTime}
            autoStart={false}
            date={timerTime}
            className='h2'
          /> */}
                {!firstRun && <Countdown date={Date.now() + (MINUTES_TO_ADD)} className='h2' autoStart={true} renderer={renderer} />} <br />
                {gametimes}
          </div>
          <Button  onClick={handleStartClick}>Simulate Play</Button>


        </>
      )
}



export default TestTime;