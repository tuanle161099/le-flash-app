import { Fragment, useEffect, useState } from 'react'
import { rpc, useWalletAddress } from '@sentre/senhub'
import { getAnchorProvider } from '@sen-use/web3'
import { AnchorProvider } from '@project-serum/anchor'

import LeFlashProgram from 'lib/core'
import configs from 'configs'

export const AppLoader: React.FC = ({ children }) => {
  const address = useWalletAddress()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    const provider = getAnchorProvider(
      rpc,
      address,
      window.sentre.solana,
    ) as AnchorProvider
    const leFlashProgram = new LeFlashProgram(provider, configs.sol.leFlashId)
    window.leFlash = leFlashProgram

    setLoaded(true)
  }, [address, loaded])

  if (!loaded) return null
  return <Fragment>{children}</Fragment>
}
