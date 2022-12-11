import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Card, Col, Row, Table, Typography } from 'antd'
import NFTDisplay from 'components/nftDisplay'
import DepositNft from './depositNft'

import { AppState } from 'model'
import Address from 'components/address'

export const COLUMNS = [
  {
    title: 'COLLECTION',
    dataIndex: 'collectionMint',
    render: (collectionAddr: string) => (
      <NFTDisplay mintAddress={collectionAddr} />
    ),
  },
  {
    title: 'MINT ADDRESS',
    dataIndex: 'mint',
    render: (mintAddress: string) => (
      <Address large success address={mintAddress} />
    ),
  },
  {
    title: 'DEPOSIT',
    dataIndex: 'poolAddress',
    render: (poolAddress: string) => <DepositNft poolAddress={poolAddress} />,
  },
]

const WrappedNFT = () => {
  const pools = useSelector((state: AppState) => state.pools)
  const nftWrapped = useMemo(() => {
    const result: {
      mint: string
      collectionMint: string
      poolAddress: string
    }[] = []
    for (const address in pools) {
      const collectionAddr = pools[address].mint.toBase58()
      const mintAddress = pools[address].mintLpt.toBase58()
      const check = result.find(
        ({ collectionMint }) => collectionMint === collectionAddr,
      )
      if (check) continue
      result.push({
        mint: mintAddress,
        collectionMint: collectionAddr,
        poolAddress: address,
      })
    }
    return result
  }, [pools])

  return (
    <Card bodyStyle={{ padding: 12 }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Wrapped NFTs</Typography.Title>
        </Col>
        <Col span={24} className="scrollbar" style={{ maxHeight: 400 }}>
          <Table
            dataSource={nftWrapped}
            columns={COLUMNS}
            pagination={false}
            rowKey={(i) => i.mint}
            rowClassName={(record, index) =>
              index % 2 ? 'odd-row' : 'even-row'
            }
          />
        </Col>
      </Row>
    </Card>
  )
}
export default WrappedNFT
