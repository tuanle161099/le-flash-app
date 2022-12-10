import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'
import { notifyError, notifySuccess } from '@sen-use/app'
import { web3 } from '@project-serum/anchor'

import { AppState } from 'model'
import { useGetMetadata } from 'hooks/metadata/useGetMetadata'
import { Leaf, MerkleDistributor } from 'lib'
import useLeFlash from 'hooks/useLeflash'

export const useClaim = () => {
  const cheques = useSelector(({ cheques }: AppState) => cheques)
  const getMetaData = useGetMetadata()
  const walletAddress = useWalletAddress()
  const [loading, setLoading] = useState(false)
  const leFlash = useLeFlash()
  const onClaim = useCallback(
    async (distributorAddress: string) => {
      try {
        setLoading(true)
        const { data } = await getMetaData(distributorAddress)
        const merkle = MerkleDistributor.fromBuffer(Buffer.from(data))
        let recipientData: Leaf | null = null
        for (const recipient of merkle.receipients) {
          if (walletAddress === recipient.authority.toBase58())
            recipientData = recipient
        }
        if (!recipientData) throw new Error('You not in list!')
        const proof = merkle.deriveProof(recipientData)
        const validProof = merkle.verifyProof(proof, recipientData)
        if (!validProof) throw new Error('Invalid proof')

        const chequeAddress = recipientData.chequeAddress.toBase58()
        const { mint } = cheques[chequeAddress]
        const tran = new web3.Transaction()

        const { tx: txClaim, txId } = await leFlash.claim({
          distributorAddress,
          data: recipientData,
          proof,
          sendAndConfirm: false,
          mintAddress: mint.toBase58(),
        })
        tran.add(txClaim)

        const { tx: txWithdraw } = await window.leFlash.withdrawNFT({
          chequeAddress,
          sendAndConfirm: false,
        })
        tran.add(txWithdraw)

        const { tx: txClose } = await window.leFlash.closeCheque({
          chequeAddress,
          sendAndConfirm: false,
        })
        tran.add(txClose)

        await leFlash._provider.sendAndConfirm(tran)
        notifySuccess('Claimed NFT successfully!', txId)
      } catch (error) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [cheques, getMetaData, leFlash, walletAddress],
  )

  return { onClaim, loading }
}
