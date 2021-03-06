import { forwardRef, useState, useCallback } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import {
  Group,
  Avatar,
  Text,
  Modal,
  Select,
  Space,
  Button
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { userAddedToken, userRemovedTokens } from '../../stores/token-slice'

const TokenSelectItem = forwardRef(
  ({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text size="sm">Token {label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
)

export function TradeModal(props) {
  const { opened, setTradeModalOpened, tokenToTradeFor, contractRef } = props
  const { tokenIds, tokens } = useSelector((state) => state.token)
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  const handleTradeButtonClick = useCallback(
    async (tokenId, idToTradeFor) => {
      if (contractRef.current) {
        try {
          const res = await contractRef.current.trade(tokenId, idToTradeFor)
          res.wait(1)
          dispatch(userRemovedTokens({ tokenIds: [Number(tokenId)] }))
          dispatch(userAddedToken({ tokenId: Number(idToTradeFor) }))
          setTradeModalOpened(false)
          showNotification({
            title: 'Success!',
            message: `Successfully traded token "${
              tokens[Number(tokenId)].name
            }" for token "${tokens[Number(idToTradeFor)].name}"!`,
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
    [contractRef, dispatch, setTradeModalOpened, tokens]
  )

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setValue('')
        setTradeModalOpened(false)
      }}
      title={`Trade for token "${tokenToTradeFor.name}"!`}
    >
      <Select
        label={'Choose one of your tokens to trade'}
        placeholder={'Choose token'}
        itemComponent={TokenSelectItem}
        data={tokenIds
          .filter((tokenId) => tokens[tokenId].userSupply > 0)
          .map((tokenId) => {
            const token = tokens[tokenId]
            return {
              image: token.image,
              label: token.name,
              value: String(token.id),
              description: token.description
            }
          })}
        maxDropdownHeight={400}
        onChange={(value) => setValue(value)}
        value={value}
      />
      <Space h={20} />
      <Button
        variant="gradient"
        gradient={{ from: 'teal', to: 'lime' }}
        disabled={value === ''}
        fullWidth
        onClick={() => handleTradeButtonClick(value, tokenToTradeFor.id)}
        style={{ marginBottom: '6px' }}
      >
        Trade for {tokenToTradeFor.name}
      </Button>
    </Modal>
  )
}
