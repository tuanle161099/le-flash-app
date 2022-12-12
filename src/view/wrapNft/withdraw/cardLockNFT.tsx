import { useSelector } from 'react-redux'

import { AppState } from 'model'
import { Button, Col, Row } from 'antd'

import NFTDisplay from 'components/nftDisplay'
import useWithdrawNFT from 'hooks/action/useWithdrawNFT'

const CardLockNFT = ({ chequeAddr }: { chequeAddr: string }) => {
  const chequeData = useSelector((state: AppState) => state.cheques[chequeAddr])
  const { loading, onWithdraw } = useWithdrawNFT()
  if (!chequeData) return null
  return (
    <Row align="middle">
      <Col flex="auto">
        <NFTDisplay mintAddress={chequeData.mint.toBase58()} />
      </Col>
      <Col>
        <Button
          loading={loading}
          type="primary"
          onClick={() => onWithdraw(chequeAddr)}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default CardLockNFT
