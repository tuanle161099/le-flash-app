import { Col, Row, Space, Typography } from 'antd'

const DevnetOnly = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} style={{ height: 32 }} />
      <Col span={24} style={{ textAlign: 'center' }}>
        <Space direction="vertical">
          <Typography.Title level={2}>
            ⚠️ Le Flash is now only on the beta version.
          </Typography.Title>
          <Typography.Text>
            You can open the Control Center, switch to devnet and experience the
            application.
          </Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default DevnetOnly
