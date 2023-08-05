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
  saveWarchest,
  withdrawTokens
} from '../store/interactions'


const Wargame = () => {

  // Get state variables from redux
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const wargame = useSelector(state => state.wargame.contract)
  const wargameBalance = useSelector(state => state.wargame.balance)
  const playerBalance = useSelector(state => state.tokens.balances)
  const warChest = useSelector(state => state.tokens.warchest)
  const isWithdrawing = useSelector(state => state.wargame.withdrawing.isWithdrawing)
  const isSuccess = useSelector(state => state.wargame.withdrawing.isSuccess)
  const transactionHash = useSelector(state => state.wargame.withdrawing.transactionHash)
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
  // let [firstRun, setFirstRun] = useState(true)



  let [gameOver, setGameOver] = useState(false)

  let [winState, setWinState] = useState(0)
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


  // let [player1Cards, setPlayer1Cards] = useState(0)
  // let [player2Cards, setPlayer2Cards] = useState(0)

  //Token variables
  let [playerTokens, setPlayerTokens] = useState(0)
  let [gameTokens, setGameTokens] = useState(0)
  let [tokenAmount, setTokenAmount] = useState(0)
  let [warchestAmount, setWarchestAmount] = useState(0)
  let [tokenMultiplier, setTokenMultiplier] = useState(1)


  // Timer variables
  let [timerExpired, setTimerExpired] = useState(false)
  const [dateTime, setDateTime] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false);
  const [play, setPlay] = useState(false);

  // Fetch Countdown
  // const MINUTES_TO_ADD = 60000 * gametime  // default is 1 minute
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
      
      console.log(`War Chest Amount : ${warchestAmount}\n`)

      console.log(`Account : ${account}\n`)

      await withdrawTokens(provider, wargame, tokens, warchestAmount, dispatch)

      await loadBalances(tokens, account, dispatch)

      saveWarchest(Number(warchestAmount))

      setHasWarchest(true)

      setShowAlert(true)

    }
    const betHandler = async (e) => {
      e.preventDefault()
      
      console.log(`TokenBetAmount : ${tokenAmount}\n`)

      setGameTokens(Number(tokenAmount))

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
      switch( winState ) {
        case 1: // Win before timer expires
          totalTokensWon = (gameTokens + 100) * tokenMultiplier;
          break;
        case 2: // Win after timer expires
          totalTokensWon = (gameTokens + 50) * tokenMultiplier;
          break;
        case 3: // Draw
          totalTokensWon = gameTokens;
          break;
        default: // Lose
          totalTokensWon = 0;
          break
      }
      setPlayerTokens(totalTokensWon)
      playerTokens = totalTokensWon
      // console.log(`Player Tokens: ${playerTokens}\n`)
    }
    const gameWinnerHandler = () => {
    }
    const timerExpiredHandler = () => {
      if (!timerExpired)
      {

        let timerExpired = true
        setTimerExpired(timerExpired)

        gameOver = true
        setGameOver(gameOver)

        if (player2Cards === player1Cards){
          winState = 3} else
        (winState = player1Cards > player2Cards ? 2 : 0)
        setWinState(winState)


        console.log(`Timer Expired winState: ${winState}\n`)
        console.log(`Timer Expired Game Over State: ${gameOver}\n`)
        console.log(`Player1 Cards: ${player1Cards}\n`)
        console.log(`Player2 Cards: ${player2Cards}\n`)
      
        winnerHandler()

      }
    }

    const payPlayerHandler = async () => {
      // e.preventDefault()

      console.log(`Game Tokens before: ${gameTokens}\n`)
      console.log(`Player Tokens before: ${playerTokens}\n`)
      console.log(`Token multiplier before: ${tokenMultiplier}\n`)


      setShowAlert(false)
      console.log(`Winning State: ${winState}\n`)
      console.log(`Total Player Tokens won: ${playerTokens}\n`)
      // console.log(`Total Tokens won: ${totalTokensWon}\n`)

      // const _tokenAmount = playerTokens

      playerTokens !== 0 && await payPlayer(
          provider,
          wargame,
          playerTokens,
          dispatch
      )

      await loadBalances(tokens, account, dispatch)

    // reset player tokens
    setPlayerTokens(0)
    setGameTokens(0)
    playerTokens = 0
    gameTokens = 0
    setTokenAmount(0)
    setTokenMultiplier(1)

    setIsBetting(false)
    setHasBet(false)
    // setFirstRun(true)

    console.log(`Total Player Tokens after reset: ${playerTokens}\n`)

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
              let winState = (
                  (players[1].length <= 4) ? (
                      1
                  ) : players[1].length === players[0].length ? (
                      3
                  ) : 0
              )
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
                </Col>
                <Col>
                <div className='my-0 text-center'>
                  {beginGame ? (
                          <h1 className='my-0 text-center'>Let's Play War!</h1>
                      ) : (!beginGame && !gameOver) ? (
                          <CountdownTimer targetDate={dateTime} onTimerExpired={() => timerExpiredHandler()} />
                     ) : (!beginGame && gameOver) && (
                        <div className='my-0 text-center'>
                            <Row>
                                <Col>
                                    <div className='my-1 text-center'>
                                        <h3>Total {symbols} Won : {playerTokens}</h3>
                                    </div>

                                    {playerTokens > 0 && (<div className='my-1 text-center'>
                                        <Button  onClick={payPlayerHandler}>Pocket Winnings!</Button>
                                    </div>)}
                                </Col>
                            </Row>
                          </div>
                     )
                  }
                  <div className='mb-0 text-center'>
                     {/* {!gameOver && !beginGame && <Button  onClick={battle}>Fight</Button>} */}
                     {!gameOver && !beginGame &&  <BattleButton playHandler={() => playHandler()} />}
                     <Button className="show-results" onClick={gameWinnerHandler}>
                        Click To Show Results!
                     </Button>

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
                  {hasWarchest && warchestAmount > 0 && <Button  variant="success" onClick={payPlayerHandler} className='m-2'>Send {symbols} From Your War Chest to your Wallet?</Button>}
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
                    <Form onSubmit={warchestHandler} style={{ maxWidth: '250px', margin: '50px auto' }}>
                    { isWarchest && !hasWarchest &&
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
                            <Button type="submit" className='m-2'>Put Them Into Your Pile!</Button>
                            <Button onClick={cancelWarchestHandler} className='m-2'>Cancel</Button>
                          </Row>
                      </div>
                      }
                      {!isWarchest && !hasWarchest && beginGame && <Button  variant="danger" onClick={isWarchestHandler} className='m-2'>Grab Some {symbols} From Wallet to add to your War Chest?</Button>}
                      {/* {!isPlaying && !gameOver && hasBet && <h3 className='my-4 text-center'>Playing with : {gameTokens} beginning Tokens and a {tokenMultiplier}X multiplier!</h3>} */}
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
                            <Button type="submit" className='m-2'>Put Them Into Your Pile!</Button>
                            <Button onClick={cancelBetHandler} className='m-2'>Cancel</Button>
                          </Row>
                      </div>
                      }
                      {hasWarchest && !isBetting && !hasBet && beginGame && <Button  variant="warning" onClick={isBettingHandler} className='m-2'>Use {symbols} From Your War Chest?</Button>}
                      {!isPlaying && !gameOver && hasBet && <h3 className='my-4 text-center'>Playing with : {gameTokens} beginning Tokens and a {tokenMultiplier}X multiplier!</h3>}
                    </Form>

                  </Col>
                  <Col>
                    <div className='py-4'>
                        <p className='text-center'><strong>Number of Tokens to play with:</strong> {playerTokens} {symbols}</p>
                    </div>
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