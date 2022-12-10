import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import axios from 'axios'

import configs from 'configs'
import { toFilename } from 'helper'
import { AppState } from 'model'

export const useMetadata = (distributorAddress: string) => {
  const [metadata, setMetadata] = useState<{ createAt: number; data: Buffer }>()
  const getMetaData = useGetMetadata()

  const fetchMetadata = useCallback(async () => {
    const metadata = await getMetaData(distributorAddress)
    return setMetadata(metadata)
  }, [distributorAddress, getMetaData])

  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])
  return metadata
}

export const useGetMetadata = () => {
  const distributors = useSelector(({ distributors }: AppState) => distributors)
  const getMetaData = useCallback(
    async (distributorAddress: string) => {
      const distributorData = distributors[distributorAddress]
      const { metadata } = distributorData
      const cid = bs58.encode(Buffer.from(metadata))
      const fileName = toFilename(cid)
      const url = configs.api.aws + fileName
      const { data } = await axios.get(url)
      return data.data
    },
    [distributors],
  )

  return getMetaData
}
