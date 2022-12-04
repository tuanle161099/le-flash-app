import { useMemo, useState } from 'react'

import { BN, web3 } from '@project-serum/anchor'
import { notifyError, notifySuccess } from '@sen-use/app'
import { Row, Col, Button } from 'antd'

import { Recipient, useDeposit } from 'hooks/action/useDeposit'
import useWithdrawNFT from 'hooks/action/useWithdrawNFT'
import { Leaf, MerkleDistributor } from 'lib'
import { useUploadFile } from 'hooks/useUploadFile'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import useUtility from 'hooks/useUtility'
import Redeem from './redeem'

const collection = 'PV64GFvXc9vNWWvQs9XAxGYjy9xzACHw9yAJhAypeVe'

// const mint1 = '6uAcYPE2sgsBzaSosUKq9uQAwbf4e8hQskCiHk88SuUk'
// const mint2 = '9ePZB4XqLBeJ7x867HF3CE4BNayD4zKAmYiPKBUokCWF'
// const mint3 = 'EeFwaZttwMSwGEKGq4c8JR7ApVATY2YVFvtzdmtsd3Sp'

// const r1 = '9n41gkNJAXuwtwpBxwAAS9wmDoEgH79cs3DtYqcawXwa'
// const r2 = '2A74q3JHKPpQLbz6AXsRgwSGzUVK57hx3Kf6te9n4Dbn'
const r3 = 'G7Q73K3cL2eQQrp7KcZw3hEboZb2Zmr2Lb7p6wNNiwdF'

const recipients: Recipient[] = [
  {
    mintNft: 'HR8NVufX46rhAWU6tUm4QmyB77BUwbN6HAxVWgpE3dEm',
  },
]

const recipientInfos = [
  {
    walletAddress: '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn',
    chequeAddress: 'CtgycWabAnLB7PYXQdhPp3FuuJqcwiCCGxvFWbsPmzyg',
    unlockTime: 0,
  },
]

const View = () => {
  const [mintAddress, setMintAddress] = useState(
    '8YD4Mi1B7huwJgjaipwLrTCr3rvq5DvDsRUmxqhowD2r',
  )
  const { onDeposit, loading: loadingDps } = useDeposit()
  const { loading: loadingWtd, onWithdraw } = useWithdrawNFT()
  const utility = useUtility()

  const [pool, setPool] = useState(
    'ENc9uK6z1sGLdp6iN2er32Aatxg6Cxr1TaY4FRJeP4pE',
  )
  const [loading, setLoading] = useState(false)
  const uploadToAWS = useUploadFile()

  const onInitPool = async () => {
    try {
      setLoading(true)
      const { poolAddress, txId } = await window.leFlash.initializePool({
        mint: new web3.PublicKey(collection),
      })
      setPool(poolAddress)
      console.log(poolAddress)
      notifySuccess('Initialized Pool successfully!', txId)
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  // const getReceipts = async () => {
  //   if (!pool) return
  //   try {
  //     setLoading(true)
  //     const data = await window.leFlash.fetchCheques()
  //     const bulk: Record<string, ChequeData> = {}
  //     console.log(data)
  //     for (const { account, publicKey } of data) {
  //       console.log(account.amount.toString())
  //       if (
  //         account.authority.toBase58() !==
  //           '2vAEiACep3J1N2J6YY9gt4gAbbFEvuVdWgyu8KUkgzgn' ||
  //         account.pool.toBase58() !== pool
  //       )
  //         continue
  //       bulk[publicKey.toBase58()] = account
  //     }
  //     console.log(bulk)
  //   } catch (error) {
  //     notifyError(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const getMint = async () => {
    const { mintLpt } = await window.leFlash.getPoolData(pool)
    console.log('mintLpt: ', mintLpt.toBase58())
    return setMintAddress(mintLpt.toBase58())
  }

  const treeData = useMemo(() => {
    const balanceTree: Leaf[] = recipientInfos.map(
      ({ chequeAddress, unlockTime, walletAddress }, index) => {
        return {
          authority: new web3.PublicKey(walletAddress),
          chequeAddress: new web3.PublicKey(chequeAddress),
          startedAt: new BN(unlockTime / 1000),
          salt: MerkleDistributor.salt(`le-flash/${index.toString()}`),
        }
      },
    )
    const merkleDistributor = new MerkleDistributor(balanceTree)
    const dataBuffer = merkleDistributor.toBuffer()
    console.log(dataBuffer)
    return dataBuffer
  }, [])

  const onConfirm = async () => {
    try {
      if (!treeData) throw new Error('Invalid Merkle Data')
      setLoading(true)
      console.log('dataBuffer')
      const merkleDistributor = MerkleDistributor.fromBuffer(treeData)

      const data = {
        checked: false,
        createAt: Math.floor(Date.now() / 1000),
        data: treeData,
      }
      const blob = [
        new Blob([JSON.stringify({ data }, null, 2)], {
          type: 'application/json',
        }),
      ]

      const file = new File(blob, 'metadata.txt')
      const cid = await uploadToAWS(file)
      const metadata = bs58.decode(cid)

      const { txId, distributorAddress } = await utility.initializeDistributor({
        tokenAddress: mintAddress,
        total: merkleDistributor.getTotal(),
        merkleRoot: merkleDistributor.deriveMerkleRoot(),
        metadata,
        endedAt: 0 / 1000,
      })

      console.log(distributorAddress)

      notifySuccess('Airdrop', txId)
    } catch (error: any) {
      window.notify({
        type: 'error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row>
      <Col span={12}>
        {/* <NftSelection onSelect={setMintAddress} selectedNFTs={[mintAddress]} /> */}
        <Button
          loading={loadingDps}
          disabled={!pool}
          onClick={() => onDeposit(recipients, pool)}
        >
          Deposit
        </Button>
        <Button loading={loading} onClick={onInitPool}>
          Init Pool
        </Button>
        <Button loading={loadingWtd} onClick={() => onWithdraw(r3)}>
          Withdraw
        </Button>
        <Button loading={loading} onClick={getMint}>
          getMint
        </Button>
        <Button loading={loading} onClick={onConfirm}>
          init distributor
        </Button>
        <Redeem />
      </Col>
    </Row>
  )
}

export default View
