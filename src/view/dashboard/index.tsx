import { Col, Row, Typography } from 'antd'
import Hero from './hero'
import ReceiveList from './receiveList'

const Dashboard = () => {
  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <Typography.Title level={3}>Dashboard</Typography.Title>
      </Col>
      <Col span={24}>
        <Hero />
      </Col>
      <Col span={24}>
        <ReceiveList />
      </Col>
      <Col span={24} />
    </Row>
  )
}

export default Dashboard
