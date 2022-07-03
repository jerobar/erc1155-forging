import { Button } from '@mantine/core'

import { metaMaskUtils } from '../../utils/metamask-utils'
import { MetaMaskIcon } from './MetaMaskIcon'

export function ConnectToMetaMaskButton() {
  const textContent = 'Connect MetaMask'

  return (
    <Button
      onClick={() => metaMaskUtils.connect(window.ethereum)}
      alt={textContent}
      color={'cyan'}
      leftIcon={<MetaMaskIcon />}
      radius={'md'}
    >
      {textContent}
    </Button>
  )
}
