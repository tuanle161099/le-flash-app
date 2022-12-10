import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Avatar, Space, Typography } from 'antd'

import { useNftData } from 'hooks/metaFlex/useNft'
import { AppState } from 'model'

const NFTDisplay = ({ chequeAddress }: { chequeAddress: string }) => {
  const cheques = useSelector(({ cheques }: AppState) => cheques)

  const mintNft = useMemo(() => {
    const result = Object.keys(cheques).find(
      (address) => address === chequeAddress,
    )
    if (!result) return ''
    const collectionAddr = cheques[result].mint.toBase58()
    return collectionAddr
  }, [chequeAddress, cheques])

  const { nftData } = useNftData(mintNft)

  return (
    <Space>
      <Avatar size={24} src={nftData?.json?.image} />
      <Typography.Text>{nftData?.name || nftData?.json?.name}</Typography.Text>
    </Space>
  )
}

export default NFTDisplay
