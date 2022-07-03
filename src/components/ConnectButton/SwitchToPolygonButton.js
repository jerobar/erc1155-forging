import { Button } from '@mantine/core'

import { metaMaskUtils } from '../../utils/metamask-utils'
import { MetaMaskIcon } from './MetaMaskIcon'

export function SwitchToPolygonButton() {
  const textContent = 'Switch to Polygon'

  return (
    <Button
      onClick={() => {
        metaMaskUtils.switchToPolygon(window.ethereum)
      }}
      color={'cyan'}
      leftIcon={<MetaMaskIcon />}
      radius={'md'}
    >
      {textContent}
    </Button>
  )
}
