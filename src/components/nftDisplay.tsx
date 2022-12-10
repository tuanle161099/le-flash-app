import { Avatar, Space, Spin, Typography } from 'antd'
import Address from './address'

import { useNftData } from 'hooks/metaFlex/useNft'

type NFTDisplayProps = {
  mintAddress: string
}

const NFTDisplay = ({ mintAddress }: NFTDisplayProps) => {
  const { nftData, loading } = useNftData(mintAddress)
  return (
    <Spin spinning={loading}>
      <Space size={12}>
        <Avatar size={32} src={nftData?.json?.image} />
        <Space size={0} direction="vertical">
          <Typography.Text>
            {nftData?.name || nftData?.json?.name}
          </Typography.Text>
          <Address address={mintAddress} />
        </Space>
      </Space>
    </Spin>
  )
}

export default NFTDisplay
