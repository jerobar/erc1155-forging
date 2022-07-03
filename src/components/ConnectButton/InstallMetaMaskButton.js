import { Button } from '@mantine/core'

import { MetaMaskIcon } from './MetaMaskIcon'

export function InstallMetaMaskButton() {
  const textContent = 'Install MetaMask'

  return (
    <Button
      component={'a'}
      href={'https://metamask.io/download/'}
      target={'_blank'}
      alt={textContent}
      color={'cyan'}
      leftIcon={<MetaMaskIcon />}
      radius={'md'}
    >
      {textContent}
    </Button>
  )
}
