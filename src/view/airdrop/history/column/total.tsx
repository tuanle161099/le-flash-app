import { Typography } from 'antd'

import useDistributorData from 'hooks/distributor/useDistributorData'
import { ColumnProps } from './index'

const Total = ({ distributorAddress }: ColumnProps) => {
  const { total } = useDistributorData(distributorAddress)
  return <Typography.Text>{total.toString()}</Typography.Text>
}

export default Total
