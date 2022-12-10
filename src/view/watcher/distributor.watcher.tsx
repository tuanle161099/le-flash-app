import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

// import { initFarms, upsetFarm } from 'model/farms.controller'
import Watcher from './watcher'
import useLeFlash from 'hooks/useLeflash'
import {
  initDistributors,
  upsetDistributor,
} from 'model/distributor.controller'

// TODO: Config
const NAME = 'distributor'
const FILTER: web3.GetProgramAccountsFilter[] = []

const DistributorWatcher = () => {
  const dispatch = useDispatch()
  const leFlash = useLeFlash()

  // TODO: init all account data
  const init = useCallback(
    (data) => dispatch(initDistributors(data)),
    [dispatch],
  )
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetDistributor({ address: key, data: value })),
    [dispatch],
  )

  return (
    <Watcher
      program={leFlash.program}
      name={NAME}
      filter={FILTER}
      init={init}
      upset={upset}
    />
  )
}
export default DistributorWatcher
