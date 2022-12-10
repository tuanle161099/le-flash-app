import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import Watcher from './watcher'
import useLeFlash from 'hooks/useLeflash'
import { initPools, upsetPool } from 'model/pool.controller'

// TODO: Config
const NAME = 'pool'
const FILTER: web3.GetProgramAccountsFilter[] = []

const PoolWatcher = () => {
  const dispatch = useDispatch()
  const leFlash = useLeFlash()

  // TODO: init all account data
  const init = useCallback((data) => dispatch(initPools(data)), [dispatch])
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetPool({ address: key, data: value })),
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
export default PoolWatcher
