import { Fragment, useEffect, useState } from 'react'

import { Button, Col, Empty, Modal, Row, Space, Typography } from 'antd'
import CardNFT from 'components/cardNFT'
import IonIcon from '@sentre/antd-ionicon'

import { useFindByCollection } from 'hooks/metaFlex/useNft'
import { useSelector } from 'react-redux'
import { AppState } from 'model'
import useWrap from 'hooks/action/useWrap'

type DepositNftProps = {
  poolAddress: string
}

const DepositNft = ({ poolAddress }: DepositNftProps) => {
  const [visible, setVisible] = useState(false)
  const [listNFT, setListNFT] = useState<string[]>([])
  const [mintAddresses, setMintAddresses] = useState<string[]>([])
  const pools = useSelector((state: AppState) => state.pools)
  const collectionAddr = pools[poolAddress].mint.toBase58()
  const nftsData = useFindByCollection(collectionAddr)
  const { loading, onWrapNfts } = useWrap()

  const onSelect = (mintAddress: string) => {
    const check = listNFT.includes(mintAddress)
    const nextList = [...listNFT]

    if (check) {
      const index = nextList.indexOf(mintAddress)
      nextList.splice(index, 1)
      return setListNFT(nextList)
    }
    nextList.push(mintAddress)
    return setListNFT(nextList)
  }

  const onCancel = () => {
    setVisible(false)
    setListNFT([])
  }

  const wrapNFT = async () => {
    await onWrapNfts(listNFT, poolAddress)
    const filterMint = [...mintAddresses].filter(
      (mint) => !listNFT.includes(mint),
    )
    setMintAddresses(filterMint)
  }

  useEffect(() => {
    const mints = nftsData.map((nft: any) => nft.mintAddress.toBase58())
    setMintAddresses(mints)
  }, [nftsData])

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)}>Wrap NFT</Button>
      <Modal
        open={visible}
        closeIcon={<IonIcon name="close-outline" />}
        onCancel={onCancel}
        style={{ paddingBottom: 0 }}
        footer={
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              loading={loading}
              onClick={wrapNFT}
              disabled={!listNFT.length}
              type="primary"
            >
              Wrap NFTs
            </Button>
          </Space>
        }
      >
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Typography.Title level={4}>Select a NFT</Typography.Title>
          </Col>
          <Col span={24}>
            {mintAddresses.length ? (
              <Row
                gutter={[8, 8]}
                className="scrollbar"
                style={{ maxHeight: 400, overflowY: 'hidden' }}
              >
                {mintAddresses.map((mintAddress) => (
                  <Col span={8} key={mintAddress}>
                    <CardNFT
                      mintAddress={mintAddress}
                      showName
                      onSelect={onSelect}
                      listSelected={listNFT}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty />
            )}
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default DepositNft
