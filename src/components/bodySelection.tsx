import { Col, Row } from 'antd'
import CardNFT from './cardNFT'

type BodySelectionProps = {
  mintAddresses: string[]
  onSelect?: (mintAddress: string) => void
}

const BodySelection = ({
  mintAddresses,
  onSelect = () => {},
}: BodySelectionProps) => {
  return (
    <Row
      gutter={[8, 8]}
      className="scrollbar"
      style={{ maxHeight: 400, overflowY: 'hidden' }}
    >
      {mintAddresses.map((mintAddress) => (
        <Col onClick={() => onSelect(mintAddress)} span={8} key={mintAddress}>
          <CardNFT mintAddress={mintAddress} showName />
        </Col>
      ))}
    </Row>
  )
}

export default BodySelection
