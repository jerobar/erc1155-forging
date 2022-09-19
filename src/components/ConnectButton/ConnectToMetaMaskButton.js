import { useDispatch } from 'react-redux'
import { Button } from '@mantine/core'

import { metaMaskUtils } from '../../utils/metamask-utils'
import {
  metaMaskOnConnect,
  metaMaskOnAccountsChanged
} from '../../stores/metamask-slice'
import { MetaMaskIcon } from './MetaMaskIcon'

export function ConnectToMetaMaskButton() {
  const dispatch = useDispatch()
  const textContent = 'Connect MetaMask'

  return (
    <Button
      onClick={async () => {
        metaMaskUtils.requestAccounts(window.ethereum).then((accounts) => {
          dispatch(metaMaskOnConnect())
          dispatch(metaMaskOnAccountsChanged({ accounts }))
        })
      }}
      alt={textContent}
      color={'cyan'}
      leftIcon={<MetaMaskIcon />}
      radius={'md'}
    >
      {textContent}
    </Button>
  )
}
