import { Fragment, useMemo } from 'react'
import DistributorWatcher from './distributor.watcher'

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
      {loading ? null : children}
    </Fragment>
  )
}
