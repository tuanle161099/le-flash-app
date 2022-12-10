import moment from 'moment'

import { Typography } from 'antd'

import { FORMAT_DATE } from 'constant'
import { ColumnProps } from './index'
import useDistributorData from 'hooks/distributor/useDistributorData'

const UnlockAt = ({ distributorAddress }: ColumnProps) => {
  const { startedAt } = useDistributorData(distributorAddress)

  return (
    <Typography.Text>
      {startedAt.isZero()
        ? 'Immediately'
        : moment(startedAt.toNumber() * 1000).format(FORMAT_DATE)}
    </Typography.Text>
  )
}

export default UnlockAt
