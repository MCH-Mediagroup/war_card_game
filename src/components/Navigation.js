import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Blockies from 'react-blockies'

import logo from '../logo.png';

import { loadAccount, saveGameTime } from '../store/interactions'

import config from '../config.json'

const Navigation = () => {
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)
  const wargame = useSelector(state => state.wargame.contract)
  const gametimes = useSelector(state => state.wargame.time)
  const [gameTime, setGameTime] = useState(0)


  const dispatch = useDispatch()

  const connectHandler = async () => {
    const account = await loadAccount(dispatch)
        const MINUTES_TO_ADD = 60000 * 10  // 3 minute
        let GAME_TIMER = (new Date().getTime() + (MINUTES_TO_ADD)).toString().slice(0, 10);
        setGameTime(GAME_TIMER.toString() + '000')

        saveGameTime(gameTime, dispatch)
    
    // await loadBalances(wargame, tokens, dispatch)
  }

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: e.target.value }],
    })
  }

  return (
    <Navbar className='my-3' expand="lg">
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">MCH Media Group</Navbar.Brand>

      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">

      <div className="d-flex justify-content-end mt-3">

        <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}
          >
            <option value="0" disabled>Select Network</option>
            <option value="0x7A69">Localhost</option>
            <option value="0x5">Goerli</option>
        </Form.Select>

        {account ? (
            <Navbar.Text className='d-flex align-items-center'>
            {account.slice(0, 5) + '...' + account.slice(38, 42)}
            <Blockies
                seed={account}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon mx-2"
              />
          </Navbar.Text>
      ) : (
        <Button onClick={connectHandler}>Connect</Button>
        )}

      </div>
       
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
