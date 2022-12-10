import moment from 'moment'

import { Typography } from 'antd'

import { FORMAT_DATE } from 'constant'
import { ColumnProps } from './index'
import useDistributorData from 'hooks/distributor/useDistributorData'

const EndAt = ({ distributorAddress }: ColumnProps) => {
  const { endedAt } = useDistributorData(distributorAddress)

  return (
    <Typography.Text>
      {endedAt.isZero()
        ? 'Unlimited'
        : moment(endedAt.toNumber() * 1000).format(FORMAT_DATE)}
    </Typography.Text>
  )
}

export default EndAt
