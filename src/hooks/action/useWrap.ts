import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import { notifyError, notifySuccess } from '@sen-use/app'

import useLeFlash from 'hooks/useLeflash'
import { AppState } from 'model'
import { useWalletAddress } from '@sentre/senhub'

const useWrap = () => {
  const pools = useSelector(({ pools }: AppState) => pools)
  const [loading, setLoading] = useState(false)

  const walletAddress = useWalletAddress()
  const leFlash = useLeFlash()

  const onWrapCollection = useCallback(
    async (collection: string) => {
      try {
        setLoading(true)
        //Check is wrap NFT?
        let pool =
          Object.keys(pools).find(
            (address) => pools[address].mint.toBase58() === collection,
          ) || ''
        if (pool)
          throw new Error(
            'Collection have wrapped, please check the wrapped nft list on the left side',
          )
        // init Pool
        const { txId } = await leFlash.initializePool({
          mint: new web3.PublicKey(collection),
        })
        notifySuccess('Wrapped', txId)
      } catch (err) {
        notifyError(err)
      } finally {
        setLoading(false)
      }
    },
    [leFlash, pools],
  )

  const onWrapNfts = useCallback(
    async (nfts: string[], poolAddress: string) => {
      try {
        setLoading(true)

        let txs: {
          tx: web3.Transaction
          signers: web3.Keypair[]
        }[] = []
        for (const nftAddress of nfts) {
          const newChequeKeypair = web3.Keypair.generate()
          const { tx } = await leFlash.deposit({
            recipient: walletAddress,
            mintNFTAddress: nftAddress,
            sendAndConfirm: false,
            poolAddress,
            chequeKeypair: newChequeKeypair,
          })
          txs.push({ tx, signers: [newChequeKeypair] })
        }
        await leFlash._provider.sendAll(
          txs.map(({ tx, signers }) => ({ tx, signers })),
        )
        return window.notify({
          type: 'success',
          description: 'Wrapped all NFTs successfully!',
        })
      } catch (err) {
        notifyError(err)
      } finally {
        setLoading(false)
      }
    },
    [leFlash, walletAddress],
  )
  return { onWrapCollection, loading, onWrapNfts }
}

export default useWrap
