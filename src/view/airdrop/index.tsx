import { Col, Row, Typography } from 'antd'
import NewAirdrop from './newAirdrop'
import History from './history'

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
      <Col span={24}>
        <History />
      </Col>
      <Col span={24} />
    </Row>
  )
}

export default Airdrop
