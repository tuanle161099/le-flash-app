import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { Button, Card, Col, Row, Table, Typography } from 'antd'

import { AppState } from 'model'
import { HISTORY_COLUMNS } from './column'
import FilterTrans from 'components/filterTrans'

const History = () => {
  const [pageSize, setPageSize] = useState(4)
  const distributors = useSelector(({ distributors }: AppState) => distributors)
  const walletAddress = useWalletAddress()

  const filteredDistributors = Object.keys(distributors)
    .filter(
      (address) => distributors[address].authority.toBase58() === walletAddress,
    )
    .map((distributorAddress) => ({ distributorAddress }))

  return (
    <Card>
      <Row gutter={[24, 24]} align="middle">
        <Col flex="auto">
          <Typography.Title level={5}>History</Typography.Title>
        </Col>
        <Col>
          <FilterTrans />
        </Col>
        <Col span={24}>
          <Table
            rowKey={(record) => record.distributorAddress}
            columns={HISTORY_COLUMNS}
            dataSource={filteredDistributors.slice(0, pageSize)}
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 ? 'odd-row' : 'even-row'
            }
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            disabled={pageSize >= filteredDistributors.length}
            onClick={() => setPageSize(pageSize + 4)}
            type="ghost"
          >
            View more
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default History
