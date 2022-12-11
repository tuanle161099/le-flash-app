import { useSelector } from 'react-redux'
import { AppState } from 'model'

const usePoolData = (poolAddress: string) => {
  const poolData = useSelector((state: AppState) => state.pools[poolAddress])
  return poolData
}

export default usePoolData
