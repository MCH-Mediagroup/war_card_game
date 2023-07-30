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

import {
  payPlayer,
  loadBalances,
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
  
  // const [gameTime, setGameTime] = useState(0)
  const [firstRun, setFirstRun] = useState(true)
  const [isBetting, setIsBetting] = useState(false)
  const [hasBet, setHasBet] = useState(false)

  const [showAlert, setShowAlert] = useState(false)

  const [accountBalance, setAccountBalance] = useState(0)

  let [playerTokens, setPlayerTokens] = useState(50)
  let [gameTokens, setGameTokens] = useState(50)
  let [tokensPaid, setTokensPaid] = useState(50)
  const [tokenAmount, setTokenAmount] = useState(0)
  // const [timerTime, setTimerTime] = React.useState(Date.now() + MINUTES_TO_ADD);



  const dispatch = useDispatch()
      // Fetch Countdown
    // For Testing
    let isBegun = true;
    const MINUTES_TO_ADD = 60000 * gametime  // default is 3 minutes


  const loadInitialData = async () => {

    // setTokensPaid(ethers.utils.formatUnits(await wargame.tokensPaid(), 18))

    console.log(`Total Game Tokens available: ${wargameBalance}\n`)


}
useEffect(() => {
   loadInitialData()
   
}, []);

const isBettingHandler = async () => {
  setIsBetting(true)
}
const cancelBetHandler = async () => {
  setIsBetting(false)
}
const betHandler = async () => {
  // e.preventDefault()
  const _tokenAmount = ethers.utils.parseUnits(tokenAmount, 'ether')

  await withdrawTokens(provider, wargame, tokens, _tokenAmount, dispatch)

  await loadBalances(tokens, account, dispatch)

  setGameTokens(_tokenAmount * 2)

  console.log(`Game Tokens betting : ${gameTokens}\n`)

  setPlayerTokens(0)

  setHasBet(true)

}

const amountHandler = async (e) => {
    setTokenAmount(e.target.value)
}

const handleStartClick = () => {
 
  if (firstRun){
      setFirstRun(false);
    }
};
const payPlayerHandler = async () => {
  // e.preventDefault()
  console.log(`Game Tokens before: ${gameTokens}\n`)
  console.log(`Player Tokens before: ${playerTokens}\n`)


  setShowAlert(false)
  console.log(`First Run: ${firstRun}\n`)

  const testWinState = Math.floor(Math.random() * 4);

  let totalTokensWon = 0;

  switch( testWinState ) {
    case 1: // Win before timer expires
      totalTokensWon = gameTokens + 100;
      break;
    case 2: // Win after timer expires
      totalTokensWon = gameTokens + 50;
      break;
    case 3: // Draw
      totalTokensWon = gameTokens;
      break;
    default: // Lose
    totalTokensWon = 0;
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
// setPlayerTokens(50)
// setGameTokens(50)
// playerTokens = 50
// gameTokens = 50
console.log(`Total Player Tokens after reset: ${playerTokens}\n`)

//setTokensPaid(ethers.utils.formatUnits(await wargame.tokensPaid(), 18))
// setGameTime(gameOn.toString() + '000')

handleStartClick()

setShowAlert(true)

}

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
        <div>
          {account ? (
            <>
              <h1 className='my-4 text-center'>Let's Play War!</h1>
              <div className='my-4 text-center'>
                {!firstRun && <Countdown date={Date.now() + (MINUTES_TO_ADD)} className='h2' autoStart={true} renderer={renderer} />} <br />
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
                          <Button className='m-2'>Go For It!</Button>
                          <Button onClick={cancelBetHandler} className='m-2'>Cancel</Button>
                        </Row>
                    </>
                    }
                    {!isBetting && !hasBet && <Button  onClick={isBettingHandler} className='m-2'>Bet your {symbols} Tokens?</Button>}
                    {hasBet && <h3 className='my-4 text-center'>Playing with : {gameTokens} beginning Tokens!</h3>}
                  </Form>
                </Col>
                <Col>
                {/* <p className='text-center'><strong>Total Token Balance:</strong> {balance} ETH</p> */}
                <p className='text-center'><strong>Your {symbols} Total Balance:</strong> {playerBalance} {symbols}</p>
                <p className='text-center'><strong>Number of Tokens to play with:</strong> {playerTokens} {symbols}</p>
                {/* <p className='text-center my-3'>{tokensPaid} / {balance} Tokens paid</p> */}
                
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
        </div>
      )
}



export default TestCard;