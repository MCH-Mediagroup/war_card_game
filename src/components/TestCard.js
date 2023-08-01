import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import Countdown from 'react-countdown';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers'

import Alert from './Alert'
import './War.css';

import {
  payPlayer,
  loadBalances,
  loadAccount,
  withdrawTokens
} from '../store/interactions'


const TestCard = () => {
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const wargame = useSelector(state => state.wargame.contract)
  const wargameBalance = useSelector(state => state.wargame.balance)
  const playerBalance = useSelector(state => state.tokens.balances)
  const gametime = useSelector(state => state.wargame.gametime)
  const slowtime = useSelector(state => state.wargame.slowtime)
  const playtime = useSelector(state => state.wargame.playtime)
  const isWithdrawing = useSelector(state => state.wargame.withdrawing.isWithdrawing)
  const isSuccess = useSelector(state => state.wargame.withdrawing.isSuccess)
  const transactionHash = useSelector(state => state.wargame.withdrawing.transactionHash)
  const error = useSelector(state => state.wargame.withdrawing.error)
  const isPaying = useSelector(state => state.wargame.paying.isWithdrawing)
  const isSuccessPaying = useSelector(state => state.wargame.paying.isSuccess)
  const payTransactionHash = useSelector(state => state.wargame.paying.transactionHash)

  
  const [dateTime, setDateTime] = useState(0)
  let [firstRun, setFirstRun] = useState(true)
  let [showCardDeck, setShowCardDeck] = useState(false)
  const [isBetting, setIsBetting] = useState(false)
  const [hasBet, setHasBet] = useState(false)

  const [showAlert, setShowAlert] = useState(false)


  let [playerTokens, setPlayerTokens] = useState(0)
  let [gameTokens, setGameTokens] = useState(0)
  let [tokenAmount, setTokenAmount] = useState(0)
  let [tokenMultiplier, setTokenMultiplier] = useState(1)
  let [winState, setWinState] = useState(0)



  const dispatch = useDispatch()
      // Fetch Countdown
  const MINUTES_TO_ADD = 60000 * gametime  // default is 3 minutes

  let [data, setCards] = useState([])

  const fetchCardData = () => {
    fetch("http://192.168.254.133:5050/api/Cards/getcards")
      .then(res => res.json())
      .then(data => {
          setCards(data)
        //   console.log(data)
        })
         //console.log(cards)
      }

      useEffect(() => {
        fetchCardData()
    }, []);



  const loadInitialData = async () => {

    console.log(`Total Game Tokens available: ${wargameBalance}\n`)

}

const isBettingHandler = async () => {
  setIsBetting(true)
}
const cancelBetHandler = async () => {
  setIsBetting(false)
}
const betHandler = async (e) => {
  e.preventDefault()
  setShowAlert(false)
  


  console.log(`TokenAmount : ${tokenAmount}\n`)


  console.log(`Account : ${account}\n`)

  await withdrawTokens(provider, wargame, tokens, tokenAmount, dispatch)

  await loadBalances(tokens, account, dispatch)

  setGameTokens(Number(tokenAmount))

  setTokenMultiplier(2)
  tokenMultiplier = 2

  console.log(`Game Tokens betting : ${gameTokens} with multiplier: ${tokenMultiplier}\n`)

  setPlayerTokens(0)

  setHasBet(true)

  setShowAlert(true)


}

const amountHandler = async (e) => {
    setTokenAmount(e.target.value)
}

const handleStartClick = () => {
  setShowCardDeck(true)
  setDateTime(Date.now() + (MINUTES_TO_ADD))

  // if (firstRun){
  //     setFirstRun(false);
  //     fetchCardData()

  //     dealCards(cards);

  //   }
};
const payPlayerHandler = async () => {
  // e.preventDefault()

  console.log(`Game Tokens before: ${gameTokens}\n`)
  console.log(`Player Tokens before: ${playerTokens}\n`)
  console.log(`Token multiplier before: ${tokenMultiplier}\n`)


  setShowAlert(false)
  // console.log(`First Run: ${firstRun}\n`)

  let testWinState = Math.floor(Math.random() * 4);
  //setWinState(testWinState)
  winState = testWinState

  let totalTokensWon = 0;

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
  console.log(`Winning State: ${winState}\n`)
  console.log(`Total Player Tokens won: ${playerTokens}\n`)
  console.log(`Total Tokens won: ${totalTokensWon}\n`)




  const _tokenAmount = playerTokens

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
setFirstRun(true)
setWinState(0)

console.log(`Total Player Tokens after reset: ${playerTokens}\n`)

setShowAlert(true)

}

    // Cards Game below this comment
    //  The cards from the API is called randomCards

    // var suits = ["spades", "hearts", "clubs", "diams"];
    // var cardFace = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var cards = data;
    var players = [
        [],
        []
    ];
    // var firstRun = true;
    var gameover = false;
    var timer;
    var r = 0;
    // var fightButton = document.querySelector("#btnBattle");

    var p1 = document.querySelector("#player1 .hand");
    var p2 = document.querySelector("#player2 .hand");
    var s1 = document.querySelector("#player1 .score");
    var s2 = document.querySelector("#player2 .score");

    //event listeners
    // fightButton.addEventListener('click', battle);
    // fightButton10.addEventListener('click', function () {
    //     rounds(10);
    // });
    // fightButton50.addEventListener('click', function () {
    //     rounds(50);
    // });

    
              //functions
            //   function rounds(a) {
            //     r = a;
            //     timer = setInterval(function () {
            //         battle()
            //     }, 100);
            // }
    
            function battle() {
                if (timer) {
                    r--;
                    outputMessage("Rounds left " + r);
                    if (r < 1) {
                        window.clearInterval(timer);
                    }
                }
                if (firstRun) {
                    //setFirstRun(false);
                    firstRun = false;
                    // buildCards();
                    // shuffleArray(cards);
                    fetchCardData()
                    dealCards(cards);
                }
                attack();
            }
    
            function attack() {
                if (!gameover) {
                    var card1 = players[0].shift();
                    var card2 = players[1].shift();
                    var pot = [card1, card2];
                    p1.innerHTML = showCard(card1, 0);
                    p2.innerHTML = showCard(card2, 0);
                    checkWinner(card1, card2, pot);
                    s1.innerHTML = players[0].length; 
                    s2.innerHTML = players[1].length; 
                } else {
                    outputMessage("Game over");
                }
            }
    
            function outputMessage(message) {
                document.getElementById("message").innerHTML = message;
            }
    
            function checkWinner(card1, card2, pot) {
                if ((players[0].length <= 4) || (players[1].length <= 4)) {
                    gameover = true;
                    setWinState((players[1].length <= 4) ? 1 : 0 )
                    payPlayerHandler();
                    return;
                }
                if (card1.cardValue > card2.cardValue) {
                    outputMessage("Player wins");
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
    

const Completionist = () => <strong>Game Over!</strong>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    gameover = true
    winState = (players[1].length >= players[0].length) ? 2 : 0 
    if (players[1].length === players[0].length){
            winState = 3}

    outputMessage("Game over");
    payPlayerHandler();
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
        <div>
          {account ? (
            <>
              <h1 className='my-4 text-center'>Let's Play War!</h1>
              <div className='my-4 text-center'>
                {showCardDeck && <Countdown date={dateTime} className='h2' autoStart={true} renderer={renderer} />} <br />
              </div>
              <Row>
                <Col>
                  <Form onSubmit={betHandler} style={{ maxWidth: '250px', margin: '50px auto' }}>
                  { isBetting && !hasBet &&
                  <>
                      <Row>
                            <Form.Text className='text-end my-2' muted>
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
                          <Button type="submit" className='m-2'>Go For It!</Button>
                          <Button onClick={cancelBetHandler} className='m-2'>Cancel</Button>
                        </Row>
                    </>
                    }
                    {!isBetting && !hasBet && <Button  onClick={isBettingHandler} className='m-2'>Bet your {symbols} Tokens?</Button>}
                    {hasBet && <h3 className='my-4 text-center'>Playing with : {gameTokens} beginning Tokens and a {tokenMultiplier}X multiplier!</h3>}
                  </Form>
                </Col>
                <Col>
                <p className='text-center'><strong>Your {symbols} Total Balance:</strong> {playerBalance} {symbols}</p>
                <p className='text-center'><strong>Number of Tokens to play with:</strong> {playerTokens} {symbols}</p>
                
                </Col>
              </Row>

              <div className='my-4 text-center'>

                <Button  onClick={handleStartClick} className='my-4'>Begin Game</Button> <br />
                <Button  onClick={payPlayerHandler}>Simulate Play</Button>
            </div>
            <Row>
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
        {showCardDeck &&
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
                  <div id="action">
                  <Button  onClick={battle}>Fight</Button>

                      {/* <button id="btnBattle" type="button" className="btn">Fight</button> */}

                  </div>
              </div>
          </div>
        }
        </div>
      )
}



export default TestCard;