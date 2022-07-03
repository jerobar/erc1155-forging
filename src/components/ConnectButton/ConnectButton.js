import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { InstallMetaMaskButton } from './InstallMetaMaskButton'
import { ConnectToMetaMaskButton } from './ConnectToMetaMaskButton'
import { SwitchToPolygonButton } from './SwitchToPolygonButton'

export function ConnectButton() {
  const { metaMaskIsInstalled, currentAccount, chainIsPolygon } = useSelector(
    (state) => state.metaMask
  )

  // Render appropriate connect button, based on MetaMask configuration
  const connectButton = useMemo(() => {
    if (!metaMaskIsInstalled) {
      return <InstallMetaMaskButton />
    } else if (!currentAccount) {
      return <ConnectToMetaMaskButton />
    } else if (!chainIsPolygon) {
      return <SwitchToPolygonButton />
    } else {
      return null
    }
  }, [metaMaskIsInstalled, currentAccount, chainIsPolygon])

  return connectButton
}
