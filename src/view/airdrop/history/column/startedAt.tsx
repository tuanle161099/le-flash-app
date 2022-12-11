import moment from 'moment'

import { useMemo } from 'react'
import { MerkleDistributor } from 'lib'

import { Typography } from 'antd'

import { FORMAT_DATE } from 'constant'
import { ColumnProps } from './index'
import { useMetadata } from 'hooks/metadata/useGetMetadata'

const StartedAt = ({ distributorAddress }: ColumnProps) => {
  const metadata = useMetadata(distributorAddress)

  console.log(metadata)

  const startedAt = useMemo(() => {
    if (!metadata?.data) return 0
    const merkle = MerkleDistributor.fromBuffer(Buffer.from(metadata.data))
    const startTime = merkle.receipients[0].startedAt.toNumber()
    return startTime * 1000
  }, [metadata])

  return (
    <Typography.Text>
      {!startedAt ? 'Immediately' : moment(startedAt).format(FORMAT_DATE)}
    </Typography.Text>
  )
}

export default StartedAt
