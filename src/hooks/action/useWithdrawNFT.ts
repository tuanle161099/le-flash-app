import { useCallback, useState } from 'react'
import { web3 } from '@project-serum/anchor'

import { notifyError, notifySuccess } from '@sen-use/app'

const useWithdrawNFT = () => {
  const [loading, setLoading] = useState(false)
  const onWithdraw = useCallback(async (chequeAddress: string) => {
    try {
      setLoading(true)
      const tran: web3.Transaction[] = []
      const { tx: txWithdraw } = await window.leFlash.withdrawNFT({
        chequeAddress,
        sendAndConfirm: false,
      })
      tran.push(txWithdraw)
      const { tx: txClose } = await window.leFlash.closeCheque({
        chequeAddress,
        sendAndConfirm: false,
      })
      tran.push(txClose)

      await window.leFlash._provider.sendAll(
        tran.map((tx) => ({ tx, signers: [] })),
      )
      notifySuccess('Withdraw NFT successfully!', '')
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }, [])
  return { loading, onWithdraw }
}

export default useWithdrawNFT
