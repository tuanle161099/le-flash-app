import { Button } from 'antd'
import { State } from 'constant'

import { useClaim } from 'hooks/action/useClaim'
import { useDistributorStatus } from 'hooks/distributor/useDistributorStatus'
import { ColumnProps } from './index'

const Claim = ({ distributorAddress }: ColumnProps) => {
  const state = useDistributorStatus(distributorAddress)
  const { loading, onClaim } = useClaim()
  return (
    <Button
      onClick={() => onClaim(distributorAddress)}
      type="text"
      loading={loading}
      disabled={state === State.claimed}
      style={{ color: state === State.claimed ? '' : '#ED8000' }}
    >
      CLAIM
    </Button>
  )
}

export default Claim
