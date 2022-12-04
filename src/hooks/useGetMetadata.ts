import { useCallback } from 'react'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import axios from 'axios'

import configs from 'configs'
import { toFilename } from 'helper'
import { DistributorData } from 'lib'

export const useGetMetadata = () => {
  const getMetaData = useCallback(async (distributorData: DistributorData) => {
    const { metadata } = distributorData
    const cid = bs58.encode(Buffer.from(metadata))
    const fileName = toFilename(cid)
    const url = configs.api.aws + fileName
    const { data } = await axios.get(url)

    return { data: data.data }
  }, [])

  return getMetaData
}
