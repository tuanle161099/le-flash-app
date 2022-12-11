import { useState } from 'react'

import { Button, Card, Col, Row, Typography } from 'antd'
import CollectionSelection from 'components/collectionSelection'
import useWrap from 'hooks/action/useWrap'

const WrapNew = () => {
  const [collection, setCollection] = useState('')
  const { loading, onWrapCollection } = useWrap()
  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Wrap new</Typography.Title>
        </Col>
        <Col span={16}>
          <CollectionSelection
            collection={collection}
            onSelect={setCollection}
          />
        </Col>
        <Col span={8}>
          <Button
            loading={loading}
            onClick={() => onWrapCollection(collection)}
            disabled={!collection}
            size="large"
            block
            type="primary"
          >
            Wrap Collection
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default WrapNew
