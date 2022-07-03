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
        const res = await contractRef.current.trade(tokenId, idToTradeFor)
        res.wait(1)
        dispatch(userRemovedTokens({ tokenIds: [Number(tokenId)] }))
        dispatch(userAddedToken({ tokenId: Number(idToTradeFor) }))
        setTradeModalOpened(false)
      }
    },
    [contractRef, dispatch, setTradeModalOpened]
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
        label={'Choose any token to trade'}
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
