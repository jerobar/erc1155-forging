import { useDispatch } from 'react-redux'
import { Button } from '@mantine/core'

import { metaMaskOnChainChanged } from '../../stores/metamask-slice'
import { metaMaskUtils } from '../../utils/metamask-utils'
import { MetaMaskIcon } from './MetaMaskIcon'

export function SwitchToPolygonButton() {
  const dispatch = useDispatch()
  const textContent = 'Switch to Polygon'

  return (
    <Button
      onClick={async () => {
        metaMaskUtils
          .switchToPolygon(window.ethereum)
          .then(() => dispatch(metaMaskOnChainChanged()))
      }}
      color={'cyan'}
      leftIcon={<MetaMaskIcon />}
      radius={'md'}
    >
      {textContent}
    </Button>
  )
}
