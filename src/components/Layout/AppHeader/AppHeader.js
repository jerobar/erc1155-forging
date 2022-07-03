import { useMemo } from 'react'

import { useSelector } from 'react-redux'
import { Header, Container, Grid, Group, Text } from '@mantine/core'

import { ConnectButton } from '../../ConnectButton'
import { UserBalances } from '../../UserBalances'

export function AppHeader() {
  const { metaMaskIsInstalled, metaMaskIsConnected, chainIsPolygon } =
    useSelector((state) => state.metaMask)

  // Whether to render a connect button, based on MetaMask configuration
  const showConnectButton = useMemo(() => {
    return !(metaMaskIsInstalled && metaMaskIsConnected && chainIsPolygon)
  }, [metaMaskIsInstalled, metaMaskIsConnected, chainIsPolygon])

  return (
    <Header p={'md'}>
      <Container fluid>
        <Grid justify={'space-between'}>
          <Grid.Col span={6}>
            <Group style={{ gap: '6px' }}>
              <Text weight={700}>ERC1155 Forging</Text>
              <Text>| "Numbers"</Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group spacing={'xs'} position={'right'}>
              {showConnectButton ? <ConnectButton /> : <UserBalances />}
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </Header>
  )
}
