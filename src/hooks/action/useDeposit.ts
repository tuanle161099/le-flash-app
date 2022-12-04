import { useCallback, useState } from 'react'
import { web3 } from '@project-serum/anchor'

import { notifyError, notifySuccess } from '@sen-use/app'

export type Recipient = {
  address?: string
  mintNft: string
}

export const useDeposit = () => {
  const [loading, setLoading] = useState(false)

  const onDeposit = useCallback(
    async (recipients: Recipient[], poolAddress: string) => {
      try {
        setLoading(true)
        let txs: {
          tx: web3.Transaction
          signers: web3.Keypair[]
        }[] = []

        for (const { address, mintNft } of recipients) {
          const newChequeKeypair = web3.Keypair.generate()
          const { tx, chequeAddress } = await window.leFlash.deposit({
            recipient: address,
            mintNFTAddress: mintNft,
            sendAndConfirm: false,
            poolAddress,
            chequeKeypair: newChequeKeypair,
          })
          txs.push({ tx, signers: [newChequeKeypair] })
          console.log('chequeAddress: ', chequeAddress)
        }

        await window.leFlash._provider.sendAll(
          txs.map(({ tx, signers }) => ({ tx, signers })),
        )
        return notifySuccess('Deposited successfully!', 'txId')
      } catch (error) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { onDeposit, loading }
}
