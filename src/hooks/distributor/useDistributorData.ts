import { useSelector } from 'react-redux'
import { AppState } from 'model'

const useDistributorData = (distributorAddress: string) => {
  const distributorData = useSelector(
    ({ distributors }: AppState) => distributors[distributorAddress],
  )

  return distributorData
}

export default useDistributorData
