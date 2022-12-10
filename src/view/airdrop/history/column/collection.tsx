import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Avatar, Space, Typography } from 'antd'

import useDistributorData from 'hooks/distributor/useDistributorData'
import { useNftData } from 'hooks/metaFlex/useNft'
import { AppState } from 'model'
import { ColumnProps } from './index'

const Collection = ({ distributorAddress }: ColumnProps) => {
  const pools = useSelector(({ pools }: AppState) => pools)
  const { mint } = useDistributorData(distributorAddress)

  const collection = useMemo(() => {
    const result = Object.keys(pools).find(
      (address) => pools[address].mintLpt.toBase58() === mint.toBase58(),
    )
    if (!result) return ''
    const collectionAddr = pools[result].mint.toBase58()
    return collectionAddr
  }, [mint, pools])

  const { nftData } = useNftData(collection)

  return (
    <Space>
      <Avatar size={24} src={nftData?.json?.image} />
      <Typography.Text>{nftData?.name || nftData?.json?.name}</Typography.Text>
    </Space>
  )
}

export default Collection
