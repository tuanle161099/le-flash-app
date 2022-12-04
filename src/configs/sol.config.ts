import { Net } from '@sentre/senhub'

/**
 * Contructor
 */
type Conf = {
  node: string
  leFlashId: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    leFlashId: '3E8eFwLQhHgtzqAnestzG7SeZUWYH7BZLf8m9EGa8wJH',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    leFlashId: '3E8eFwLQhHgtzqAnestzG7SeZUWYH7BZLf8m9EGa8wJH',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://api.mainnet-beta.solana.com',
    leFlashId: '3E8eFwLQhHgtzqAnestzG7SeZUWYH7BZLf8m9EGa8wJH',
  },
}

/**
 * Module exports
 */
export default conf
