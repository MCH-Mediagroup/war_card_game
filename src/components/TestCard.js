import { useEffect, useState } from 'react'

import { ethers } from 'ethers'

import TOKEN_ABI from '../abis/Token.json';
import WARGAME_ABI from '../abis/Wargame.json';
import config from '../config.json';
import './War.css';

const TestCard = () => {
    const [provider, setProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const [accountBalance, setAccountBalance] = useState(0)

    const [wargame, setWargame] = useState(null)

    const loadBlockchainData = async () => {
        // Initiate provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)
    
        // Initiate contracts
        const token = new ethers.Contract(config[31337].token.address, TOKEN_ABI, provider)
        const wargame = new ethers.Contract(config[31337].wargame.address, WARGAME_ABI, provider)
        setWargame(wargame)
    
        // Fetch accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)

        // Fetch account balance
        const accountBalance = ethers.utils.formatUnits(await token.balanceOf(wargame.address), 18)
        setAccountBalance(accountBalance)
        console.log(accountBalance)
        
    
    }

      useEffect(() => {
          loadBlockchainData()
      }, []);
    
      return (
        <>
        </>
      )
}



export default TestCard;