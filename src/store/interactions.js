import { ethers } from 'ethers'

import { 
    setProvider,
    setNetwork,
    setAccount
} from './reducers/provider'

import { 
    setContracts,
    setSymbols,
    balancesLoaded
} from './reducers/tokens'

import { 
    setContract,
    setBalance
} from './reducers/wargame'

import TOKEN_ABI from '../abis/Token.json';
import WARGAME_ABI from '../abis/Wargame.json';
import config from '../config.json';

export const loadProvider = (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch(setProvider(provider))

    return provider
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch(setNetwork(chainId))

  return chainId
}

export const loadAccount = async (dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account
    
}

// ------------------------------------------------------------------------------
// LOAD CONTRACTS
export const loadTokens = async (provider, chainId, dispatch) => {
    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
  
    dispatch(setContracts(token))
    dispatch(setSymbols(await token.symbol()))
  }

  export const loadWargame = async (provider, chainId, dispatch) => {
    const wargame = new ethers.Contract(config[chainId].wargame.address, WARGAME_ABI, provider)
    const balance = await wargame.balanceOf(account)
  
    dispatch(setBalance([
      ethers.utils.formatUnits(balance.toString(), 'ether'),
    ]))

  
    dispatch(setContract(wargame))

    return wargame
  }


// ------------------------------------------------------------------------------
// LOAD BALANCE 
export const loadBalances = async (tokens, account, dispatch) => {
    const tokenBalance = await tokens[0].balanceOf(account)
  
    dispatch(balancesLoaded([
      ethers.utils.formatUnits(tokenBalance.toString(), 'ether'),
    ]))

  }

