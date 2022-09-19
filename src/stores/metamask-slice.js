import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

import { metaMaskUtils } from '../utils/metamask-utils'

export const requestAccounts = createAsyncThunk(
  'metaMask/requestAccounts',
  async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      return accounts
    } catch (error) {
      console.error(error)
    }
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
      const { accounts } = action.payload
      if (accounts.length) state.currentAccount = accounts[0]
    },
    metaMaskOnDisconnect(state, action) {
      state.metaMaskIsConnected = false
      state.chainIsPolygon = false
      state.currentAccount = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestAccounts.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.currentAccount = action.payload[0]
        }
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
