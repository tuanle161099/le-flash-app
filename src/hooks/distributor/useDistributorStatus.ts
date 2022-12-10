import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import useDistributorData from './useDistributorData'
import { State } from 'constant'
import { AppState } from 'model'

export const useDistributorStatus = (distributorAddress: string) => {
  const distributorData = useDistributorData(distributorAddress)
  const receipts = useSelector(({ receipts }: AppState) => receipts)

  const state = useMemo(() => {
    const { startedAt } = distributorData
    const startTime = startedAt.toNumber() * 1000
    const now = Date.now()

    const result = Object.keys(receipts).find(
      (address) =>
        receipts[address].distributor.toBase58() === distributorAddress,
    )
    if (result) return State.claimed

    if (startTime > now) return State.waiting
    return State.ready
  }, [distributorAddress, distributorData, receipts])

  return state
}
