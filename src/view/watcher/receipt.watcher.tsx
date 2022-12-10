import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'
import { useWalletAddress } from '@sentre/senhub'

import Watcher from './watcher'
import useLeFlash from 'hooks/useLeflash'
import { initReceipts, upsetReceipt } from 'model/receipt.controller'

// TODO: Config
const NAME = 'receipt'

const ReceiptWatcher = () => {
  const dispatch = useDispatch()
  const leFlash = useLeFlash()
  const walletAddress = useWalletAddress()

  const FILTER: web3.GetProgramAccountsFilter[] = [
    {
      dataSize: 184,
    },
    {
      memcmp: {
        offset: 8,
        bytes: walletAddress,
      },
    },
  ]

  // TODO: init all account data
  const init = useCallback((data) => dispatch(initReceipts(data)), [dispatch])
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetReceipt({ address: key, data: value })),
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
export default ReceiptWatcher
