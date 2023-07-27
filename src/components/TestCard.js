import { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers'
import { loadWargame } from '../store/interactions'

import Alert from './Alert'

import {
  payPlayer,
  loadBalances
} from '../store/interactions'


const TestCard = () => {
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)

  const tokens = useSelector(state => state.tokens.contracts)
  const symbols = useSelector(state => state.tokens.symbols)
  const wargame = useSelector(state => state.wargame.contract)
  const balance = useSelector(state => state.wargame.balance)
  const balances = useSelector(state => state.tokens.balances)


  const [showAlert, setShowAlert] = useState(false)

  const [accountBalance, setAccountBalance] = useState(0)
  let [playerTokens, setPlayerTokens] = useState(50)
  let [gameTokens, setGameTokens] = useState(50)
  let [tokensPaid, setTokensPaid] = useState(50)



  const dispatch = useDispatch()
  const loadInitialData = async () => {

    // Fetch account balance
    //setAccountBalance(balance)
    // Fetch tokens sold
    setTokensPaid(ethers.utils.formatUnits(await wargame.tokensPaid(), 18))

    console.log(balance)

}
const betAllHandler = async () => {
  // e.preventDefault()
  setShowAlert(false)

  setGameTokens(playerTokens + 100)

  console.log(`Game Tokens betting all: ${gameTokens}\n`)

  setPlayerTokens(0)


  setShowAlert(true)

}
const payPlayerHandler = async () => {
  // e.preventDefault()
  console.log(`Game Tokens before: ${gameTokens}\n`)
  console.log(`Player Tokens before: ${playerTokens}\n`)


  setShowAlert(false)
  
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
setPlayerTokens(50)
setGameTokens(50)
playerTokens = 50
gameTokens = 50
console.log(`Total Player Tokens after reset: ${playerTokens}\n`)

setShowAlert(true)

}

      useEffect(() => {
        loadInitialData()
      }, []);
    
      return (
        <>
          <p className='text-center'><strong>Total Token Balance:</strong> {balance} ETH</p>
          <p className='text-center'><strong>Player Token Balance:</strong> {playerTokens} ETH</p>
          <p className='text-center'><strong>Player Token Total Balance:</strong> {balances} ETH</p>
          <p className='text-center my-3'>{tokensPaid} / {balance} Tokens paid</p>

          <Button  onClick={betAllHandler}>Bet it All!</Button>
          <Button  onClick={payPlayerHandler}>Simulate Play</Button>

        </>
      )
}



export default TestCard;