import StatusTag from 'components/statusTag'

import { ColumnProps } from './index'
import { useDistributorStatus } from 'hooks/distributor/useDistributorStatus'

const Status = ({ distributorAddress }: ColumnProps) => {
  const state = useDistributorStatus(distributorAddress)
  return <StatusTag state={state} />
}
export default Status
