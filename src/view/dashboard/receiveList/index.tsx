import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'
import { MerkleDistributor } from 'lib'

import { Card, Col, Row, Table, Typography } from 'antd'
import FilterTrans from 'components/filterTrans'

import { AppState } from 'model'
import { RECEIVE_COLUMNS } from './column'
import { useGetMetadata } from 'hooks/metadata/useGetMetadata'

export type ReceiveData = {
  sender: string
  chequeAddress: string
  unlockDate: number
  expirationDate: number
  distributorAddress: string
}

const ReceiveList = () => {
  const [myList, setMyList] = useState<ReceiveData[]>([])
  const distributors = useSelector(({ distributors }: AppState) => distributors)
  const walletAddress = useWalletAddress()
  const getMetadata = useGetMetadata()

  const fetchMyList = useCallback(async () => {
    const result: ReceiveData[] = []
    for (const address in distributors) {
      const { endedAt, authority } = distributors[address]
      const { data } = await getMetadata(address)
      const merkle = MerkleDistributor.fromBuffer(Buffer.from(data))
      const recipients = merkle.receipients

      for (const recipient of recipients) {
        if (walletAddress === recipient.authority.toBase58()) {
          result.push({
            distributorAddress: address,
            chequeAddress: recipient.chequeAddress.toBase58(),
            expirationDate: endedAt.toNumber() * 1000,
            sender: authority.toBase58(),
            unlockDate: recipient.startedAt.toNumber() * 1000,
          })
          break
        }
      }
    }
    result.sort((a, b) => {
      if (!a.unlockDate) return 0
      return b.unlockDate - a.unlockDate
    })
    return setMyList(result)
  }, [distributors, getMetadata, walletAddress])

  useEffect(() => {
    fetchMyList()
  }, [fetchMyList])

  return (
    <Card>
      <Row gutter={[32, 32]}>
        <Col flex="auto">
          <Typography.Title level={4}>Airdrop Receive</Typography.Title>
        </Col>
        <Col>
          <FilterTrans />
        </Col>
        <Col span={24}>
          <Table
            columns={RECEIVE_COLUMNS}
            dataSource={myList}
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 ? 'odd-row' : 'even-row'
            }
          />
        </Col>
      </Row>
    </Card>
  )
}

export default ReceiveList
