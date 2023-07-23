import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs'
import Cards from './Cards';
import NFT from './NFT';
import Admin from './Admin';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken,
  loadWargame
} from '../store/interactions';


// ABIs: Import your contract ABIs here
// import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
// import config from '../config.json';

function App() {

  const dispatch = useDispatch()

  const [cards, setCards] = useState([])

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = await loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })
   
    // Fetch accounts
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
    })


    // Initiate contracts
    await loadToken(provider, chainId, dispatch)
    await loadWargame(provider, chainId, dispatch)

  }


  
    const fetchCardData = () => {
      fetch("https://localhost:5001/api/Cards/getcards")
        .then(res => res.json())
        .then(data => {
            setCards(data)
          })
          // console.log(cards)
        }
  
  useEffect(() => {
      loadBlockchainData()
      fetchCardData()
  }, []);

  return(
    <Container>
      <HashRouter>
        <Navigation />

        <hr />

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Cards />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/nft" element={<NFT />} />
        </Routes>

      </HashRouter>
    </Container>
  )
}
export default App;
