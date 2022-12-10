import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import useDistributorData from 'hooks/distributor/useDistributorData'
import { AppState } from 'model'
import { ColumnProps } from './index'
import NFTDisplay from 'components/nftDisplay'

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

  return <NFTDisplay mintAddress={collection} />
}

export default Collection
