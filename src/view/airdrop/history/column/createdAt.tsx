import moment from 'moment'

import { Typography } from 'antd'

import { FORMAT_DATE } from 'constant'
import { useMetadata } from 'hooks/metadata/useGetMetadata'
import { ColumnProps } from './index'

const CreatedAt = ({ distributorAddress }: ColumnProps) => {
  const metadata = useMetadata(distributorAddress)
  const createAt = metadata?.createAt || 0
  return (
    <Typography.Text>
      {moment(createAt * 1000 || '').format(FORMAT_DATE)}
    </Typography.Text>
  )
}

export default CreatedAt
