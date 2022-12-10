import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

// import { initFarms, upsetFarm } from 'model/farms.controller'
import Watcher from './watcher'
import useLeFlash from 'hooks/useLeflash'
import { initCheques, upsetCheque } from 'model/cheque.controller'

// TODO: Config
const NAME = 'cheque'
const FILTER: web3.GetProgramAccountsFilter[] = []

const ChequeWatcher = () => {
  const dispatch = useDispatch()
  const leFlash = useLeFlash()

  // TODO: init all account data
  const init = useCallback((data) => dispatch(initCheques(data)), [dispatch])
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetCheque({ address: key, data: value })),
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
export default ChequeWatcher
