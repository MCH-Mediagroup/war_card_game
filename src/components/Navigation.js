import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import Blockies from 'react-blockies'

import logo from '../logo.png';

import { loadAccount, loadBalances } from '../store/interactions'

const Navigation = () => {
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)
  const playerBalance = useSelector(state => state.tokens.balances)
  const symbols = useSelector(state => state.tokens.symbols)

  const dispatch = useDispatch()

  const connectHandler = async () => {
    const account = await loadAccount(dispatch)
   
        await loadBalances(tokens, account, dispatch)

  }
  useEffect(() => {
    if(account) {
      connectHandler()
    }
  }, [account])

  return (
    <Navbar className='my-1' expand="lg" variant='dark'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#"><h4>Card Wars</h4></Navbar.Brand>
      {account && 
        <div className='mt-1 mx-5 px-5'>
          <h5>Total Balance: {playerBalance} {symbols}</h5>
        </div>
    }

      <Navbar.Toggle aria-controls="nav" />

      <Navbar.Collapse id="nav" className="justify-content-end">

        <div className="d-flex justify-content-end mt-0">

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
