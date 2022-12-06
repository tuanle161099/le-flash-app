import {
  Card,
  Col,
  DatePicker,
  Image,
  Row,
  Space,
  Spin,
  Typography,
  Upload,
} from 'antd'
import CollectionSelection from 'components/collectioSelection'

import iconUpload from 'static/images/icon-upload.svg'

const CardSetting = () => {
  return (
    <Card bordered>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Space direction="vertical">
                <Typography.Title level={5}>
                  Select your collection airdrop
                </Typography.Title>
                <CollectionSelection />
              </Space>
            </Col>
            <Col flex="auto">
              <Space direction="vertical">
                <Typography.Title level={5}>Balance</Typography.Title>
                --
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={24}>
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Title level={5}>Start time</Typography.Title>
                <DatePicker />
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Typography.Title level={5}>End time</Typography.Title>
                <DatePicker />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Spin spinning={false}>
            <Upload.Dragger
              accept=".csv,.txt"
              maxCount={1}
              className="upload-file"
              showUploadList
              progress={{ strokeWidth: 2, showInfo: true }}
              fileList={[]}
            >
              <Space direction="vertical" size={24} align="center">
                <Image src={iconUpload} preview={false} />
                <Space direction="vertical" size={4} align="center">
                  <Typography.Text>
                    Click or Drop file to upload
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    The accepted file types are <code>.csv</code>,{' '}
                    <code>.txt</code>.
                  </Typography.Text>
                </Space>
              </Space>
            </Upload.Dragger>
          </Spin>
        </Col>
      </Row>
    </Card>
  )
}

export default CardSetting
