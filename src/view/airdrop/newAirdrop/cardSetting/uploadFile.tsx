import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Papa from 'papaparse'

import {
  Space,
  Spin,
  Typography,
  Upload,
  Image,
  Card,
  Row,
  Col,
  Button,
} from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch } from 'model'
import {
  addRecipient,
  RecipientInfo,
  setRecipient,
} from 'model/recipients.controller'
import iconUpload from 'static/images/icon-upload.svg'

const UploadFile = () => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File>()
  const dispatch = useDispatch<AppDispatch>()

  const parse = (file: any): Promise<Array<string[]>> => {
    return new Promise((resolve, reject) => {
      return Papa.parse(file, {
        skipEmptyLines: true,
        complete: ({ data }, fileInfo) => {
          setFile(fileInfo)
          return resolve(data as Array<string[]>)
        },
      })
    })
  }

  const onUpload = async (file: any) => {
    try {
      setLoading(true)
      const listUser = await parse(file)
      const newRecipients: RecipientInfo[] = []
      let index = 0
      for (const [walletAddress] of listUser) {
        newRecipients.push({ mintAddress: '', walletAddress, index })
        index++
      }

      await dispatch(addRecipient({ newRecipients }))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const onRemove = async () => {
    setFile(undefined)
    await dispatch(setRecipient([]))
  }
  return (
    <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Upload.Dragger
            accept=".csv,.txt"
            maxCount={1}
            className="upload-file"
            showUploadList={false}
            progress={{ strokeWidth: 2, showInfo: true }}
            beforeUpload={onUpload}
            onRemove={onRemove}
          >
            <Space direction="vertical" size={24} align="center">
              <Image src={iconUpload} preview={false} />
              <Space direction="vertical" size={4} align="center">
                <Typography.Text>Click or Drop file to upload</Typography.Text>
                <Typography.Text type="secondary">
                  The accepted file types are <code>.csv</code>,{' '}
                  <code>.txt</code>.
                </Typography.Text>
              </Space>
            </Space>
          </Upload.Dragger>
        </Col>
        {file && (
          <Col span={24}>
            <Card bodyStyle={{ padding: '8px 24px' }}>
              <Row align="middle">
                <Col flex="auto">
                  <Typography.Title type="success" level={5}>
                    {file.name}
                  </Typography.Title>
                </Col>
                <Col>
                  <Button
                    onClick={onRemove}
                    type="text"
                    icon={<IonIcon name="trash-outline" />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default UploadFile
