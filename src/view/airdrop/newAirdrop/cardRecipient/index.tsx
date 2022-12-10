import { Button, Card, Col, Divider, Row, Typography } from 'antd'
import { useInitAirdrop } from 'hooks/action/useInitAirdrop'
import { useFindByCollection } from 'hooks/metaFlex/useNft'
import { AppDispatch, AppState } from 'model'
import { setRecipient } from 'model/recipients.controller'
import { useDispatch, useSelector } from 'react-redux'
import InputRecipient from './inputRecipient'

const CardRecipient = () => {
  const recipients = useSelector((state: AppState) => state.recipients)
  const { collection } = useSelector((state: AppState) => state.main)
  const nfts: any[] = useFindByCollection(collection)
  const { onAirdrop, loading } = useInitAirdrop()
  const dispatch = useDispatch<AppDispatch>()
  const ok = collection && nfts.length >= recipients.length

  const fillAndUpdate = () => {
    if (!ok) return
    const nextRecipients = [...recipients]
    for (let i = 0; i < nextRecipients.length; i++) {
      const info = nextRecipients[i]
      if (info.mintAddress) continue
      nextRecipients[i] = {
        ...info,
        mintAddress: nfts[i].mintAddress.toBase58(),
      }
    }
    dispatch(setRecipient(nextRecipients))
  }

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Typography.Title level={4}>Wallet Address</Typography.Title>
            </Col>
            <Button disabled={!ok} onClick={fillAndUpdate}>
              Auto fill
            </Button>
          </Row>
        </Col>
        <Col span={24}>
          <InputRecipient />
        </Col>
        {!!recipients.length && (
          <Col span={24}>
            <Divider style={{ margin: 0 }} />
          </Col>
        )}
        {recipients.map(({ mintAddress, walletAddress }, index) => (
          <Col key={mintAddress + index} span={24}>
            <InputRecipient
              mintAddress={mintAddress}
              walletAddress={walletAddress}
              index={index}
            />
          </Col>
        ))}
        <Col span={24} />
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            onClick={() => onAirdrop(recipients, collection)}
            type="primary"
            loading={loading}
            disabled={!recipients.length}
          >
            CONFIRM
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default CardRecipient
