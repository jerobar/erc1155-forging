import { useState, useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {
  Grid,
  Center,
  Card,
  Image,
  Group,
  Text,
  Anchor,
  Button,
  Badge
} from '@mantine/core'

import { tokenUtils } from '../../utils/token-utils'
import { userAddedToken } from '../../stores/token-slice'
import { TradeModal } from './TradeModal'

export function MintTokens(props) {
  const { contractRef } = props
  const { currentAccount, chainIsPolygon } = useSelector(
    (state) => state.metaMask
  )
  const { mintableTokenIds, tokens } = useSelector((state) => state.token)
  const [tradeModalOpened, setTradeModalOpened] = useState(false)
  const [tokenToTradeFor, setTokenToTradeFor] = useState(null)
  const dispatch = useDispatch()

  // Get sum of tokens held by user
  const userTokenCount = useMemo(() => {
    return tokenUtils.sumUserTokens(tokens)
  }, [tokens])

  // Mint token id
  const handleMintButtonClick = useCallback(
    async (tokenId) => {
      if (contractRef.current && currentAccount) {
        try {
          const res = await contractRef.current.mint(currentAccount, tokenId, 1)
          res.wait(1)
          dispatch(userAddedToken({ tokenId }))
        } catch (error) {
          console.error(error)
        }
      }
    },
    [contractRef, currentAccount, dispatch]
  )

  // Open trade modal
  const handleTradeButtonClick = useCallback(
    (tokenId) => {
      setTokenToTradeFor(tokens[tokenId])
      setTradeModalOpened(true)
    },
    [tokens, setTradeModalOpened]
  )

  return (
    <>
      <Grid grow>
        {mintableTokenIds.map((tokenId) => {
          const token = tokens[tokenId]

          return (
            <Grid.Col key={tokenId} xs={12} sm={4}>
              <Center>
                <Card p={'lg'} shadow={'md'} style={{ minWidth: '100%' }}>
                  <Card.Section>
                    <Image src={token.image} alt={token.name} fit={'contain'} />
                  </Card.Section>
                  <Group
                    position={'apart'}
                    style={{ marginBottom: '6px', marginTop: '6px' }}
                  >
                    <Text size={'md'} weight={700}>
                      <Anchor
                        href={token.metadata}
                        target={'_blank'}
                        style={{ color: '#000', textDecoration: 'none' }}
                      >
                        {token.name}
                      </Anchor>
                    </Text>
                    <Badge variant={'outline'}>Owned: {token.userSupply}</Badge>
                  </Group>
                  <Button
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'lime' }}
                    disabled={!chainIsPolygon}
                    fullWidth
                    onClick={() => handleMintButtonClick(tokenId)}
                    style={{ marginBottom: '6px' }}
                  >
                    Mint this
                  </Button>
                  <Button
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    disabled={!chainIsPolygon ? true : userTokenCount === 0}
                    fullWidth
                    onClick={() => handleTradeButtonClick(tokenId)}
                    style={{ marginBottom: '8px' }}
                  >
                    Trade for this
                  </Button>
                </Card>
              </Center>
            </Grid.Col>
          )
        })}
      </Grid>
      {tokenToTradeFor && (
        <TradeModal
          opened={tradeModalOpened}
          setTradeModalOpened={setTradeModalOpened}
          tokenToTradeFor={tokenToTradeFor}
          contractRef={contractRef}
        />
      )}
    </>
  )
}
