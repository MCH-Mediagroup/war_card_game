import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountdown';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import Spinner from 'react-bootstrap/Spinner';

import Alert from './Alert'
import './War.css';


import {
  payPlayer,
  loadBalances,
  withdrawTokens
} from '../store/interactions'


const Wargame = () => {

  // Get state variables from redux
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const wargame = useSelector(state => state.wargame.contract)
  const gametime = useSelector(state => state.wargame.gametime)
  const playerBalance = useSelector(state => state.tokens.balances)
  const warchest = useSelector(state => state.tokens.warchest)
  const isWithdrawing = useSelector(state => state.wargame.withdrawing.isWithdrawing)
  const isSuccess = useSelector(state => state.wargame.withdrawing.isSuccess)
  const isPaying = useSelector(state => state.wargame.paying.isWithdrawing)
  const isSuccessPaying = useSelector(state => state.wargame.paying.isSuccess)
  const payTransactionHash = useSelector(state => state.wargame.paying.transactionHash)

  // Gameplay variables
  const [beginGame, setBeginGame] = useState(true)
  const [isBetting, setIsBetting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasBet, setHasBet] = useState(false)
  const [hasWarchest, setHasWarchest] = useState(false)
  const [isWarchest, setIsWarchest] = useState(false)

  let [gameOver, setGameOver] = useState(false)
  let [winState, setWinState] = useState(0)
  let [winningsBefore, setWinningsBefore] = useState(100)
  let [winningsAfter, setWinningsAfter] = useState(50)
  let [data, setCards] = useState([])
  let player1Cards = 0
  let player2Cards = 0
  let cards = data;
  let players = [
      [],
      []
  ];
  let firstRun = true;
  let p1 = document.querySelector("#player1 .hand");
  let p2 = document.querySelector("#player2 .hand");
  let s1 = document.querySelector("#player1 .score");
  let s2 = document.querySelector("#player2 .score");


  //Token variables
  let [playerTokens, setPlayerTokens] = useState(0)
  let [gameTokens, setGameTokens] = useState(0)
  let [tokenAmount, setTokenAmount] = useState(0)
  let [warchestAmount, setWarchestAmount] = useState(0)
  let [tokenMultiplier, setTokenMultiplier] = useState(1)
  let [warchestTokens, setWarchestTokens] = useState(0)
  // let displayTokens = 0
  let [displayTokens, setDisplayTokens] = useState(0)

  // Timer variables
  let [timerExpired, setTimerExpired] = useState(false)
  const [dateTime, setDateTime] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false);
  const [play, setPlay] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Fetch Countdown
  //  const MINUTES_TO_ADD = 60000 * gametime  // default is 1 minute
  const MINUTES_TO_ADD = 60000 * .25  // testing


  // General variables
  const [showAlert, setShowAlert] = useState(false)
  const dispatch = useDispatch()

  const fetchCardData = () => {
    fetch("http://192.168.254.133:5050/api/Cards/getcards")
      .then(res => res.json())
      .then(data => {
          setCards(data)
        })
      }

    useEffect(() => {
        fetchCardData()
    }, []);

    const playHandler = () => {

      battle();

    }

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
 
    const isWarchestHandler = async () => {
      setIsWarchest(true)
    }
    const cancelWarchestHandler = async () => {
      setIsWarchest(false)
    }
    const isBettingHandler = async () => {
      setIsBetting(true)
    }
    const cancelBetHandler = async () => {
      setIsBetting(false)
    }
    const warchestHandler = async (e) => {
      e.preventDefault()
      setShowAlert(false)
      
      console.log(`War Chest Amount to withdraw: ${warchestAmount}\n`)

      console.log(`Account : ${account}\n`)

      await withdrawTokens(provider, wargame, tokens, warchestAmount, dispatch)

      await loadBalances(tokens, account, dispatch)

      let updateTokens = Number(warchestTokens + Number(warchestAmount))
      setWarchestTokens(updateTokens)
      warchestTokens = updateTokens
      console.log(`Total War Chest Tokens after withdrawal: ${warchestTokens}\n`)

      setWarchestAmount(0)

      setHasWarchest(true)
      setIsWarchest(false)

      setShowAlert(true)

    }
    const betHandler = async (e) => {
      e.preventDefault()
      
      console.log(`TokenBetAmount : ${tokenAmount}\n`)

      setGameTokens(Number(tokenAmount))

      // let updateTokens = Number(warchestTokens - tokenAmount)
      // setWarchestTokens(updateTokens)
      // warchestTokens = updateTokens


      setTokenMultiplier(2)
      tokenMultiplier = 2

      console.log(`Game Tokens betting : ${gameTokens} with multiplier: ${tokenMultiplier}\n`)

      setPlayerTokens(0)

      setHasBet(true)

    }

    const amountHandler = async (e) => {
        setTokenAmount(e.target.value)
    }
    const warchestAmountHandler = async (e) => {
      setWarchestAmount(e.target.value)
  }

    const handleStartClick = () => {
    
      if (beginGame){
          setBeginGame(false);
          setDateTime(Date.now() + (MINUTES_TO_ADD))
          
        }

    };

    const handlePlayAgainClick = () => {
    
      if (gameOver){
          setBeginGame(true);
          // setFirstRun(true);
          firstRun = true;
          setIsDisabled(false)
          setGameOver(false);
          setTimerExpired(false);
          players[0].length = 0;
          players[1].length = 0;
          player1Cards = 0;
          player2Cards = 0;
          p1.innerHTML = "";
          p2.innerHTML = "";
          s1.innerHTML = "";
          s2.innerHTML = "";
          fetchCardData();
        }

    };
    let totalTokensWon = 0;

    const winnerHandler = () => {

      // console.log(`War Chest Tokens Before: ${warchestTokens}\n`)
      // console.log(`Winning State: ${winState}\n`)
      // console.log(`Game Tokens before: ${gameTokens}\n`)
      // console.log(`Token multiplier before: ${tokenMultiplier}\n`)

      switch( winState ) {
        case 1: // Win before timer expires
          totalTokensWon = (gameTokens + winningsBefore) * tokenMultiplier;
          break;
        case 2: // Win after timer expires
          totalTokensWon = (gameTokens + winningsAfter) * tokenMultiplier;
          break;
        case 3: // Draw
          totalTokensWon = gameTokens;
          break;
        case 4: // Lose before timer expires
          if (gameTokens === 0)
          {
            warchestTokens >= winningsBefore ? (
              totalTokensWon -= winningsBefore 
            ) : (
              totalTokensWon = 0
            );
          } else {
            totalTokensWon = -(gameTokens + winningsBefore) * tokenMultiplier;
          }
          break;
        case 5: // Lose after timer expires
          if (gameTokens === 0)
          {
            warchestTokens >= winningsAfter ? (
              totalTokensWon -= winningsAfter 
            ) : (
              totalTokensWon = 0
            );
          } else {
            totalTokensWon = -(gameTokens + winningsAfter) * tokenMultiplier;
          }
          break;
        default: // Lose
          totalTokensWon = 0;
          break
      }
      setPlayerTokens(totalTokensWon)
      playerTokens = totalTokensWon

      setDisplayTokens(totalTokensWon)
      displayTokens = totalTokensWon

      let updateTokens = Number(warchestTokens + playerTokens)
      if (updateTokens < 0) {
        updateTokens = 0
        setHasWarchest(false)
      } else {
        setHasWarchest(true)
      }
      setWarchestTokens(updateTokens)
      warchestTokens = updateTokens

      console.log(`Computed Player Tokens: ${playerTokens}\n`)
      console.log(`War Chest Tokens: ${warchestTokens}\n`)

      // Reset all player amounts and flags
      setPlayerTokens(0)
      setGameTokens(0)
      gameTokens = 0
      setTokenAmount(0)
      setTokenMultiplier(1)
      setWinState(0)
  
      setIsBetting(false)
      setHasBet(false)
  
    }
    const gameWinnerHandler = () => {
      let timerExpired = true
      setTimerExpired(timerExpired)

      gameOver = true
      setGameOver(gameOver)
      setIsDisabled(true)

      // console.log(`Game Winner winState: ${winState}\n`)
      // console.log(`Game Winner Game Over State: ${gameOver}\n`)
      // console.log(`Player1 Cards: ${player1Cards}\n`)
      // console.log(`Player2 Cards: ${player2Cards}\n`)
    }
    const timerExpiredHandler = () => {
      if (!timerExpired)
      {

        let timerExpired = true
        setTimerExpired(timerExpired)

        gameOver = true
        setGameOver(gameOver)
        setIsDisabled(true)

        if (player2Cards === player1Cards){
          winState = 3} else
        (winState = player1Cards > player2Cards ? 2 : 5)
        setWinState(winState)


        console.log(`Timer Expired winState: ${winState}`)
        console.log(`Timer Expired War Chest Tokens: ${warchestTokens}`)
        console.log(`Timer Expired Game Over State: ${gameOver}`)
        console.log(`Player1 Cards: ${player1Cards}`)
        console.log(`Player2 Cards: ${player2Cards}\n`)
      
        winnerHandler()

      }
    }

    const payPlayerHandler = async () => {

      console.log(`War Chest Tokens before: ${warchest}\n`)

      setShowAlert(false)

      warchestTokens !== 0 && await payPlayer(
          provider,
          wargame,
          warchestTokens,
          dispatch
      )

      await loadBalances(tokens, account, dispatch)

    // reset war chest tokens
    setHasWarchest(false)
    setWarchestTokens(0)

    console.log(`Total War Chest Tokens after reset: ${warchest}\n`)

    setShowAlert(true)

    }

    // Cards Game below this comment

    // game functions

      function battle() {
          if (firstRun) {
              firstRun = false;
              dealCards(cards);
          }
          attack();
      }

      function attack() {
          if (!gameOver) {
              var card1 = players[0].shift();
              var card2 = players[1].shift();
              var pot = [card1, card2];
              p1.innerHTML = showCard(card1, 0);
              p2.innerHTML = showCard(card2, 0);
              checkWinner(card1, card2, pot);
              s1.innerHTML = players[0].length; 
              s2.innerHTML = players[1].length; 
              player1Cards = players[0].length; 
              player2Cards = players[1].length; 
          } else {
              outputMessage("Game over");
          }
      }

      function outputMessage(message) {
          document.getElementById("message").innerHTML = message;
      }

      function checkWinner(card1, card2, pot) {
          if ((players[0].length <= 4) || (players[1].length <= 4)) {
              let gameover = true;
              setGameOver(gameover)
              player1Cards = players[0].length; 
              player2Cards = players[1].length; 
              console.log(`Game Over Player1 Cards: ${player1Cards}\n`)
              console.log(`Game Over Player2 Cards: ${player2Cards}\n`)
              if (player2Cards === player1Cards){
                winState = 3} else
              (winState = player2Cards <= 4 ? 1 : 4)
        
              setWinState(winState)
        
              winnerHandler()

              return;
          }
          if (card1.cardValue > card2.cardValue) {
              outputMessage("Player 1 wins");
              players[0] = players[0].concat(pot);
          }
          else if (card1.cardValue < card2.cardValue) {
              outputMessage("House wins");
              players[1] = players[1].concat(pot);
          } else {
              battlemode(pot);
              outputMessage("Battle Mode");
          }
      }

      function battlemode(pot) {
          var card1, card2;
          var pos = (pot.length / 2);
          if ((players[0].length < 4) || (players[1].length < 4)) {
              return;
          } else {
              for (var i = 0; i < 4; i++) {
                  card1 = players[0].shift();
                  pot = pot.concat(card1);
                  p1.innerHTML += showCard(card1, (pos + i));
              }
              for (i = 0; i < 4; i++) {
                  card2 = players[1].shift();
                  pot = pot.concat(card2);
                  p2.innerHTML += showCard(card2, (pos + i));
              }
              checkWinner(card1, card2, pot);
          }
      }

      function showCard(c, p) {
          var move = p * 40;
          //var bgColor = (c.icon == "H" || c.icon == "D") ? "red" : "black";
          var bCard = '<div class="icard ' + c.suit + ' " style="left:' + move + 'px">';
          bCard += '<div class="cardtop suit">' + c.num + '<br></div>';
          bCard += '<div class="cardmid suit"></div>';
          bCard += '<div class="cardbottom suit">' + c.num + '<br></div></div>';
          return bCard;
      }

      function dealCards(array) {
          for (var i = 0; i < array.length; i++) {
              var m = i % 2;
              players[m].push(array[i]);
          }
      }
    
      return (
        <div>
            {account ? (
              <>
              <Row>
                <Col>
                    <div className='py-4'>
                        {warchestTokens > 0 && <p className='text-center'><strong></strong> {warchestTokens} {symbols} In War Chest</p>}
                        {gameTokens > 0 && <p className='text-center'><strong>Number of Tokens playing with:</strong> {gameTokens} {symbols}</p>}
                    </div>
               </Col>
                <Col>
                <div className='my-0 text-center'>
                  {beginGame ? (
                          <h1 className='my-0 text-center'>Let's Play War!</h1>
                      ) : (!beginGame && !gameOver) ? (
                          <CountdownTimer targetDate={dateTime} onTimerExpired={() => timerExpiredHandler()} />
                      ) : (gameOver && !beginGame && !timerExpired) ? (
                            <>
                              <ExpiredNotice />
                              <Button className="show-results" onClick={gameWinnerHandler}>
                                  Click To Show Results!
                              </Button>
                            </>
                       ) : (!beginGame && gameOver) && (
                        <div className='my-0 text-center'>
                            <Row>
                                <Col>
                                    <div className='my-1 text-center'>
                                        {
                                          displayTokens > 0 ? (<h5>Total {symbols} Won This Round : {displayTokens}</h5>
                                          ) :  displayTokens < 0 ? (
                                            <h5>Total {symbols} Lost This Round : {Math.abs(displayTokens)}</h5>
                                          ) : (
                                            <h5> No {symbols} Won Or Lost This Round (Tie) </h5>
                                          )
                                        }

                                    </div>

                                </Col>
                            </Row>
                          </div>
                     )
                  }
                  <div className='mb-0 text-center'>
                     {!gameOver && !beginGame &&  
                        <Button disabled={isDisabled} onClick={playHandler} >Fight</Button>
                     }
                  </div>
                </div>

                <div className='my-1 text-center'>
                  {beginGame && 
                  <Button  onClick={handleStartClick} className='mt-2'>Begin Game</Button>} <br />
                  {gameOver && 
                  <Button  onClick={handlePlayAgainClick} className='mb-3'>Play Again?</Button>} <br />
                </div>

                </Col>
                <Col>
                <div className='my-1 text-center'>
                  {hasWarchest && warchestTokens > 0 && !hasBet && <Button  variant="success" onClick={payPlayerHandler} className='m-2'>Send {symbols} From Your War Chest to your Wallet?</Button>}
                </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div id="wrapper">
                  <div id="message">Click Fight to Start Game</div>
                    <div id="board">
                      <div id="player1" className="players">
                          <div>SCORE:<span className="score"></span></div>
                          <div className="hand" ></div>
                      </div>  
                      <div id="player2" className="players">
                          <div>SCORE:<span className="score"></span></div>
                          <div className="hand" ></div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
                <Row>
                  <Col>
                  </Col>
                  <Col>
                    <Form onSubmit={warchestHandler} style={{ maxWidth: '250px', margin: '50px auto' }}>
                    { isWarchest &&
                    <div>
                        <Row>
                              <Form.Text className='text-end my-0' muted>
                                  Balance: {playerBalance}
                              </Form.Text>
                              <InputGroup>
                                  <Form.Control
                                      type="number"
                                      placeholder="0.0"
                                      min="1.0"
                                      max={playerBalance}
                                      step="any"
                                      id="token1"
                                      onChange={(e) => warchestAmountHandler(e)}
                                      value={warchestAmount === 0 ? "" : warchestAmount}
                                  />
                                  <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                                      { symbols }
                                  </InputGroup.Text>
                              </InputGroup>
                          </Row>
                          <Row>
                            <Button type="submit" className='m-2'>Add Them To Your War Chest!</Button>
                            <Button onClick={cancelWarchestHandler} className='m-2'>Cancel</Button>
                          </Row>
                      </div>
                      }
                      {!isWarchest && !gameOver && !hasBet &&<Button  variant="danger" onClick={isWarchestHandler} className='m-2'>Grab Some {symbols} From Wallet to add to your War Chest?</Button>}
                    </Form>
                  </Col>
                  <Col>
                  <Form onSubmit={betHandler} style={{ maxWidth: '250px', margin: '50px auto' }}>
                    { isBetting && !hasBet &&
                    <div>
                        <Row>
                              <Form.Text className='text-end my-0' muted>
                                  Balance: {playerBalance}
                              </Form.Text>
                              <InputGroup>
                                  <Form.Control
                                      type="number"
                                      placeholder="0.0"
                                      min="1.0"
                                      max={playerBalance}
                                      step="any"
                                      id="token1"
                                      onChange={(e) => amountHandler(e)}
                                      value={tokenAmount === 0 ? "" : tokenAmount}
                                  />
                                  <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                                      { symbols }
                                  </InputGroup.Text>
                              </InputGroup>
                          </Row>
                          <Row>
                            <Button type="submit" className='m-2'>Play With This Amount!</Button>
                            <Button onClick={cancelBetHandler} className='m-2'>Cancel</Button>
                          </Row>
                      </div>
                      }
                      {hasWarchest && !isBetting && !hasBet && beginGame && <Button  variant="warning" onClick={isBettingHandler} className='m-2'>Use {symbols} From Your War Chest?</Button>}
                      {!isPlaying && !gameOver && hasBet && <h3 className='my-4 text-center'>Playing with : {gameTokens} beginning Tokens and a {tokenMultiplier}X multiplier!</h3>}
                    </Form>

                  </Col>
                  <Col>
                  </Col>
                </Row>
              </>
              ) : (
                <p
                className='d-flex justify-content-center align-items-center'
                style={{ height: '300px' }}
              >
                Please connect wallet.
              </p>

              )
            }
                {isPaying || isWithdrawing ? (
                  <Alert
                  message={'Transaction Pending...'}
                  transactionHash={null}
                  variant={'info'}
                  setShowAlert={setShowAlert}
                  />
              ) : (isSuccessPaying || isSuccess) && showAlert ? (
                  <Alert
                  message={'Transaction Successful'}
                  transactionHash={payTransactionHash}
                  variant={'success'}
                  setShowAlert={setShowAlert}
                  />
              ) : (!isSuccessPaying || !isSuccess) && showAlert ? (
                  <Alert
                  message={'Transaction Failed'}
                  transactionHash={null}
                  variant={'danger'}
                  setShowAlert={setShowAlert}
                  />
              ) : (
                  <></>
        )}
    </div>
  )
}
const BattleButton = (props) => {
//   const slowtime = useSelector(state => state.wargame.slowtime)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

//   useEffect(() => {
//     // Set up the interval
//     const slowTime = slowtime * 1000
//     const intervalId = setInterval(() => {
//       setIsButtonDisabled(prevState => !prevState);
//     }, slowTime); // Toggle the disabled state of the button every 3 seconds

//     // Clear the interval if the component is unmounted
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [slowtime]); // Empty dependency array means this effect runs once on mount and cleanup on unmount

      // Disable the button
      setIsButtonDisabled(true);

    // Re-enable the button after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 500);

    return (
      <div className="battle-button">
        <Button disabled={isButtonDisabled} onClick={props.playHandler} >Fight</Button>
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
        <strong>Game Time Left </strong>
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
    return (
      <>
        <ExpiredNotice />
        <Button className="show-results" onClick={props.onTimerExpired}>
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


export default Wargame