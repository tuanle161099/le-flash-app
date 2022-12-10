import { Col, Row } from 'antd'
import { useMyNfts } from 'hooks/metaFlex/useNft'
import { AppState } from 'model'
import { useSelector } from 'react-redux'
import CardHero from './cardHero'

const Hero = () => {
  const receipts = useSelector(({ receipts }: AppState) => receipts)
  const myNfts = useMyNfts()
  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} sm={12} md={8}>
        <CardHero
          label="Total balance NFT"
          value={myNfts.length}
          icon="cash-outline"
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <CardHero
          label="Total NFT received"
          value={Object.keys(receipts).length}
          icon="image-outline"
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <CardHero
          label="Total wallet airdrops"
          value={1}
          icon="wallet-outline"
        />
      </Col>
    </Row>
  )
}

export default Hero
