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
import Game from './Game'
import GameStatus from './GameStatus';

import {
  payPlayer,
  loadBalances,
  loadAccount,
  withdrawTokens,
  saveGameOver,
  savePlayGame,
  saveWinStatus
} from '../store/interactions'


const TestGame = () => {
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const wargame = useSelector(state => state.wargame.contract)
  const wargameBalance = useSelector(state => state.wargame.balance)
  const playerBalance = useSelector(state => state.tokens.balances)
  const gametime = useSelector(state => state.wargame.gametime)
  const playgame = useSelector(state => state.wargame.playgame)
  const gameover = useSelector(state => state.wargame.gameover)
  const winstatus = useSelector(state => state.wargame.winstatus)
  let player1cards = useSelector(state => state.wargame.player1cards)
  let player2cards = useSelector(state => state.wargame.player2cards)
  const isWithdrawing = useSelector(state => state.wargame.withdrawing.isWithdrawing)
  const isSuccess = useSelector(state => state.wargame.withdrawing.isSuccess)
  const transactionHash = useSelector(state => state.wargame.withdrawing.transactionHash)
  const isPaying = useSelector(state => state.wargame.paying.isWithdrawing)
  const isSuccessPaying = useSelector(state => state.wargame.paying.isSuccess)
  const payTransactionHash = useSelector(state => state.wargame.paying.transactionHash)

  const [dateTime, setDateTime] = useState(0)

  // const [gameTime, setGameTime] = useState(0)
  // const [firstRun, setFirstRun] = useState(true)
  const [isBetting, setIsBetting] = useState(false)
  const [hasBet, setHasBet] = useState(false)

  const [showAlert, setShowAlert] = useState(false)


  let [player1Cards, setPlayer1Cards] = useState(0)
  let [player2Cards, setPlayer2Cards] = useState(0)
  let [playerTokens, setPlayerTokens] = useState(0)
  let [gameTokens, setGameTokens] = useState(0)
  let [tokenAmount, setTokenAmount] = useState(0)
  let [tokenMultiplier, setTokenMultiplier] = useState(1)

  let [data, setCards] = useState([])


  const dispatch = useDispatch()
      // Fetch Countdown
  const MINUTES_TO_ADD = 60000 * gametime  // default is 3 minutes

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
// useEffect(() => {
//    loadInitialData()
   
// }, []);

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
 
  // if (firstRun){
  //     setFirstRun(false);
  //     setDateTime(Date.now() + (MINUTES_TO_ADD))
  //   }

};
const savePlayer1CardsHandler = (player1Score) => {
  setPlayer1Cards(player1Score)
}
const savePlayer2CardsHandler = (player2Score) => {
  setPlayer2Cards(player2Score)
}
const payPlayerHandler = async () => {
  // e.preventDefault()

  console.log(`Game Tokens before: ${gameTokens}\n`)
  console.log(`Player Tokens before: ${playerTokens}\n`)
  console.log(`Token multiplier before: ${tokenMultiplier}\n`)


  setShowAlert(false)
  // console.log(`First Run: ${firstRun}\n`)

  let testWinState = Math.floor(Math.random() * 4);

  // testWinState = 1  // testing

  let totalTokensWon = 0;

  switch( testWinState ) {
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
  console.log(`Winning State: ${testWinState}\n`)
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
// setFirstRun(true)

console.log(`Total Player Tokens after reset: ${playerTokens}\n`)

setShowAlert(true)

}

const Completionist = () => <strong>Game Over!</strong>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
  //   saveGameOver(true, dispatch)
  //   saveWinStatus (
  //     (player1cards > player2cards) ? (
  //         2
  //     ) : player1cards === player2cards ? (
  //         3
  //     ) : 0
  // )

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
      // Cards Game below this comment

    // Cards Game below this comment
    //  The cards from the API is called randomCards

    // var suits = ["spades", "hearts", "clubs", "diams"];
    // var cardFace = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var cards = data;
    var players = [
        [],
        []
    ];
    var firstRun = true;
    //var gameover = false;
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
                    firstRun = false;
                    // buildCards();
                    // shuffleArray(cards);
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
                    // gameover = true;
                    saveGameOver(true, dispatch)
                    saveWinStatus (
                        (players[1].length <= 4) ? (
                            1
                        ) : players[1].length === players[0].length ? (
                            3
                        ) : 0
                    )

                    return;
                }
                if (card1.cardValue > card2.cardValue) {
                    outputMessage("Player 1 wins");
                    players[0] = players[0].concat(pot);
                }
                else if (card1.cardValue < card2.cardValue) {
                    outputMessage("Player 2 wins");
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
    
            // function buildCards() {
            //     cards = [];
            //     for (var s in suits) {
            //         var suitNew = suits[s][0].toUpperCase();
            //         for (var n in cardFace) {
            //             var card = {
            //                 suit: suits[s],
            //                 num: cardFace[n],
            //                 cardValue: parseInt(n) + 2,
            //                 icon: suitNew
            //             }
            //             cards.push(card);
            //         }
            //     }
            // }
    
            function dealCards(array) {
                for (var i = 0; i < array.length; i++) {
                    var m = i % 2;
                    players[m].push(array[i]);
                }
            }
    
            // function shuffleArray(array) {
            //     for (var x = array.length - 1; x > 0; x--) {
            //         var ii = Math.floor(Math.random() * (x + 1));
            //         var temp = array[x];
            //         array[x] = array[ii];
            //         array[ii] = temp;
            //     }
            //     return array;
            // }

    
      return (
        <div>
          {account ? (
            <>
              <h1 className='my-4 text-center'>Let's Play War!</h1>
              <div className='my-4 text-center'>
                {!firstRun && 
               <Countdown date={dateTime} className='h2' autoStart={true} renderer={renderer} />
                //  !gameover ? (<Countdown date={dateTime} className='h2' autoStart={true} renderer={renderer} />
                //              ) : (
                //                <h2>Game Over!</h2>
                //              )
                } <br />
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
        <GameStatus />
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
            {!gameover && <Button  onClick={battle}>Fight</Button>}
        </div>
    </div>
</div>

        {/* <Game onSavePlayer1Cards={savePlayer1CardsHandler} onSavePlayer2Cards={savePlayer2CardsHandler}/> */}

        </div>
      )
}



export default TestGame