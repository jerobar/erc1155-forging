import { createSlice } from '@reduxjs/toolkit'

import {
  TOKENS,
  TOKEN_IDS,
  MINTABLE_TOKEN_IDS,
  FORGEABLE_TOKEN_IDS,
  FORGED_TOKEN_IDS
} from '../utils/token-utils'

const initialState = {
  tokens: TOKENS,
  tokenIds: TOKEN_IDS,
  mintableTokenIds: MINTABLE_TOKEN_IDS,
  forgeableTokenIds: FORGEABLE_TOKEN_IDS,
  forgedTokenIds: FORGED_TOKEN_IDS
}

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    userTokenBalancesUpdated(state, action) {
      const { tokenBalances } = action.payload

      for (let i = 0; i < tokenBalances.length; i++) {
        state.tokens[i].userSupply = tokenBalances[i]
      }
    },
    userAddedToken(state, action) {
      const { tokenId } = action.payload

      state.tokens[tokenId].userSupply += 1
    },
    userRemovedTokens(state, action) {
      const { tokenIds } = action.payload

      for (let i = 0; i < tokenIds.length; i++) {
        state.tokens[tokenIds[i]].userSupply -= 1
      }
    }
  }
})

export const { userTokenBalancesUpdated, userAddedToken, userRemovedTokens } =
  tokenSlice.actions

export default tokenSlice.reducer
