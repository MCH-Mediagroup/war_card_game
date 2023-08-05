import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useCountdown } from '../hooks/useCountdown';
import DateTimeDisplay from './DateTimeDisplay';
import Button from 'react-bootstrap/Button';

import {
  saveGameOver,
  saveWinStatus
} from '../store/interactions'

import './War.css';


const TestTime = () => {

  const gameover = useSelector(state => state.wargame.gameover)
  const winstatus = useSelector(state => state.wargame.winstatus)


  const [dateTime, setDateTime] = useState(0)



  const [firstRun, setFirstRun] = useState(true)
  let [timerExpired, setTimerExpired] = useState(false)


  let [winState, setWinState] = useState(0)
  const dispatch = useDispatch()


  //const MINUTES_TO_ADD = 60000 * gametime  // 3 minute
  const MINUTES_TO_ADD = 60000 * .1  // 3 minute




  // const stopTimer = () => {
  //   setIsRunning(false);
  // };
  // const startTimer = () => {
  //   setIsRunning(true);
  // };
  // const restartTimer = () => {
  //   setTime(0);
  //   setIsRunning(true);
  // };

  const [autoPlay, setAutoPlay] = useState(false);
  const [play, setPlay] = useState(false);
  // const [time, setTime] = useState(0);

  const setRegularPlay = () => {
    // setTime(0);
    // setIsRunning(true);
    // setIsButtonDisabled(true);
    setPlay(true);
  };
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    // Do any action you want when the button is clicked
    console.log('Button clicked!');

    // Disable the button
    setIsDisabled(true);

    // Re-enable the button after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setIsDisabled(false);
    }, 1000);
  };

const handleStartClick = () => {
    
    if (firstRun){
      setDateTime(Date.now() + (MINUTES_TO_ADD))
      setFirstRun(false);
      }
      };

      const autoPlayHandler = (props) => {
        if (!autoPlay)
        {
          setAutoPlay(true);
          setWinState(winState + 1)
  
          console.log(`Auto Play winState: ${winState}\n`)
  
        } else
        {
          setAutoPlay(false)
        }

      }
      const playHandler = () => {
        setPlay(true);
        setWinState(winState + 1)

        console.log(`Play winState: ${winState}\n`)

      }

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
      let [showMessage, setShowMessage] = useState("")

      var timer;
      var r = 0;
       //functions
       function rounds(a) {
        r = a;
        timer = setInterval(function () {
            battle()
        }, 1000);
    }
    function battle() {
    if (timer) {
        r--;
        setShowMessage("Rounds left " + r);
        if (r < 1) {
          window.clearInterval(timer);
        }
      }
    }
    
      return (
        <>
          <div className='my-4 text-center'>
                {!firstRun && <CountdownTimer targetDate={dateTime} timerExpiredHandler={() => timerExpiredHandler()} />} <br />
                  <div>
                  <Button disabled={isDisabled} onClick={handleClick}>
                    Click Me
                  </Button>                    
                  {/* <BattleButton playHandler={() => playHandler()} /> */}
                  </div>
                  winState = {winState} 
                  <div>
                    { autoPlay ? (
                      <p>Auto Play!</p>
                    ) : play ? (
                      <p>Play!</p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div>Message: {showMessage}</div>
          </div>
          <Button  onClick={handleStartClick}>Simulate Play</Button>


        </>
      )
}
const BattleButton = (props) => {
  const slowtime = useSelector(state => state.wargame.slowtime)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Set up the interval
    const slowTime = slowtime * 1000
    const intervalId = setInterval(() => {
      setIsButtonDisabled(prevState => !prevState);
    }, slowTime); // Toggle the disabled state of the button every 3 seconds

    // Clear the interval if the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, [slowtime]); // Empty dependency array means this effect runs once on mount and cleanup on unmount

    return (
      <div className="battle-button">
        <Button disabled={isButtonDisabled} onClick={props.playHandler} >Battle</Button>
      </div>
    )
}

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Game Over!!!</span>
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
    <Button className="show-results" onClick={props.timerExpiredHandler}>
    Click To Show Results!
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