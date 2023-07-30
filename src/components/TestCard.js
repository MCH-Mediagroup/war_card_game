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

  
  // const [gameTime, setGameTime] = useState(0)
  const [firstRun, setFirstRun] = useState(true)
  const [isBetting, setIsBetting] = useState(false)
  const [hasBet, setHasBet] = useState(false)

  const [showAlert, setShowAlert] = useState(false)


  let [playerTokens, setPlayerTokens] = useState(0)
  let [gameTokens, setGameTokens] = useState(0)
  let [tokenAmount, setTokenAmount] = useState(0)
  let [tokenMultiplier, setTokenMultiplier] = useState(1)



  const dispatch = useDispatch()
      // Fetch Countdown
  const MINUTES_TO_ADD = 60000 * gametime  // default is 3 minutes


  const loadInitialData = async () => {

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
 
  if (firstRun){
      setFirstRun(false);
    }
};
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
setFirstRun(true)

console.log(`Total Player Tokens after reset: ${playerTokens}\n`)

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

        </div>
      )
}



export default TestCard;