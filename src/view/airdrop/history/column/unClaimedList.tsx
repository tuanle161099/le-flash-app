import { Fragment, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { MerkleDistributor } from 'lib'
import { util } from '@sentre/senhub'

import { Button, Col, Modal, Row, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import NFTDisplay from 'components/nftDisplay'

import { useMetadata } from 'hooks/metadata/useGetMetadata'
import { ColumnProps } from './index'
import { AppState } from 'model'

export type Receiver = {
  walletAddress: string
  mintAddress: string
  chequeAddress: string
}

export const COLUMNS = [
  {
    title: 'WALLET ADDRESS',
    dataIndex: 'walletAddress',
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
    title: 'NFT INFO',
    dataIndex: 'mintAddress',
    render: (mintAddress: string) => <NFTDisplay mintAddress={mintAddress} />,
  },
]

const UnclaimedList = ({ distributorAddress }: ColumnProps) => {
  const [visible, setVisible] = useState(false)
  const metadata = useMetadata(distributorAddress)
  const cheques = useSelector(({ cheques }: AppState) => cheques)

  const listReceivers = useMemo(() => {
    const result: Receiver[] = []
    if (!metadata) return result
    const merkle = MerkleDistributor.fromBuffer(Buffer.from(metadata.data))
    const recipients = merkle.receipients
    for (const { chequeAddress, authority } of recipients) {
      if (!cheques[chequeAddress.toBase58()]) continue
      const { mint } = cheques[chequeAddress.toBase58()]
      result.push({
        walletAddress: authority.toBase58(),
        mintAddress: mint.toBase58(),
        chequeAddress: chequeAddress.toBase58(),
      })
    }
    return result
  }, [cheques, metadata])

  return (
    <Fragment>
      {listReceivers.length ? (
        <Button
          icon={<IonIcon name="document-text-outline" />}
          onClick={() => setVisible(true)}
          disabled={!listReceivers.length}
        />
      ) : (
        <Typography.Text className="caption" type="success">
          ALL CLAIMED
        </Typography.Text>
      )}
      <Modal
        open={visible}
        footer={null}
        closeIcon={<IonIcon name="close-outline" />}
        onCancel={() => setVisible(false)}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Title level={5}> List Receivers </Typography.Title>
          </Col>
          <Col span={24}>
            <Table
              pagination={false}
              columns={COLUMNS}
              dataSource={listReceivers}
              rowKey={(record) => record.chequeAddress}
              rowClassName={(record, index) =>
                index % 2 ? 'odd-row' : 'even-row'
              }
            />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default UnclaimedList
