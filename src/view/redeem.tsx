import { useCallback, useEffect, useMemo, useState } from 'react'

import { useWalletAddress } from '@sentre/senhub'

import { Row, Button } from 'antd'
import { notifyError } from '@sen-use/app'

import { MerkleDistributor } from 'lib'
import { useGetMetadata } from 'hooks/useGetMetadata'
import useWithdrawNFT from 'hooks/action/useWithdrawNFT'

const distributorAddress = '9GNAW8gpiatCFHryfF5XyhXP3wKXLb9Kqd3zgdn8y43M'

const Redeem = () => {
  const [loading, setLoading] = useState(false)
  const [merkle, setMerkle] = useState<MerkleDistributor>()
  const { onWithdraw } = useWithdrawNFT()
  const getMetaData = useGetMetadata()

  const walletAddress = useWalletAddress()

  const getMerkleDistributor = useCallback(async () => {
    try {
      const distributor = await window.leFlash.getDistributorData(
        distributorAddress,
      )
      console.log(distributor)
      const {
        data: { data },
      } = await getMetaData(distributor)

      const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))

      return setMerkle(merkleDistributor)
    } catch (error) {
      notifyError(error)
    } finally {
    }
  }, [getMetaData])

  const recipientData = useMemo(() => {
    if (!merkle) return
    const recipients = merkle.receipients
    for (const recipient of recipients) {
      if (walletAddress === recipient.authority.toBase58()) return recipient
    }
  }, [merkle, walletAddress])

  const onRedeem = async () => {
    if (!recipientData || !merkle) return
    const proof = merkle.deriveProof(recipientData)
    const validProof = merkle.verifyProof(proof, recipientData)
    if (!validProof) return

    try {
      setLoading(true)
      await window.leFlash.claim({
        distributorAddress,
        proof,
        data: recipientData,
      })
      console.log(recipientData.chequeAddress.toBase58())
      await onWithdraw(recipientData.chequeAddress.toBase58())
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMerkleDistributor()
  }, [getMerkleDistributor])

  return (
    <Row gutter={[24, 24]} justify="center" className="lightning-container">
      <Button type="primary" onClick={onRedeem} loading={loading}>
        Redeem
      </Button>
    </Row>
  )
}

export default Redeem
