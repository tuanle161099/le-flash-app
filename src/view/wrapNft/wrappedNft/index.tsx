import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { util } from '@sentre/senhub'

import { Card, Col, Row, Table, Typography } from 'antd'
import NFTDisplay from 'components/nftDisplay'

import { AppState } from 'model'

export const COLUMNS = [
  {
    title: 'MINT ADDRESS',
    dataIndex: 'mint',
    render: (walletAddress: string) => (
      <Typography.Text
        type="success"
        underline
        onClick={() => window.open(util.explorer(walletAddress), '_blank')}
        style={{ cursor: 'pointer' }}
      >
        {util.shortenAddress(walletAddress)}
      </Typography.Text>
    ),
  },
  {
    title: 'NFT ADDRESS',
    dataIndex: 'nftMint',
    render: (mintAddress: string) => <NFTDisplay mintAddress={mintAddress} />,
  },
]

const WrappedNFT = () => {
  const pools = useSelector((state: AppState) => state.pools)
  const nftWrapped = useMemo(() => {
    const result: { mint: string; nftMint: string }[] = []
    for (const address in pools) {
      const nftAddress = pools[address].mint.toBase58()
      const mintAddress = pools[address].mintLpt.toBase58()
      const check = result.find(({ nftMint }) => nftMint === nftAddress)
      if (check) continue
      result.push({ mint: mintAddress, nftMint: nftAddress })
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
