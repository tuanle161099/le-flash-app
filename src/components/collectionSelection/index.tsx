import { Fragment, useState } from 'react'

import IonIcon from '@sentre/antd-ionicon'
import { Modal, Row, Col, Typography, Button, Space, Avatar } from 'antd'
import BodySelection from 'components/bodySelection'

import { useMyCollection, useNftData } from 'hooks/metaFlex/useNft'

type CollectionSelectionProps = {
  onSelect: (collection: string) => void
  collection: string
}

const CollectionSelection = ({
  collection,
  onSelect,
}: CollectionSelectionProps) => {
  const [visible, setVisible] = useState(false)
  const collections = useMyCollection()
  const { nftData } = useNftData(collection)

  const onSelectCollection = (collection: string) => {
    onSelect(collection)
    setVisible(false)
  }

  return (
    <Fragment>
      <Button
        type="ghost"
        style={{ textAlign: nftData ? 'left' : 'center' }}
        size="large"
        ghost
        onClick={() => setVisible(true)}
        block
      >
        {nftData ? (
          <Space>
            <Avatar size={24} src={nftData.json?.image} />
            <Typography.Text className="caption">
              {nftData.name || nftData.json?.name}
            </Typography.Text>
          </Space>
        ) : (
          <Space>
            <IonIcon name="chevron-down-outline" />
            Select collections NFT
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
            <Typography.Title level={4}>
              Select a collection NFT
            </Typography.Title>
          </Col>
          <Col span={24}>
            <BodySelection
              onSelect={onSelectCollection}
              mintAddresses={collections}
            />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default CollectionSelection
