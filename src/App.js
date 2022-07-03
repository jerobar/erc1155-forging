import { useRef, useEffect, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import { AppShell, Container, Text, Space, Divider, Grid } from '@mantine/core'

import {
  metaMaskOnConnect,
  metaMaskOnChainChanged,
  metaMaskOnAccountsChanged,
  metaMaskOnDisconnect,
  // requestAccounts,
  fetchMaticBalance
} from './stores/metamask-slice'
import { userTokenBalancesUpdated } from './stores/token-slice'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './utils/contract-utils'
import { AppHeader } from './components/Layout/AppHeader'
import { PleaseConnect } from './components/PleaseConnect'
import { MintTokens } from './components/MintTokens'
import { ForgeTokens } from './components/ForgeTokens'
import { BurnTokens } from './components/BurnTokens'

export function App() {
  const contractRef = useRef(null)
  const { currentAccount, chainIsPolygon } = useSelector(
    (state) => state.metaMask
  )
  const { tokenIds } = useSelector((state) => state.token)
  const dispatch = useDispatch()

  // Handle MetaMask connect event
  const dispatchMetaMaskOnConnect = useCallback(() => {
    dispatch(metaMaskOnConnect())
  }, [dispatch])

  // Handle MetaMask chainChanged event
  const dispatchMetaMaskOnChainChanged = useCallback(() => {
    dispatch(metaMaskOnChainChanged())
  }, [dispatch])

  // Handle MetaMask accountsChanged event
  const dispatchMetaMaskOnAccountsChanged = useCallback(() => {
    dispatch(metaMaskOnAccountsChanged())
  }, [dispatch])

  // Handle MetaMask disconnect event
  const dispatchMetaMaskOnDisconnect = useCallback(() => {
    dispatch(metaMaskOnDisconnect())
  }, [dispatch])

  // Attach/detach listeners for MetaMask events
  useEffect(() => {
    window.ethereum.on('connect', dispatchMetaMaskOnConnect)
    window.ethereum.on('chainChanged', dispatchMetaMaskOnChainChanged)
    window.ethereum.on('accountsChanged', dispatchMetaMaskOnAccountsChanged)
    window.ethereum.on('disconnect', dispatchMetaMaskOnDisconnect)

    return () => {
      window.ethereum.removeListener('connect', dispatchMetaMaskOnConnect)
      window.ethereum.removeListener(
        'chainChanged',
        dispatchMetaMaskOnChainChanged
      )
      window.ethereum.removeListener(
        'accountsChanged',
        dispatchMetaMaskOnAccountsChanged
      )
      window.ethereum.removeListener('disconnect', dispatchMetaMaskOnDisconnect)
    }
  }, [
    dispatchMetaMaskOnConnect,
    dispatchMetaMaskOnChainChanged,
    dispatchMetaMaskOnAccountsChanged,
    dispatchMetaMaskOnDisconnect
  ])

  // Fetch current MetaMask account addresses
  // useEffect(() => {
  //   if (metaMaskIsInstalled) {
  //     dispatch(requestAccounts())
  //   }
  // }, [metaMaskIsInstalled, dispatch])

  // Fetch MATIC balance of current account
  useEffect(() => {
    if (currentAccount) {
      dispatch(fetchMaticBalance(currentAccount))
    }
  }, [currentAccount, dispatch])

  // Fetch token balances of current account
  useEffect(() => {
    if (contractRef.current && currentAccount) {
      async function updateUserTokenBalances() {
        const bigNumberTokenIds = await contractRef.current.balanceOfBatch(
          tokenIds.map(() => currentAccount),
          tokenIds
        )

        dispatch(
          userTokenBalancesUpdated({
            tokenBalances: bigNumberTokenIds.map((bigNumberTokenId) =>
              bigNumberTokenId.toNumber()
            )
          })
        )
      }
      updateUserTokenBalances()
    }
  }, [contractRef, currentAccount, tokenIds, dispatch])

  // Initialize signed ethers contract
  useEffect(() => {
    if (chainIsPolygon) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      contractRef.current = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      )
    }
  }, [chainIsPolygon])

  return (
    <AppShell header={<AppHeader />} padding={'md'}>
      <Container>
        <Text>
          View collection on OpenSea(link)! Browse verified contract on
          ________.
        </Text>
        {(!currentAccount || !chainIsPolygon) && <PleaseConnect />}
        <Space h={20} />
        <MintTokens contractRef={contractRef} />
        {currentAccount && chainIsPolygon && (
          <>
            <Divider
              color={'#dbdbdb'}
              size={'sm'}
              style={{ margin: '36px 0 30px 0' }}
            />
            <Grid grow>
              <Grid.Col xs={12} sm={6}>
                <ForgeTokens contractRef={contractRef} />
              </Grid.Col>
              <Grid.Col xs={12} sm={6}>
                <BurnTokens contractRef={contractRef} />
              </Grid.Col>
            </Grid>
            <Space h={40} />
          </>
        )}
      </Container>
    </AppShell>
  )
}
