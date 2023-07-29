import { createSlice } from '@reduxjs/toolkit'

export const wargame = createSlice({
  name: 'wargame',
  initialState: {
    contract: null,
    balance: 0,
    time: 0,
    paying: {
      isPaying: false,
      isSucccess: false,
      transactionHash: null
    }
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setTime: (state, action) => {
      state.time = action.payload
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

  }
})

export const { 
  setContract, 
  setBalance,
  setTime,
  payPlayerRequest,
  payPlayerSuccess,
  payPlayerFail
} = wargame.actions;

export default wargame.reducer;
