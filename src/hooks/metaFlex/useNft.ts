import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FindNftsByOwnerOutput,
  Sft,
  SftWithToken,
  Nft,
  NftWithToken,
} from '@metaplex-foundation/js'
import { useWalletAddress } from '@sentre/senhub'
import { web3 } from '@project-serum/anchor'
import { useMetaFlex } from './useMetaFlex'

export const useMyNfts = () => {
  const [nfts, setNfts] = useState<FindNftsByOwnerOutput>([])
  const metaFlex = useMetaFlex()
  const address = useWalletAddress()

  const fetchNfts = useCallback(async () => {
    const nfts: any = await metaFlex
      .nfts()
      .findAllByOwner({ owner: new web3.PublicKey(address) })
    return setNfts(nfts)
  }, [address, metaFlex])

  useEffect(() => {
    fetchNfts()
  }, [fetchNfts])

  return nfts
}

export const useMyCollection = () => {
  const nfts = useMyNfts()

  const myCollections = useMemo(() => {
    const collections: string[] = []

    for (const { collection } of nfts) {
      if (!collection) continue
      const collectionAddr = collection.address.toBase58()

      if (!collections.includes(collectionAddr))
        collections.push(collectionAddr)
    }
    return collections
  }, [nfts])

  return myCollections
}

export const useFindByCollection = (collection: string) => {
  const nfts = useMyNfts()

  const filteredByCollection = useMemo(() => {
    const result: FindNftsByOwnerOutput = []
    for (const nft of nfts) {
      if (!nft.collection) continue
      if (nft.collection.address.toBase58() === collection) result.push(nft)
    }
    return result
  }, [collection, nfts])

  return filteredByCollection
}

export const useNftData = (mintAddress: string) => {
  const [loading, setLoading] = useState(false)
  const [nftData, setNftData] = useState<
    Sft | SftWithToken | Nft | NftWithToken
  >()
  const metaFlex = useMetaFlex()

  const fetchNftData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await metaFlex
        .nfts()
        .findByMint({ mintAddress: new web3.PublicKey(mintAddress) })

      return setNftData(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [metaFlex, mintAddress])

  useEffect(() => {
    fetchNftData()
  }, [fetchNftData])

  return { nftData, loading }
}
