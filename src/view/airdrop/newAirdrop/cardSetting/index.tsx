import { useSelector } from 'react-redux'

import { Card, Col, DatePicker, Row, Space, Typography } from 'antd'
import CollectionSelection from 'components/collectionSelection'
import UploadFile from './uploadFile'

import { useFindByCollection } from 'hooks/metaFlex/useNft'
import { AppState } from 'model'

const CardSetting = () => {
  const { collection } = useSelector((state: AppState) => state.main)
  const nfts = useFindByCollection(collection)
  return (
    <Card bordered>
      <Row gutter={[24, 24]} align="middle">
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Space direction="vertical">
                <Typography.Title level={5}>
                  Select your collection airdrop
                </Typography.Title>
                <CollectionSelection />
              </Space>
            </Col>
            <Col>
              <Space direction="vertical">
                <Typography.Title level={5}>Balance</Typography.Title>
                {nfts.length}
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={24}>
            <Col span={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Title level={5}>Start time</Typography.Title>
                <DatePicker style={{ width: '100%' }} />
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Title level={5}>End time</Typography.Title>
                <DatePicker style={{ width: '100%' }} />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <UploadFile />
        </Col>
      </Row>
    </Card>
  )
}

export default CardSetting
