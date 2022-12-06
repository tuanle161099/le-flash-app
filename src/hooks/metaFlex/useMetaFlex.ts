import { useMemo } from 'react'
import { Metaplex } from '@metaplex-foundation/js'
import { connection } from '@sentre/senhub'

export const useMetaFlex = () => {
  const metaFlex = useMemo(() => {
    return new Metaplex(connection)
  }, [])
  return metaFlex
}
