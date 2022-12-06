import IonIcon from '@sentre/antd-ionicon'
import { Button, Card, Col, Input, Row, Typography } from 'antd'
import NftSelection from 'components/nftSelection/nftSelection'
import {
  useFindByCollection,
  useMyCollection,
  useMyNfts,
} from 'hooks/metaFlex/useNft'

const CardRecipient = () => {
  const nfts = useMyNfts()
  const collections = useMyCollection()
  const nftByMints = useFindByCollection(
    '7STVRCxW6CkyPQnCiQWYfBURYVwMc1q75N7bXnCVU1Em',
  )

  console.log(nfts, 'nfts')
  console.log(collections)
  console.log(nftByMints)

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row align="middle">
            <Col flex="auto">
              <Typography.Title level={4}>Wallet Address</Typography.Title>
            </Col>
            <Button>Auto fill</Button>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={14}>
              <Input placeholder="Input recipient's address" />
            </Col>
            <Col span={8}>
              <NftSelection />
            </Col>
            <Col span={2}>
              <Button
                type="ghost"
                ghost
                icon={<IonIcon name="add-circle-outline" />}
                block
              />
            </Col>
          </Row>
        </Col>
        <Col span={24} />
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary">CONFIRM</Button>
        </Col>
      </Row>
    </Card>
  )
}

export default CardRecipient
