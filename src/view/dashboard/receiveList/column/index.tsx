import moment from 'moment'
import { util } from '@sentre/senhub'

import { Typography } from 'antd'
import NFTDisplay from './nft'
import Status from './status'
import Claim from './claim'

import { FORMAT_DATE } from 'constant'
import { ReceiveData } from '..'

export type ColumnProps = {
  distributorAddress: string
}

export const RECEIVE_COLUMNS = [
  {
    title: 'UNLOCK DATE',
    dataIndex: 'unlockDate',
    render: (unlockDate: string) => (
      <Typography.Text>
        {unlockDate ? moment(unlockDate).format(FORMAT_DATE) : 'Immediately'}
      </Typography.Text>
    ),
  },
  {
    title: 'EXPIRATION DATE',
    dataIndex: 'expirationDate',
    render: (expirationDate: string) => (
      <Typography.Text>
        {expirationDate
          ? moment(expirationDate).format(FORMAT_DATE)
          : 'Unlimited'}
      </Typography.Text>
    ),
  },
  {
    title: 'SENDER',
    dataIndex: 'sender',
    render: (sender: string) => (
      <Typography.Text
        type="success"
        underline
        onClick={() => window.open(util.explorer(sender), '_blank')}
        style={{ cursor: 'pointer' }}
      >
        {util.shortenAddress(sender)}
      </Typography.Text>
    ),
  },

  {
    title: 'NFT',
    dataIndex: 'chequeAddress',
    render: (chequeAddress: string, { distributorAddress }: ReceiveData) => (
      <NFTDisplay
        chequeAddress={chequeAddress}
        distributorAddress={distributorAddress}
      />
    ),
  },
  {
    title: 'STATUS',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <Status distributorAddress={distributorAddress} />
    ),
  },
  {
    title: 'ACTION',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <Claim distributorAddress={distributorAddress} />
    ),
  },
]
