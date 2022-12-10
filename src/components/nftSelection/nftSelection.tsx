import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Modal, Row, Col, Typography, Button, Space, Avatar } from 'antd'
import BodySelection from 'components/bodySelection'

import { useFindByCollection, useNftData } from 'hooks/metaFlex/useNft'
import { AppState } from 'model'

type NftSelectionProps = {
  onMintSelect?: (mintAddress: string) => void
  mintAddress?: string
  disabled?: boolean
}

const NftSelection = ({
  onMintSelect = () => {},
  mintAddress = '',
  disabled = false,
}: NftSelectionProps) => {
  const [visible, setVisible] = useState(false)
  const [nftSelected, setNftSelected] = useState(mintAddress)
  const collection = useSelector(({ main }: AppState) => main.collection)
  const recipients = useSelector(({ recipients }: AppState) => recipients)
  const nftsData = useFindByCollection(collection)
  const nftsSelected = recipients.map(({ mintAddress }) => mintAddress)

  const mintAddresses = nftsData
    .map((nft: any) => nft.mintAddress.toBase58())
    .filter(
      (mintAddress) => ![nftSelected, ...nftsSelected].includes(mintAddress),
    )
  const { nftData } = useNftData(nftSelected)

  const onSelect = (mintAddress: string) => {
    setNftSelected(mintAddress)
    onMintSelect(mintAddress)
    setVisible(false)
  }

  return (
    <Fragment>
      <Button
        type="ghost"
        style={{ textAlign: mintAddress ? 'left' : 'center' }}
        ghost
        block
        onClick={() => setVisible(true)}
        disabled={!collection || disabled}
      >
        {mintAddress ? (
          <Space>
            <Avatar size={24} src={nftData?.json?.image} />
            <Typography.Text className="caption">
              {nftData?.name || nftData?.json?.name}
            </Typography.Text>
          </Space>
        ) : (
          <Space>
            <IonIcon name="chevron-down-outline" />
            Select NFT
          </Space>
        )}
      </Button>
      <Modal
        open={visible}
        closeIcon={<IonIcon name="close-outline" />}
        onCancel={() => setVisible(false)}
        footer={null}
        style={{ paddingBottom: 0 }}
      >
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Typography.Title level={4}>Select a NFT</Typography.Title>
          </Col>
          <Col span={24}>
            <BodySelection onSelect={onSelect} mintAddresses={mintAddresses} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NftSelection
