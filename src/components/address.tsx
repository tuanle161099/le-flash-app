import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { util } from '@sentre/senhub'

import { Space, Typography, Tooltip } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

const Address = ({
  address,
  large,
  success,
}: {
  address: string
  large?: boolean
  success?: boolean
}) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    await util.asyncWait(1500)
    setCopied(false)
  }

  const className = large ? '' : 'caption'
  const type = success ? 'success' : 'secondary'

  return (
    <Space>
      <Typography.Text
        underline
        onClick={() => window.open(util.explorer(address), '_blank')}
        type={type}
        className={className}
        style={{ cursor: 'pointer' }}
      >
        {util.shortenAddress(address, 3)}
      </Typography.Text>
      <Tooltip title="Copied" open={copied}>
        <CopyToClipboard text={address} onCopy={onCopy}>
          <Typography.Text style={{ cursor: 'pointer' }} className={className}>
            <IonIcon name="copy-outline" />
          </Typography.Text>
        </CopyToClipboard>
      </Tooltip>
    </Space>
  )
}

export default Address
