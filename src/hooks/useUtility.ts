import { useMemo } from 'react'
import { rpc, useWalletAddress } from '@sentre/senhub'
import { getAnchorProvider } from '@sen-use/web3'
import { AnchorProvider } from '@project-serum/anchor'

import configs from 'configs'
import { Utility } from 'lib'

const useUtility = () => {
  const address = useWalletAddress()
  const utility = useMemo(() => {
    const provider = getAnchorProvider(
      rpc,
      address,
      window.sentre.solana,
    ) as AnchorProvider
    return new Utility(provider, configs.sol.leFlashId)
  }, [address])

  return utility
}

export default useUtility
