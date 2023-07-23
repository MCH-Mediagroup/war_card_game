import { configureStore } from '@reduxjs/toolkit'

import provider from './reducers/provider'
import token from './reducers/token'
import wargame from './reducers/wargame'

export const store = configureStore({
    reducer: {
        provider,
        token,
        wargame
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})