import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { splt, useAccounts, useWalletAddress } from '@sentre/senhub'

import { Card, Col, Row, Typography } from 'antd'
import CardLockNFT from './cardLockNFT'

import { AppState } from 'model'

const WithdrawNFT = () => {
  const [listCheques, setListCheques] = useState<string[]>([])
  const cheques = useSelector((state: AppState) => state.cheques)
  const pools = useSelector((state: AppState) => state.pools)
  const walletAddress = useWalletAddress()

  const accounts = useAccounts()

  const filterCheques = useCallback(async () => {
    const result: string[] = []
    for (const address in cheques) {
      const { pool } = cheques[address]
      const mintAddress = pools[pool.toBase58()].mintLpt.toBase58()
      const deriveAssociatedAddress = await splt.deriveAssociatedAddress(
        walletAddress,
        mintAddress,
      )
      const { amount } = accounts[deriveAssociatedAddress] || {}
      if (amount) result.push(address)
    }
    return setListCheques(result)
  }, [accounts, cheques, pools, walletAddress])

  useEffect(() => {
    filterCheques()
  }, [filterCheques])

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Withdraw NFT</Typography.Title>
        </Col>
        {listCheques.map((address) => (
          <Col span={12} key={address}>
            <CardLockNFT chequeAddr={address} />
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default WithdrawNFT
