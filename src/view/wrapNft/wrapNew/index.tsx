import { Button, Card, Col, Row, Typography } from 'antd'
import CollectionSelection from 'components/collectionSelection'

const WrapNew = () => {
  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Wrap new</Typography.Title>
        </Col>
        <Col span={16}>
          <CollectionSelection />
        </Col>
        <Col span={8}>
          <Button size="large" block type="primary">
            Wrap
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default WrapNew
