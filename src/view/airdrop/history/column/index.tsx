import Collection from './collection'
import CreatedAt from './createdAt'
import UnclaimedList from './unClaimedList'
import EndAt from './endAt'

export type ColumnProps = {
  distributorAddress: string
}

export const HISTORY_COLUMNS = [
  {
    title: 'CREATED DATE',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <CreatedAt distributorAddress={distributorAddress} />
    ),
  },
  {
    title: 'EXPIRATION DATE',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <EndAt distributorAddress={distributorAddress} />
    ),
  },
  {
    title: 'COLLECTION',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <Collection distributorAddress={distributorAddress} />
    ),
  },

  {
    title: 'UNCLAIMED LIST',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <UnclaimedList distributorAddress={distributorAddress} />
    ),
  },
]
