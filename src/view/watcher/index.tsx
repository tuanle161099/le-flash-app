import { Fragment, useMemo } from 'react'
import ChequeWatcher from './cheque.watcher'
import DistributorWatcher from './distributor.watcher'
import PoolWatcher from './pool.watcher'

import { useWatcherLoading } from './watcher'

export const AppWatcher: React.FC = ({ children }) => {
  const [loadingInfo] = useWatcherLoading()

  const loading = useMemo(
    () =>
      !Object.values(loadingInfo).length ||
      Object.values(loadingInfo).includes(true),
    [loadingInfo],
  )

  return (
    <Fragment>
      <DistributorWatcher />
      <PoolWatcher />
      <ChequeWatcher />
      {loading ? null : children}
    </Fragment>
  )
}
