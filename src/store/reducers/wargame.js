import { createSlice } from '@reduxjs/toolkit'

export const wargame = createSlice({
  name: 'wargame',
  initialState: {
    contract: null,
    balance: 0
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
  }
})

export const { 
  setContract, 
  setBalance 
} = wargame.actions;

export default wargame.reducer;
