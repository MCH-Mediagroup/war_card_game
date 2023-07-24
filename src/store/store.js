import { configureStore } from '@reduxjs/toolkit'

import provider from './reducers/provider'
import tokens from './reducers/tokens'
import wargame from './reducers/wargame'

export const store = configureStore({
    reducer: {
        provider,
        tokens,
        wargame
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})