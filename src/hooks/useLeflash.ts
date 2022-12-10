import { useMemo } from 'react'
import { rpc, useWalletAddress } from '@sentre/senhub'
import { getAnchorProvider } from '@sen-use/web3'
import { AnchorProvider } from '@project-serum/anchor'

import LeFlashProgram from 'lib/core'
import configs from 'configs'

const useLeFlash = () => {
  const address = useWalletAddress()
  const leFlash = useMemo(() => {
    const provider = getAnchorProvider(
      rpc,
      address,
      window.sentre.solana,
    ) as AnchorProvider
    const leFlashProgram = new LeFlashProgram(provider, configs.sol.leFlashId)
    return leFlashProgram
  }, [address])
  return leFlash
}

export default useLeFlash
