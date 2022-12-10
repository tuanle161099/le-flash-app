import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'model'
import NFTDisplay from 'components/nftDisplay'

const NFT = ({
  chequeAddress,
  distributorAddress,
}: {
  chequeAddress: string
  distributorAddress: string
}) => {
  const cheques = useSelector(({ cheques }: AppState) => cheques)
  const receipts = useSelector(({ receipts }: AppState) => receipts)

  const mintNft = useMemo(() => {
    let result: string | undefined = ''
    result = Object.keys(receipts).find(
      (address) =>
        receipts[address].distributor.toBase58() === distributorAddress,
    )
    if (result) return receipts[result].mintAddress.toBase58()

    result = Object.keys(cheques).find((address) => address === chequeAddress)

    if (!result) return ''
    const collectionAddr = cheques[result].mint.toBase58()
    return collectionAddr
  }, [chequeAddress, cheques, distributorAddress, receipts])

  return <NFTDisplay mintAddress={mintNft} />
}

export default NFT
