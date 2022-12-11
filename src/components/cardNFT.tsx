import { Row, Col, Typography, Image, Spin } from 'antd'
import Address from './address'

import IMAGE_DEFAULT from 'static/images/nft-default.png'
import { useNftData } from 'hooks/metaFlex/useNft'
import IonIcon from '@sentre/antd-ionicon'

export type CardNFTProps = {
  mintAddress: string
  onSelect?: (mintAddress: string) => void
  showName?: boolean
  listSelected?: string[]
  size?: number
}

const CardNFT = ({
  mintAddress,
  onSelect,
  showName = false,
  size,
  listSelected = [],
}: CardNFTProps) => {
  const { nftData, loading } = useNftData(mintAddress)
  const check = listSelected.includes(mintAddress)
  return (
    <Spin spinning={loading}>
      <Row gutter={[12, 12]} style={{ cursor: 'pointer' }}>
        <Col
          span={24}
          style={{ textAlign: 'center', width: size }}
          onClick={() => (onSelect ? onSelect(mintAddress) : null)}
        >
          <Image
            src={nftData?.json?.image || IMAGE_DEFAULT}
            preview={false}
            style={{ borderRadius: 4, aspectRatio: '1', objectFit: 'cover' }}
          />
          {check && (
            <IonIcon
              style={{
                position: 'absolute',
                left: 6,
                fontSize: 20,
                color: '#ED8000',
              }}
              name="checkbox-sharp"
            />
          )}
        </Col>
        {showName && (
          <Col span={24} style={{ textAlign: 'left' }}>
            <Row>
              <Col span={24}>
                <Typography.Title ellipsis={{ tooltip: true }} level={5}>
                  {nftData?.name || nftData?.json?.name}
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Address address={mintAddress} />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default CardNFT
