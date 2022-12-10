import { useCallback, useState } from 'react'
import { BN, web3 } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'

import { notifyError, notifySuccess } from '@sen-use/app'
import { RecipientInfo } from 'model/recipients.controller'
import { Leaf, MerkleDistributor } from 'lib'
import { useUploadFile } from 'hooks/useUploadFile'
import useLeFlash from 'hooks/useLeflash'

export type Recipient = {
  address?: string
  mintNft: string
}

export const useInitAirdrop = () => {
  const [loading, setLoading] = useState(false)
  const uploadToAWS = useUploadFile()
  const leFlash = useLeFlash()

  const onAirdrop = useCallback(
    async (recipients: RecipientInfo[], collection: string) => {
      try {
        setLoading(true)
        let txs: {
          tx: web3.Transaction
          signers: web3.Keypair[]
        }[] = []

        const { poolAddress } = await leFlash.initializePool({
          mint: new web3.PublicKey(collection),
        })

        const nextRecipients: RecipientInfo[] = []
        for (const { walletAddress, mintAddress } of recipients) {
          const newChequeKeypair = web3.Keypair.generate()
          const { tx, chequeAddress } = await leFlash.deposit({
            recipient: walletAddress,
            mintNFTAddress: mintAddress,
            sendAndConfirm: false,
            poolAddress,
            chequeKeypair: newChequeKeypair,
          })
          txs.push({ tx, signers: [newChequeKeypair] })
          nextRecipients.push({
            walletAddress,
            chequeAddress,
            mintAddress,
          })
        }

        const balanceTree: Leaf[] = nextRecipients.map(
          ({ chequeAddress, walletAddress }, index) => {
            return {
              authority: new web3.PublicKey(walletAddress),
              chequeAddress: new web3.PublicKey(chequeAddress || ''),
              startedAt: new BN(Date.now() / 1000),
              salt: MerkleDistributor.salt(`le-flash/${index.toString()}`),
            }
          },
        )
        const newMerkle = new MerkleDistributor(balanceTree)
        const dataBuffer = newMerkle.toBuffer()

        const data = {
          checked: false,
          createAt: Math.floor(Date.now() / 1000),
          data: dataBuffer,
        }
        const blob = [
          new Blob([JSON.stringify({ data }, null, 2)], {
            type: 'application/json',
          }),
        ]

        const file = new File(blob, 'metadata.txt')
        const cid = await uploadToAWS(file)
        const metadata = bs58.decode(cid)
        const { mintLpt } = await leFlash.getPoolData(poolAddress)
        const distributor = web3.Keypair.generate()
        const { txId, tx } = await leFlash.initializeDistributor({
          tokenAddress: mintLpt.toBase58(),
          total: newMerkle.getTotal(),
          merkleRoot: newMerkle.deriveMerkleRoot(),
          metadata,
          endedAt: 0 / 1000,
          distributor,
          sendAndConfirm: false,
        })

        txs.push({ tx, signers: [distributor] })

        await leFlash._provider.sendAll(
          txs.map(({ tx, signers }) => ({ tx, signers })),
        )
        return notifySuccess('Initialize new airdrop successfully!', txId)
      } catch (error) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [leFlash, uploadToAWS],
  )

  return { onAirdrop, loading }
}
