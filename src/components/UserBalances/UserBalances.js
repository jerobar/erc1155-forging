import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { Text } from '@mantine/core'

import { tokenUtils } from '../../utils/token-utils'

export function UserBalances(props) {
  // const { providerRef, contractRef } = props
  const { maticBalance } = useSelector((state) => state.metaMask)
  const { tokens, tokenIds } = useSelector((state) => state.token)
  const [tokenBalance, setTokenBalance] = useState(null)

  // Sum user token supplies
  // (rewrite this with e.g. reduce later)
  useEffect(() => {
    setTokenBalance(tokenUtils.sumUserTokens(tokens))
  }, [tokens, tokenIds])

  return (
    <Text color={'dimmed'}>
      You have: {maticBalance ? maticBalance : '0'} $MATIC |{' '}
      {tokenBalance ? tokenBalance : '0'} $NUMBERS
    </Text>
  )
}
