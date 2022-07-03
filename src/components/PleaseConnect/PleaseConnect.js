import { Alert } from '@mantine/core'

export function PleaseConnect() {
  return (
    <Alert
      title={'Not Connected!'}
      color={'red'}
      style={{ border: '1px solid rgb(250, 82, 82)', margin: '20px 0 20px 0' }}
    >
      Please connect with MetaMask to the Polygon Network using the button in
      the header.
    </Alert>
  )
}
