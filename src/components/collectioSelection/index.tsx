import { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'

import IonIcon from '@sentre/antd-ionicon'
import { Modal, Row, Col, Typography, Button } from 'antd'
import BodySelection from 'components/bodySelection'

import { useMyCollection } from 'hooks/metaFlex/useNft'
import { setCollection } from 'model/main.controller'
import { AppDispatch } from 'model'

const CollectionSelection = () => {
  const [visible, setVisible] = useState(false)
  const collections = useMyCollection()
  const dispatch = useDispatch<AppDispatch>()

  const onSelectCollection = (collection: string) => {
    dispatch(setCollection(collection))
    setVisible(false)
  }

  return (
    <Fragment>
      <Button
        icon={<IonIcon name="chevron-down-outline" />}
        type="ghost"
        ghost
        block
        onClick={() => setVisible(true)}
      >
        Select collections NFT
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
