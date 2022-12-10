import Collection from './collection'
import CreatedAt from './createdAt'
import Receivers from './receivers'
import UnlockAt from './unlockAt'

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
    title: 'UNLOCK DATE',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <UnlockAt distributorAddress={distributorAddress} />
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
    title: 'LIST RECEIVERS',
    dataIndex: 'distributorAddress',
    render: (distributorAddress: string) => (
      <Receivers distributorAddress={distributorAddress} />
    ),
  },
]
