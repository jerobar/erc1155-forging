# Week 4 Assignment

An ERC1155 token contract 'NumberToken' with a React front end that allows minting, trading, forging, and burning of tokens.

View project [online](https://jerobar.com/erc1155-forging/)!

## Notes

- The connect button in the header will dynamically prompt the user to either install MetaMask, connect with MetaMask, or switch to the Polygon network (which is added automatically), depending on the current MetaMask context.
- The UI will only allow the user to make transactions they have the requisite tokens to perform (e.g. by disabling buttons, showing different prompts).
- Verbose success and failure notifications for transactions are flashed in the lower-right.
- Token metadata and images are hardcoded in the application but also stored on ipfs.
