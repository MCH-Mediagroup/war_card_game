import { createSlice } from '@reduxjs/toolkit'

export const wargame = createSlice({
  name: 'wargame',
  initialState: {
    contract: null,
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
  }
})

export const { 
  setWargame, 
} = wargame.actions;

export default wargame.reducer;
