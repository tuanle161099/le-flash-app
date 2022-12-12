import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { Button, Card, Col, Row, Table, Typography } from 'antd'
import FilterTrans from 'components/filterTrans'

import { AppState } from 'model'
import { HISTORY_COLUMNS } from './column'
import { useGetMetadata } from 'hooks/metadata/useGetMetadata'

const History = () => {
  const [pageSize, setPageSize] = useState(4)
  const [data, setData] = useState<{ distributorAddress: string }[]>([])
  const distributors = useSelector(({ distributors }: AppState) => distributors)
  const walletAddress = useWalletAddress()
  const getMetadata = useGetMetadata()

  const sortDistributors = useCallback(async () => {
    const result: { distributorAddress: string }[] = []
    const mapDistributor = new Map<string, number>()
    for (const distributorAddress in distributors) {
      const { authority } = distributors[distributorAddress]
      if (authority.toBase58() !== walletAddress) continue
      const { createAt } = await getMetadata(distributorAddress)
      mapDistributor.set(distributorAddress, createAt)
      result.push({ distributorAddress })
    }
    result.sort((a, b) => {
      const createAtA = mapDistributor.get(a.distributorAddress) || 0
      const createAtB = mapDistributor.get(b.distributorAddress) || 0
      return createAtB - createAtA
    })
    return setData(result)
  }, [distributors, getMetadata, walletAddress])

  useEffect(() => {
    sortDistributors()
  }, [sortDistributors])

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
            dataSource={data.slice(0, pageSize)}
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 ? 'odd-row' : 'even-row'
            }
          />
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            disabled={pageSize >= data.length}
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
