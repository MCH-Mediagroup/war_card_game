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
    setBalance,
    setGameTime,
    setSlowTime,
    setPlayTime,
    payPlayerRequest,
    payPlayerSuccess,
    payPlayerFail,
    withdrawRequest,
    withdrawSuccess,
    withdrawFail
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
    const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    // Fetch wargame balance
    const wargameBalance = await token.balanceOf(wargame.address)
  
    dispatch(setBalance([
      ethers.utils.formatUnits(wargameBalance.toString(), 'ether'),
    ]))

  
    dispatch(setContract(wargame))

    return wargame
  }


//------------------------------------------------------------------------------
// LOAD BALANCE 
export const loadBalances = async (tokens, account, dispatch) => {
    const balance1 = await tokens.balanceOf(account)
  
    dispatch(balancesLoaded([
      ethers.utils.formatUnits(balance1.toString(), 'ether'),
    ]))

  }
// ------------------------------------------------------------------------------
// Pay Player
export const payPlayer = async (provider, wargame, amount,  dispatch) => {
  try {
    dispatch(payPlayerRequest())

    const signer = await provider.getSigner()

    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

    const transaction = await wargame.connect(signer).payPlayer(formattedAmount, { value: 0 })

    await transaction.wait()

    dispatch(payPlayerSuccess(transaction.hash))

  } catch (error) {
    dispatch(payPlayerFail())
  }
}
// ------------------------------------------------------------------------------
// Withdraw Tokens from Player
export const withdrawTokens = async (provider, wargame, tokens, amount, dispatch) => {
  try {
    dispatch(withdrawRequest())

    const signer = await provider.getSigner()

    let transaction

    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

    transaction = await tokens.connect(signer).approve(wargame.address, formattedAmount)
    await transaction.wait()

    transaction = await wargame.connect(signer).withdrawTokens(formattedAmount, { value: 0 })
    await transaction.wait()

    dispatch(withdrawSuccess(transaction.hash))

  } catch (error) {
    dispatch(withdrawFail())
  }
}

// ------------------------------------------------------------------------------
// SET GAME TIME
export const saveGameTime = async ( time, dispatch) => {
  dispatch(setGameTime(time))
}
// ------------------------------------------------------------------------------
// SET SLOW TIME
export const saveSlowTime = async ( time, dispatch) => {
  dispatch(setSlowTime(time))
}
// ------------------------------------------------------------------------------
// SET PLAY TIME
export const savePlayTime = async ( time, dispatch) => {
  dispatch(setPlayTime(time))
}
