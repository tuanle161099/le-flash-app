import { useCallback, useEffect, useState } from 'react'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import axios from 'axios'

import useDistributorData from 'hooks/distributor/useDistributorData'
import { toFilename } from 'helper'
import configs from 'configs'

export const useGetMetadata = (distributorAddress: string) => {
  const distributorData = useDistributorData(distributorAddress)
  const [metadata, setMetadata] = useState<{ createAt: number; data: Buffer }>()

  const getMetaData = useCallback(async () => {
    const { metadata } = distributorData
    const cid = bs58.encode(Buffer.from(metadata))
    const fileName = toFilename(cid)
    const url = configs.api.aws + fileName
    const { data } = await axios.get(url)
    return setMetadata(data.data)
  }, [distributorData])

  useEffect(() => {
    getMetaData()
  }, [getMetaData])

  return metadata
}
