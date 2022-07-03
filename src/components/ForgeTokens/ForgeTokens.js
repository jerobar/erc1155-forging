import { useState, useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import {
  createStyles,
  UnstyledButton,
  Image,
  Text,
  Group,
  Checkbox,
  Badge,
  Paper,
  Title,
  SimpleGrid,
  Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { tokenUtils } from '../../utils/token-utils'
import { userAddedToken, userRemovedTokens } from '../../stores/token-slice'

const useStyles = createStyles((theme) => ({
  button: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.sm,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.white,

    '&:hover': {
      backgroundColor: theme.colors.gray[0]
    }
  }
}))

function SelectableToken(props) {
  const { token, tokensToForge, setTokensToForge } = props
  const { classes } = useStyles()

  const handleTokenSelect = useCallback(
    (tokenId) => {
      if (tokensToForge.includes(tokenId)) {
        setTokensToForge((tokensToForge) =>
          tokensToForge.filter((tokenId) => tokenId !== token.id)
        )
      } else {
        setTokensToForge((tokensToForge) => [...tokensToForge, token.id])
      }
    },
    [setTokensToForge, token.id, tokensToForge]
  )

  return (
    <UnstyledButton
      className={classes.button}
      onClick={() => handleTokenSelect(token.id)}
    >
      <Image src={token.image} alt={token.name} fit={'contain'} />
      <Text size={'sm'} weight={700} style={{ margin: '4px 0 4px 0' }}>
        {token.name}
      </Text>
      <Group>
        <Checkbox
          disabled={token.userSupply === 0}
          checked={tokensToForge.includes(token.id)}
          onChange={() => {}} // Component controlled by parent UnstyledButton
        />
        <Badge size={'sm'} variant={'outline'}>
          Owned: {token.userSupply}
        </Badge>
      </Group>
    </UnstyledButton>
  )
}

export function ForgeTokens(props) {
  const { contractRef } = props
  const { currentAccount } = useSelector((state) => state.metaMask)
  const { forgeableTokenIds, tokens } = useSelector((state) => state.token)
  const [tokensToForge, setTokensToForge] = useState([])
  const dispatch = useDispatch()

  // Determine whether user has tokens to forge
  const userHasForgeableTokens = useMemo(() => {
    let forgeableTokenCount = 0

    for (let i = 0; i < forgeableTokenIds.length; i++) {
      forgeableTokenCount += tokens[forgeableTokenIds[i]].userSupply
    }

    return forgeableTokenCount > 0
  }, [forgeableTokenIds, tokens])

  const handleForgeButtonClick = useCallback(async () => {
    if (contractRef.current && currentAccount) {
      try {
        const res = await contractRef.current.burnBatch(
          currentAccount,
          tokensToForge,
          tokensToForge.map((tokenId) => 1)
        )

        res.wait(1)

        const tokenIdForged = tokenUtils.tokenIdToForge(tokensToForge)

        dispatch(userAddedToken({ tokenId: tokenIdForged }))
        dispatch(userRemovedTokens({ tokenIds: tokensToForge }))
        setTokensToForge([])
        showNotification({
          title: 'Success!',
          message: `Successfully forged token "${tokens[tokenIdForged].name}"!`,
          color: 'green',
          autoClose: 7000
        })
      } catch (error) {
        console.error(error)

        showNotification({
          title: 'Whoops!',
          message:
            'Something went wrong. Perhaps a previous transaction has not yet finalized?',
          color: 'red',
          autoClose: 7000
        })
      }
    }
  }, [
    contractRef,
    currentAccount,
    tokensToForge,
    dispatch,
    setTokensToForge,
    tokens
  ])

  return (
    <>
      {forgeableTokenIds && tokens && (
        <Paper p={'md'} shadow={'md'}>
          <Title
            order={2}
            style={{ marginBottom: '14px', textAlign: 'center' }}
          >
            Forge Tokens
          </Title>
          {userHasForgeableTokens ? (
            <SimpleGrid cols={3}>
              {forgeableTokenIds
                .filter((tokenId) => tokens[tokenId].userSupply > 0)
                .map((tokenId) => {
                  const token = tokens[tokenId]

                  return (
                    <SelectableToken
                      key={tokenId}
                      token={token}
                      tokensToForge={tokensToForge}
                      setTokensToForge={setTokensToForge}
                    />
                  )
                })}
            </SimpleGrid>
          ) : (
            <div style={{ textAlign: 'center' }}>
              You have no tokens to forge!
            </div>
          )}
          <Button
            disabled={tokensToForge.length < 2}
            fullWidth
            gradient={{ from: 'cyan', to: 'indigo' }}
            onClick={handleForgeButtonClick}
            style={{ marginBottom: '6px', marginTop: '20px' }}
            variant={'gradient'}
          >
            Forge Tokens!
          </Button>
        </Paper>
      )}
    </>
  )
}
