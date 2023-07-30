import { createSlice } from '@reduxjs/toolkit'

export const wargame = createSlice({
  name: 'wargame',
  initialState: {
    contract: null,
    balance: 0,
    gametime: 3, // Game time in minutes
    slowtime: 2, // Amount of seconds to slow game down
    playtime: 6, // Amount of seconds before game automatically plays
    paying: {
      isPaying: false,
      isSucccess: false,
      transactionHash: null
    },
    withdrawing: {
      isWithdrawing: false,
      isSucccess: false,
      transactionHash: null
    },

  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setGameTime: (state, action) => {
      state.gametime = action.payload
    },
    setSlowTime: (state, action) => {
      state.slowtime = action.payload
    },
    setPlayTime: (state, action) => {
      state.playtime = action.payload
    },
    payPlayerRequest: (state, action) => {
      state.paying.isPaying = true
      state.paying.isSuccess = false
      state.paying.transactionHash = null
    },
    payPlayerSuccess: (state, action) => {
      state.paying.isPaying = false
      state.paying.isSuccess = true
      state.paying.transactionHash = action.payload
    },
    payPlayerFail: (state, action) => {
      state.paying.isPaying = false
      state.paying.isSuccess = false
      state.paying.transactionHash = null
    },
    withdrawRequest: (state, action) => {
      state.withdrawing.isWithdrawing = true
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    withdrawSuccess: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = true
      state.withdrawing.transactionHash = action.payload
    },
    withdrawFail: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    }
  }
})

export const { 
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

} = wargame.actions;

export default wargame.reducer;
