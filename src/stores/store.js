import { configureStore } from '@reduxjs/toolkit'

import metaMaskReducer from './metamask-slice'
import tokenReducer from './token-slice'

const store = configureStore({
  reducer: {
    metaMask: metaMaskReducer,
    token: tokenReducer
  }
})

export default store
