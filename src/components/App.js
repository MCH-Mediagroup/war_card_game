import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs'
import Wargame from './Wargame';
import Rewards from './Rewards';
import Admin from './Admin';
import Instructions from './Instructions';

import { 
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadWargame
} from '../store/interactions';

function App() {

  const dispatch = useDispatch()

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
    await loadTokens(provider, chainId, dispatch)
    // console.log(tokens)
    await loadWargame(provider, chainId, dispatch)

  }

 
  
  useEffect(() => {
      loadBlockchainData()
  });

  return(
    <Container>
      <HashRouter>
        <Navigation />

        <hr />

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Wargame />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>

      </HashRouter>
    </Container>
  )
}
export default App;
// 