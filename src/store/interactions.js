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
    //const wargameBalance = ethers.utils.formatUnits(await token.balanceOf(wargame.address), 18)
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
    // const tokenBalance = await tokens[0].balanceOf(account)
    // const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)
    const balance1 = await tokens.balanceOf(account)
    //const wargameBalance = ethers.utils.formatUnits(await token.balanceOf(wargame), 18)
  
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

    // const prc = 0
    // // We need to calculate the required ETH in order to buy the tokens...
    // // Fetch price
    // const price = ethers.utils.formatUnits(await prc, 18)

    // const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
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

    transaction = await tokens[0].connect(signer).approve(wargame.address, amount)
    await transaction.wait()

    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

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


