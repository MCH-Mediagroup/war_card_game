import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import Card from 'react-bootstrap/Card';
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
  withdrawTokens,
  saveGameOver,
  savePlayGame,
  saveWinStatus
} from '../store/interactions'


const GameStatus = (props) => {
    const provider = useSelector(state => state.provider.connection)
    const account = useSelector(state => state.provider.account)
  
    const tokens = useSelector(state => state.tokens.contracts)
    const symbols = useSelector(state => state.tokens.symbols)
    const wargame = useSelector(state => state.wargame.contract)
    const wargameBalance = useSelector(state => state.wargame.balance)
    const playerBalance = useSelector(state => state.tokens.balances)
    const gametime = useSelector(state => state.wargame.gametime)
    const playgame = useSelector(state => state.wargame.playgame)
    //const gameover = useSelector(state => state.wargame.gameover)
    const winstatus = useSelector(state => state.wargame.winstatus)
  
    let [playerTokens, setPlayerTokens] = useState(0)
    // let [gameTokens, setGameTokens] = useState(0)
    let [tokenAmount, setTokenAmount] = useState(0)
    let [tokenMultiplier, setTokenMultiplier] = useState(1)

    const dispatch = useDispatch()

    console.log(`Game Tokens before: ${props.GameTokens}\n`)
    console.log(`Player Tokens before: ${playerTokens}\n`)
    console.log(`Token multiplier before: ${props.TokenMultiplier}\n`)
  
  
    // console.log(`First Run: ${firstRun}\n`)
  
    //let testWinState = Math.floor(Math.random() * 4);
  
    // testWinState = 1  // testing
  
    let totalTokensWon = 0;
  
    switch( props.WinState ) {
      case 1: // Win before timer expires
        totalTokensWon = (props.GameTokens + 100) * props.TokenMultiplier;
        break;
      case 2: // Win after timer expires
        totalTokensWon = (props.GameTokens + 50) * props.TokenMultiplier;
        break;
      case 3: // Draw
        totalTokensWon = props.GameTokens;
        break;
      default: // Lose
        totalTokensWon = 0;
        break
    }
  
    setPlayerTokens(totalTokensWon)
    playerTokens = totalTokensWon
    console.log(`Winning State: ${props.WinState}\n`)
    console.log(`Total Player Tokens won: ${playerTokens}\n`)
    console.log(`Total Tokens won: ${totalTokensWon}\n`)

  
    const payPlayerHandler = async () => {
        // e.preventDefault()
        //const _tokenAmount = playerTokens
      
        playerTokens !== 0 && await payPlayer(
            provider,
            wargame,
            playerTokens,
            dispatch
        )
      
        await loadBalances(tokens, account, dispatch)
      
      // reset player tokens
    //   setPlayerTokens(0)
    //   setGameTokens(0)
    //   playerTokens = 0
    //   gameTokens = 0
    //   setTokenAmount(0)
    //   setTokenMultiplier(1)
      
      // setFirstRun(true)
      
      // console.log(`Total Player Tokens after reset: ${playerTokens}\n`)
      
      
      }
      

    return (
        <>
        <h2>Game Status</h2>
        <Row>
            <Col>
                <div className='my-4 text-center'>
                     <h3>Total {symbols} Tokens Won : {playerTokens}</h3>
                </div>
            </Col>
            <Col>
                <div className='my-4 text-center'>
                    <Button  onClick={payPlayerHandler}>Pocket Winnings!</Button>
                </div>
            </Col>
        </Row>
                

        </>
    )
}

export default GameStatus;