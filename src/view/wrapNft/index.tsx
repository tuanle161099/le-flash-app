import { Col, Row, Typography } from 'antd'
import WithdrawNFT from './withdraw'
import WrapNew from './wrapNew'
import WrappedNFT from './wrappedNft'

const WrapNFT = () => {
  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <Typography.Title level={3}>Wrap NFT</Typography.Title>
      </Col>
      <Col xs={24} md={12}>
        <WrappedNFT />
      </Col>
      <Col xs={24} md={12}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <WrapNew />
          </Col>
          <Col span={24}>
            <WithdrawNFT />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default WrapNFT
