import Collection from './collection'
import CreatedAt from './createdAt'
import UnclaimedList from './unClaimedList'
import StartedAt from './startedAt'
import Total from './total'

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
    title: 'STARTED DATE',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <StartedAt distributorAddress={distributorAddress} />
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
    title: 'Total',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <Total distributorAddress={distributorAddress} />
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
