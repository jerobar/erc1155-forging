const NETWORKS = {
  polygon: {
    blockExplorerUrls: ['https://polygonscan.com'],
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com']
  },
  rinkeby: {
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    chainId: '0x4',
    chainName: 'Rinkeby Test Network',
    nativeCurrency: {
      name: 'RinkebyETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/']
  }
}

function isInstalled(ethereum) {
  return !!(ethereum && ethereum.isMetaMask)
}

async function connect(ethereum) {
  try {
    console.log('trying...')
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })

    return accounts.length > 0
  } catch (error) {
    console.error(error)

    return false
  }
}

function chainIsPolygon(ethereum) {
  return !!(ethereum && ethereum.chainId === NETWORKS.rinkeby.chainId)
}

async function switchToPolygon(ethereum) {
  if (ethereum.isConnected()) {
    try {
      // Switch chain to Polygon
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.rinkeby.chainId }]
      })
    } catch (switchError) {
      // If Polygon chain not yet added to MetaMask
      if (switchError.code === 4902) {
        try {
          // Add Polygon chain to MetaMask
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: NETWORKS.rinkeby.chainId,
                chainName: NETWORKS.rinkeby.chainName,
                nativeCurrency: NETWORKS.rinkeby.nativeCurrency,
                rpcUrls: NETWORKS.rinkeby.rpcUrls,
                blockExplorerUrls: NETWORKS.rinkeby.blockExplorerUrls
              }
            ]
          })
        } catch (addError) {
          // Chain could not be added
          console.error(addError)
        }
      }

      // If other switch connection error
      console.error(switchError)
    }
  }
}

async function currentAccount(ethereum) {
  const accounts = await ethereum.request({ method: 'eth_accounts' })

  return accounts[0]
}

async function currentAccountBalance(ethereum) {
  const account = await currentAccount(ethereum)

  const balance = await ethereum.request({
    method: 'eth_getBalance',
    params: [account, 'latest']
  })

  return balance
}

export const metaMaskUtils = {
  isInstalled,
  connect,
  chainIsPolygon,
  switchToPolygon,
  currentAccount,
  currentAccountBalance
}
