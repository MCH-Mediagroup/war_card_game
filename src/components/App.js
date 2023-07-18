import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Employees from './Employees';
import Cards from './Cards';

// ABIs: Import your contract ABIs here
// import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
// import config from '../config.json';

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [employees, setEmployees] = useState([])
  const [cards, setCards] = useState([])
  const [count, setCount] = useState(0)


  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch account balance
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatUnits(balance, 18)
    setBalance(balance)

    setIsLoading(false)
  }

  const fetchUserData = () => {
    fetch("https://localhost:7132/api/Employee/getall")
    .then(res => res.json())
    .then(data => {
        setEmployees(data)
      })
    }
    const fetchCardData = () => {
      fetch("https://localhost:7132/api/Cards/getcards")
        .then(res => res.json())
        .then(data => {
            setCards(data)
            setCount(cards.Length)
          })
          
        }
  
  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
      fetchUserData()
      fetchCardData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>React Hardhat Template</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Your ETH Balance:</strong> {balance} ETH</p>
          <p className='text-center'>Edit App.js to add your code here.</p>
          {/* <Employees 
            employees={employees}
          /> */}
          <Cards 
            cards={cards}
            count={count}
          />
        </>
      )}
    </Container>
  )
}

export default App;
