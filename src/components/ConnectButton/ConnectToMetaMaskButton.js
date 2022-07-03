import { useDispatch } from 'react-redux'
import { Button } from '@mantine/core'

import { requestAccounts } from '../../stores/metamask-slice'
import { MetaMaskIcon } from './MetaMaskIcon'

export function ConnectToMetaMaskButton() {
  const dispatch = useDispatch()
  const textContent = 'Connect MetaMask'

  return (
    <Button
      onClick={() => dispatch(requestAccounts())}
      alt={textContent}
      color={'cyan'}
      leftIcon={<MetaMaskIcon />}
      radius={'md'}
    >
      {textContent}
    </Button>
  )
}
