import { Col, Row } from 'antd'
import CardRecipient from './cardRecipient'
import CardSetting from './cardSetting'

const NewAirdrop = () => {
  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} md={8}>
        <CardSetting />
      </Col>
      <Col xs={24} md={16}>
        <CardRecipient />
      </Col>
    </Row>
  )
}

export default NewAirdrop
