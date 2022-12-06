import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Modal, Row, Col, Typography, Button } from 'antd'
import BodySelection from 'components/bodySelection'

import { useFindByCollection } from 'hooks/metaFlex/useNft'
import { AppState } from 'model'

const NftSelection = () => {
  const [visible, setVisible] = useState(false)
  const collection = useSelector(({ main }: AppState) => main.collection)
  const nftsData = useFindByCollection(collection)
  const mintAddress = nftsData.map((nft: any) => nft.mintAddress.toBase58())

  return (
    <Fragment>
      <Button
        icon={<IonIcon name="chevron-down-outline" />}
        type="ghost"
        ghost
        block
        onClick={() => setVisible(true)}
      >
        Select Nft
      </Button>
      <Modal
        visible={visible}
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
            <BodySelection mintAddresses={mintAddress} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NftSelection
