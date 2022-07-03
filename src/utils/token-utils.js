export const TOKENS = {
  0: {
    id: 0,
    name: 'Number One',
    description: 'Literally just the number one.',
    image: '/numbers-images/0.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/0.json',
    userSupply: 0
  },
  1: {
    id: 1,
    name: 'Number Two',
    description: 'Literally just the number two.',
    image: '/numbers-images/1.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/1.json',
    userSupply: 0
  },
  2: {
    id: 2,
    name: 'Number Three',
    description: 'Literally just the number three.',
    image: '/numbers-images/2.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/2.json',
    userSupply: 0
  },
  3: {
    id: 3,
    name: 'Number Four',
    description: 'Literally just the number four.',
    image: '/numbers-images/3.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/3.json',
    userSupply: 0
  },
  4: {
    id: 4,
    name: 'Number Five',
    description: 'Literally just the number five.',
    image: '/numbers-images/4.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/4.json',
    userSupply: 0
  },
  5: {
    id: 5,
    name: 'Number Six',
    description: 'Literally just the number six.',
    image: '/numbers-images/5.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/5.json',
    userSupply: 0
  },
  6: {
    id: 6,
    name: 'Number Seven',
    description: 'Literally just the number seven.',
    image: '/numbers-images/6.png',
    metadata: 'ipfs://QmatCE4zpiVEHnjQar8c4DUx8quXzDj2YtcycXUawuH6qz/6.json',
    userSupply: 0
  }
}

export const TOKEN_IDS = [0, 1, 2, 3, 4, 5, 6]

export const MINTABLE_TOKEN_IDS = [0, 1, 2]

export const FORGEABLE_TOKEN_IDS = [0, 1, 2]

export const FORGED_TOKEN_IDS = [3, 4, 5, 6]

function sumUserTokens(tokens) {
  let sumOfUserTokens = 0

  for (let i = 0; i < TOKEN_IDS.length; i++) {
    sumOfUserTokens += tokens[TOKEN_IDS[i]].userSupply
  }

  return sumOfUserTokens
}

function tokenIdToForge(tokens) {
  if (tokens.length === 3) {
    return 6
  }
  const zeroIdFlag = tokens[0] === 0 || tokens[1] === 0
  const tokenIdSum = tokens[0] + tokens[1]

  if (tokenIdSum === 1) {
    // ids 0 + 1
    return 3
  } else if (tokenIdSum === 2) {
    // ids 0 + 2
    return 5
  } else if (tokenIdSum === 3) {
    if (zeroIdFlag) {
      // ids 0 + 1 + 2
      return 6
    } else {
      // ids 1 + 2
      return 4
    }
  }
}

export const tokenUtils = {
  sumUserTokens,
  tokenIdToForge
}
