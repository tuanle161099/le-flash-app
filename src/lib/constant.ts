import { IDL } from '../target/types/le_flash'
import { web3, BorshAccountsCoder, BN } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { FeeOptions } from './types'

export const DEFAULT_RPC_ENDPOINT = 'https://api.devnet.solana.com'
export const DEFAULT_SEN_UTILITY_PROGRAM_ID =
  '7oyG4wSf2kz2CxTqKTf1uhpPqrw9a8Av1w5t8Uj5PfXb'
export const DEFAULT_SEN_UTILITY_IDL = IDL

export const DISTRIBUTOR_DISCRIMINATOR = bs58.encode(
  BorshAccountsCoder.accountDiscriminator('distributor'),
)
export const RECEIPT_DISCRIMINATOR = bs58.encode(
  BorshAccountsCoder.accountDiscriminator('receipt'),
)
export const DEFAULT_LE_FLASH_IDL = IDL

export const FEE_OPTIONS = (
  walletAddress: string = new web3.Keypair().publicKey.toBase58(),
): FeeOptions => ({
  fee: new BN(0),
  feeCollectorAddress: walletAddress,
})
