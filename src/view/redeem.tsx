import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGetMintDecimals, useWalletAddress } from '@sentre/senhub'
import { BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { Image, Space, Typography, Row, Col, Button, Card } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintSymbol, notifyError, notifySuccess } from '@sen-use/app'

import { DistributorData, MerkleDistributor } from 'lib'
import useUtility from 'hooks/useUtility'
import { useGetMetadata } from 'hooks/useGetMetadata'
import useWithdrawNFT from 'hooks/action/useWithdrawNFT'

const distributorAddress = '9GNAW8gpiatCFHryfF5XyhXP3wKXLb9Kqd3zgdn8y43M'

const Redeem = () => {
  const [loading, setLoading] = useState(false)
  const [loadingCard, setLoadingCard] = useState(false)
  const [merkle, setMerkle] = useState<MerkleDistributor>()
  const [distributor, setDistributor] = useState<DistributorData>()
  const [isValid, setIsValid] = useState(true)
  const [isMember, setIsMember] = useState(true)
  const { onWithdraw } = useWithdrawNFT()

  const getDecimals = useGetMintDecimals()
  const getMetaData = useGetMetadata()

  const walletAddress = useWalletAddress()
  const utility = useUtility()

  const getMerkleDistributor = useCallback(async () => {
    setLoadingCard(true)
    try {
      const distributor = await utility.getDistributorData(distributorAddress)
      console.log(distributor)
      setDistributor(distributor)
      const {
        data: { data },
      } = await getMetaData(distributor)

      console.log(data)

      const merkleDistributor = MerkleDistributor.fromBuffer(Buffer.from(data))
      console.log(merkleDistributor)

      return setMerkle(merkleDistributor)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoadingCard(false)
    }
  }, [getMetaData, utility])

  const recipientData = useMemo(() => {
    if (!merkle) return
    const recipients = merkle.receipients
    for (const recipient of recipients) {
      if (walletAddress === recipient.authority.toBase58()) return recipient
    }
    setIsMember(false)
    return setIsValid(false)
  }, [merkle, walletAddress])

  const onRedeem = async () => {
    if (!recipientData || !merkle) return
    const proof = merkle.deriveProof(recipientData)
    const validProof = merkle.verifyProof(proof, recipientData)
    if (!validProof) return

    try {
      setLoading(true)
      const { tx } = await utility.claim({
        distributorAddress,
        proof,
        data: recipientData,
      })
      console.log(recipientData.chequeAddress.toBase58())
      await onWithdraw(recipientData.chequeAddress.toBase58())
      return setIsValid(false)
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
