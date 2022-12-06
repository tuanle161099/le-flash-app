import { Col, Row, Typography } from 'antd'
import NewAirdrop from './newAirdrop'

import './index.less'

const Airdrop = () => {
  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <Typography.Title level={3}>Airdrops</Typography.Title>
      </Col>
      <Col span={24}>
        <NewAirdrop />
      </Col>
    </Row>
  )
}

export default Airdrop
