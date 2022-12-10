import { Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

type CardHeroProps = {
  label: string
  value: string | number
  icon: string
}

const CardHero = ({ label, value, icon }: CardHeroProps) => {
  return (
    <Card style={{ borderRadius: 16 }} bodyStyle={{ padding: '20px 24px' }}>
      <Space style={{ width: '100%' }} direction="vertical">
        <Row align="middle">
          <Col flex="auto">
            <Typography.Text type="success">{label}</Typography.Text>
          </Col>
          <Col>
            <IonIcon name={icon} style={{ fontSize: 18 }} />
          </Col>
        </Row>
        <Typography.Title level={4}>{value}</Typography.Title>
      </Space>
    </Card>
  )
}

export default CardHero
