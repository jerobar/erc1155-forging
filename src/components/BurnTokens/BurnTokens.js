import { useState, useMemo, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {
  createStyles,
  UnstyledButton,
  Image,
  Text,
  Group,
  Badge,
  Paper,
  Title,
  SimpleGrid,
  Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { userRemovedTokens } from '../../stores/token-slice'

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
    },

    '&.selected': {
      border: `2px solid ${theme.colors.gray[5]}`,
      backgroundColor: theme.colors.gray[2]
    }
  }
}))

function SelectableToken(props) {
  const { token, tokenToBurn, setTokenToBurn } = props
  const { classes, cx } = useStyles()

  return (
    <UnstyledButton
      className={cx([classes.button, { selected: token.id === tokenToBurn }])}
      onClick={() =>
        tokenToBurn === token.id
          ? setTokenToBurn(null)
          : setTokenToBurn(token.id)
      }
    >
      <Image src={token.image} alt={token.name} fit={'contain'} />
      <Text size={'sm'} weight={700} style={{ margin: '4px 0 4px 0' }}>
        {token.name}
      </Text>
      <Group>
        <Badge size={'sm'} variant={'outline'}>
          Owned: {token.userSupply}
        </Badge>
      </Group>
    </UnstyledButton>
  )
}

export function BurnTokens(props) {
  const { contractRef } = props
  const { currentAccount } = useSelector((state) => state.metaMask)
  const { forgedTokenIds, tokens } = useSelector((state) => state.token)
  const [tokenToBurn, setTokenToBurn] = useState(null)
  const dispatch = useDispatch()

  // Determine whether user has forged tokens
  const userHasForgedTokens = useMemo(() => {
    let forgedTokenCount = 0

    for (let i = 0; i < forgedTokenIds.length; i++) {
      forgedTokenCount += tokens[forgedTokenIds[i]].userSupply
    }

    return forgedTokenCount > 0
  }, [forgedTokenIds, tokens])

  const handleBurnButtonClick = useCallback(
    async (tokenIdToBurn) => {
      if (contractRef.current && currentAccount) {
        try {
          const res = await contractRef.current.burn(
            currentAccount,
            tokenIdToBurn,
            1
          )
          res.wait(1)
          dispatch(userRemovedTokens({ tokenIds: [tokenIdToBurn] }))
          setTokenToBurn(null)
          showNotification({
            title: 'Success!',
            message: `Successfully burned token "${tokens[tokenIdToBurn].name}"!`,
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
    },
    [contractRef, currentAccount, dispatch, setTokenToBurn, tokens]
  )

  return (
    <Paper p={'md'} shadow={'md'}>
      <Title order={2} style={{ marginBottom: '14px', textAlign: 'center' }}>
        Burn Forged Tokens
      </Title>
      {userHasForgedTokens ? (
        <SimpleGrid cols={3}>
          {forgedTokenIds
            .filter((tokenId) => tokens[tokenId].userSupply > 0)
            .map((tokenId) => {
              const token = tokens[tokenId]

              return (
                <SelectableToken
                  key={tokenId}
                  token={token}
                  tokenToBurn={tokenToBurn}
                  setTokenToBurn={setTokenToBurn}
                />
              )
            })}
        </SimpleGrid>
      ) : (
        <div>You have no forged tokens!</div>
      )}
      <Button
        disabled={!tokenToBurn}
        fullWidth
        gradient={{ from: 'indigo', to: 'cyan' }}
        onClick={() => handleBurnButtonClick(tokenToBurn)}
        style={{ marginBottom: '6px', marginTop: '20px' }}
        variant={'gradient'}
      >
        Burn Token!
      </Button>
    </Paper>
  )
}
