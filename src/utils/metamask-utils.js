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

// async function connect(ethereum) {
//   try {
//     console.log('trying...')
//     const accounts = await ethereum.request({
//       method: 'eth_requestAccounts'
//     })
//     console.log(accounts)

//     return accounts.length > 0
//   } catch (error) {
//     console.error(error)

//     return false
//   }
// }

async function requestAccounts(ethereum) {
  try {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })

    return accounts
  } catch (error) {
    console.error(error)

    return false
  }
}

function chainIsPolygon(ethereum) {
  return !!(ethereum && ethereum.chainId === NETWORKS.polygon.chainId)
}

async function switchToPolygon(ethereum) {
  if (ethereum.isConnected()) {
    try {
      // Switch chain to Polygon
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.polygon.chainId }]
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
                chainId: NETWORKS.polygon.chainId,
                chainName: NETWORKS.polygon.chainName,
                nativeCurrency: NETWORKS.polygon.nativeCurrency,
                rpcUrls: NETWORKS.polygon.rpcUrls,
                blockExplorerUrls: NETWORKS.polygon.blockExplorerUrls
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

/**
 * Runs `transaction` then periodically calls `confirmation` callback to see if
 * it will return true (transaction 'confirmed').
 *
 * Usage:
 *
 * transactAndConfirm(
 *   // Transaction
 *   async () => contract.mint(address, tokenId, amount),
 *   // Confirmation callback
 *   async () =>
 *     contract.balanceOf(address, tokenId)
 *       .then(tokenCount => tokenCount.toNumber() === currentTokenCount + amount),
 * )
 * .then(confirmed => {
 *   if (confirmed) {
 *     console.log('Transaction confirmed!')
 *   } else {
 *     console.log('Transaction not confirmed!')
 *   }
 * })
 *
 * @param  {Function} transaction  Transaction to run.
 * @param  {Function} confirmation Confirmation callback.
 * @param  {Number}   [delay=3000] Frequency with which to check `confirmation`.
 * @param  {Number}   [limit=20]   Number of times to check `confirmation`.
 *
 * @return {Boolean}  Whether transaction was 'confirmed'.
 */
export async function transactAndConfirm(
  transaction,
  confirmation,
  delay = 3000,
  limit = 20
) {
  return new Promise((resolve, reject) => {
    try {
      transaction().then(() => {
        let confirmationAttempt = 1

        // Call `confirmation` every `delay` ms
        const confirmationInterval = setInterval(async () => {
          const transactionIsConfirmed = await confirmation()

          if (transactionIsConfirmed) {
            clearInterval(confirmationInterval)
            resolve(true)
          } else if (confirmationAttempt === limit) {
            clearInterval(confirmationInterval)
            resolve(false)
          }

          confirmationAttempt++
        }, delay)
      })
    } catch (transactionError) {
      reject(transactionError)
    }
  })
}

export const metaMaskUtils = {
  isInstalled,
  // connect,
  chainIsPolygon,
  switchToPolygon,
  currentAccount,
  currentAccountBalance,
  requestAccounts,
  transactAndConfirm
}
