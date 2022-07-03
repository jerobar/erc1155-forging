import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

import { metaMaskUtils } from '../utils/metamask-utils'

export const fetchCurrentAccount = createAsyncThunk(
  'metaMask/fetchCurrentAccount',
  async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    console.log('fetchCurrentAccount accounts:', accounts)

    return accounts[0]
  }
)

export const fetchMaticBalance = createAsyncThunk(
  'metaMask/fetchMaticBalance',
  async (address) => {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    })

    return balance
  }
)

const initialState = {
  metaMaskIsInstalled:
    window.ethereum && metaMaskUtils.isInstalled(window.ethereum),
  metaMaskIsConnected: window.ethereum && window.ethereum.isConnected(),
  chainIsPolygon:
    window.ethereum && metaMaskUtils.chainIsPolygon(window.ethereum),
  currentAccount: null,
  maticBalance: null
}

export const metaMaskSlice = createSlice({
  name: 'metaMask',
  initialState,
  reducers: {
    metaMaskOnConnect(state, action) {
      state.metaMaskIsInstalled = true
      state.metaMaskIsConnected = true
      state.chainIsPolygon = metaMaskUtils.chainIsPolygon(window.ethereum)
    },
    metaMaskOnChainChanged(state, action) {
      state.chainIsPolygon = metaMaskUtils.chainIsPolygon(window.ethereum)
    },
    metaMaskOnAccountsChanged(state, action) {
      state.currentAccount = null
    },
    metaMaskOnDisconnect(state, action) {
      state.metaMaskIsConnected = false
      state.chainIsPolygon = false
      state.currentAccount = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAccount.fulfilled, (state, action) => {
        state.currentAccount = action.payload
      })
      .addCase(fetchMaticBalance.fulfilled, (state, action) => {
        state.maticBalance = ethers.utils.formatEther(action.payload)
      })
  }
})

export const {
  metaMaskOnConnect,
  metaMaskOnChainChanged,
  metaMaskOnAccountsChanged,
  metaMaskOnDisconnect
} = metaMaskSlice.actions

export default metaMaskSlice.reducer
