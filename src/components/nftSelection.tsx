import { Fragment, useState } from 'react'

import { SearchNFT as ModalContentListNFTs } from '@sen-use/components'
import IonIcon from '@sentre/antd-ionicon'
import { Modal, Row, Col, Typography, Card, Button } from 'antd'

export type NftSelectionProps = {
  // acceptedCollections: string[]
  onSelect: (mintAddress: string) => void
  selectedNFTs: string[]
}

const NftSelection = ({
  // acceptedCollections,
  onSelect,
  selectedNFTs,
}: NftSelectionProps) => {
  const [visible, setVisible] = useState(false)

  const onSelectNFT = (nftAddress: string) => {
    setVisible(false)
    onSelect(nftAddress)
  }

  return (
    <Fragment>
      <Card
        className="upload-box card-nft-image-only"
        bodyStyle={{ padding: 0 }}
        onClick={() => setVisible(true)}
      >
        <Button
          type="text"
          className="icon-add-nft"
          icon={<IonIcon name="add-outline" style={{ color: '#a0e86f' }} />}
        />
      </Card>
      <Modal
        visible={visible}
        closeIcon={<IonIcon name="close-outline" />}
        onCancel={() => setVisible(false)}
        footer={null}
        className="modal-nft-selection"
        style={{ paddingBottom: 0 }}
      >
        <Row gutter={[24, 24]} style={{ maxHeight: 400 }}>
          <Col span={24}>
            <Typography.Title level={4}>Select a NFT</Typography.Title>
          </Col>
          <Col span={24}>
            <ModalContentListNFTs
              onSelect={onSelectNFT}
              // collectionAddress={acceptedCollections}
              selectedNFTs={selectedNFTs}
            />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NftSelection
