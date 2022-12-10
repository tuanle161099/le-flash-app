import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Col, Input, Row, Typography } from 'antd'
import NftSelection from 'components/nftSelection/nftSelection'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch } from 'model'
import { addRecipient, removeRecipient } from 'model/recipients.controller'

type InputRecipientProps = {
  mintAddress?: string
  walletAddress?: string
  index?: number
}

const InputRecipient = ({
  mintAddress,
  walletAddress,
  index = 0,
}: InputRecipientProps) => {
  const [info, setInfo] = useState({ mintAddress, walletAddress })
  const dispatch = useDispatch<AppDispatch>()

  const onChange = (name: keyof typeof info, value: string) => {
    return setInfo({ ...info, [name]: value })
  }

  const onCreate = () => {
    if (!info.mintAddress || !info.walletAddress || !info) return
    const cloneInfo = {
      mintAddress: info.mintAddress,
      walletAddress: info.walletAddress,
    }
    setInfo({ mintAddress: '', walletAddress: '' })
    return dispatch(addRecipient({ newRecipients: [cloneInfo] }))
  }

  return (
    <Row gutter={16}>
      <Col span={14}>
        <Input
          value={info.walletAddress}
          placeholder="Input recipient's address"
          onChange={(e) => onChange('walletAddress', e.target.value)}
          disabled={!!mintAddress}
        />
      </Col>
      <Col span={8}>
        <NftSelection
          onMintSelect={(val) => onChange('mintAddress', val)}
          mintAddress={info.mintAddress}
          disabled={!!mintAddress}
        />
      </Col>
      <Col span={2}>
        {walletAddress ? (
          <Button
            type="ghost"
            ghost
            icon={
              <Typography.Text type="danger">
                <IonIcon name="remove-circle-outline" />
              </Typography.Text>
            }
            block
            onClick={() => dispatch(removeRecipient({ index }))}
          />
        ) : (
          <Button
            type="ghost"
            ghost
            icon={<IonIcon name="add-circle-outline" />}
            block
            onClick={onCreate}
          />
        )}
      </Col>
    </Row>
  )
}

export default InputRecipient
