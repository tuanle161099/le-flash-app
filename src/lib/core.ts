import {
  web3,
  Program,
  utils,
  Address,
  AnchorProvider,
  BN,
} from '@project-serum/anchor'

import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token'
import { LeFlash } from './target/types/le_flash'
import { DEFAULT_LE_FLASH_IDL, FEE_OPTIONS } from './constant'
import { findNftMetadataAddress, findReceipt, isAddress, isHash } from './utils'
import {
  ChequeData,
  DistributorData,
  FeeOptions,
  PoolData,
  ReceiptData,
} from './types'
import { Leaf } from './merkleDistributor'

const PROGRAMS = {
  rent: web3.SYSVAR_RENT_PUBKEY,
  systemProgram: web3.SystemProgram.programId,
  associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
  tokenProgram: TOKEN_PROGRAM_ID,
}

class LeFlashProgram {
  readonly _provider: AnchorProvider
  readonly program: Program<LeFlash>
  constructor(provider: AnchorProvider, programId: string) {
    if (!isAddress(programId)) throw new Error('Invalid program id')
    // Private
    this._provider = provider
    // Public
    this.program = new Program<LeFlash>(
      DEFAULT_LE_FLASH_IDL,
      programId,
      this._provider,
    )
  }
  deriveTreasurerAddress = async (poolAddress: Address) => {
    if (typeof poolAddress !== 'string') poolAddress = poolAddress.toBase58()
    if (!isAddress(poolAddress)) throw new Error('Invalid pool address')
    const poolPublicKey = new web3.PublicKey(poolAddress)
    const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), poolPublicKey.toBuffer()],
      this.program.programId,
    )
    return treasurerPublicKey.toBase58()
  }

  /**
   * Derive my cheque address by proposal address and receipt's index.
   * @param proposalAddress Proposal address.
   * @param strict (Optional) if true, a validation process will activate to make sure the cheque is safe.
   * @returns cheque address.
   */
  deriveChequeAddress = async (
    poolAddress: string,
    strict: boolean = false,
  ) => {
    if (!isAddress(poolAddress)) throw new Error('Invalid proposal address')
    const poolPublicKey = new web3.PublicKey(poolAddress)
    const authorityPublicKey = this._provider.wallet.publicKey
    const [chequePubkey] = await await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('cheque'),
        poolPublicKey.toBuffer(),
        authorityPublicKey.toBuffer(),
      ],
      this.program.programId,
    )
    const chequeAddress = chequePubkey.toBase58()

    if (strict) {
      let onchainAuthorityAddress: string
      let onchainPoolAddress: string
      try {
        const { authority, pool } = await this.getChequeData(chequeAddress)
        onchainAuthorityAddress = authority.toBase58()
        onchainPoolAddress = pool.toBase58()
      } catch (er) {
        throw new Error(`This cheque ${chequeAddress} is not initialized yet`)
      }
      if (
        this._provider.wallet.publicKey.toBase58() !== onchainAuthorityAddress
      )
        throw new Error('Violated authority address')
      if (poolAddress !== onchainPoolAddress)
        throw new Error('Violated proposal address')
    }

    return chequeAddress
  }

  /**
   * Get pool data.
   * @param poolAddress Pool address.
   * @returns Pool readable data.
   */
  getPoolData = async (poolAddress: Address): Promise<PoolData> => {
    return this.program.account.pool.fetch(poolAddress) as any
  }
  /**
   * Get pool data.
   * @param chequeAddress Receipt address.
   * @returns Pool readable data.
   */
  getChequeData = async (chequeAddress: Address): Promise<ChequeData> => {
    return this.program.account.cheque.fetch(chequeAddress) as any
  }

  fetchCheques = async (): Promise<any> => {
    return this.program.account.cheque.all() as any
  }

  initializePool = async ({
    pool = web3.Keypair.generate(),
    mintLpt = web3.Keypair.generate(),
    sendAndConfirm = true,
    mint,
  }: {
    pool?: web3.Keypair
    mintLpt?: web3.Keypair
    sendAndConfirm?: boolean
    mint: web3.PublicKey
  }) => {
    const newPool = pool
    const poolAddress = newPool.publicKey.toBase58()
    const treasurer = await this.deriveTreasurerAddress(poolAddress)

    const tokenAccountLpt = await utils.token.associatedAddress({
      mint: new web3.PublicKey(mintLpt.publicKey),
      owner: new web3.PublicKey(this._provider.wallet.publicKey),
    })

    const treasury = await utils.token.associatedAddress({
      mint: new web3.PublicKey(mint),
      owner: new web3.PublicKey(treasurer),
    })

    const tx = await this.program.methods
      .initializePool(mint, treasury)
      .accounts({
        associatedTokenAccountLpt: tokenAccountLpt,
        authority: this._provider.wallet.publicKey,
        mintLpt: mintLpt.publicKey,
        pool: poolAddress,
        treasurer,
        ...PROGRAMS,
      })
      .transaction()

    let txId = ''
    if (sendAndConfirm) {
      this._provider.opts.skipPreflight = true
      txId = await this._provider.sendAndConfirm(tx, [newPool, mintLpt])
    }

    return { txId, poolAddress: newPool.publicKey.toBase58(), tx }
  }

  deposit = async ({
    recipient = this._provider.wallet.publicKey.toBase58(),
    poolAddress,
    sendAndConfirm = true,
    mintNFTAddress,
    chequeKeypair = web3.Keypair.generate(),
  }: {
    recipient?: string
    poolAddress: string
    sendAndConfirm?: boolean
    mintNFTAddress: string
    chequeKeypair?: web3.Keypair
  }) => {
    const chequePubkey = new web3.PublicKey(recipient)
    const { mintLpt } = await this.getPoolData(poolAddress)

    const treasurer = await this.deriveTreasurerAddress(poolAddress)
    const metadataAddress = await findNftMetadataAddress(
      new web3.PublicKey(mintNFTAddress),
    )
    const metadataPublicKey = metadataAddress.toBase58()
    const tokenAccountLpt = await utils.token.associatedAddress({
      mint: mintLpt,
      owner: new web3.PublicKey(this._provider.wallet.publicKey),
    })

    const srcAssociatedTokenAccount = await utils.token.associatedAddress({
      mint: new web3.PublicKey(mintNFTAddress),
      owner: new web3.PublicKey(this._provider.wallet.publicKey),
    })
    const treasury = await utils.token.associatedAddress({
      mint: new web3.PublicKey(mintNFTAddress),
      owner: new web3.PublicKey(treasurer),
    })
    const chequePublicKey = chequeKeypair.publicKey.toBase58()

    let tx = await this.program.methods
      .deposit(chequePubkey)
      .accounts({
        authority: this._provider.wallet.publicKey,
        pool: poolAddress,
        associatedTokenAccountLpt: tokenAccountLpt,
        mint: mintNFTAddress,
        mintLpt,
        srcAssociatedTokenAccount,
        treasurer,
        treasury,
        cheque: chequePublicKey,
        metadata: metadataPublicKey,
        ...PROGRAMS,
      })
      .transaction()

    let txId = ''
    if (sendAndConfirm) {
      this._provider.opts.skipPreflight = true
      txId = await this._provider.sendAndConfirm(tx, [chequeKeypair])
    }
    return { txId, tx, chequeAddress: chequeKeypair.publicKey.toBase58() }
  }

  withdrawNFT = async ({
    chequeAddress,
    sendAndConfirm = true,
  }: {
    chequeAddress: Address
    sendAndConfirm?: boolean
  }) => {
    const { pool, mint: mintNFT } = await this.getChequeData(chequeAddress)
    const { mintLpt } = await this.getPoolData(pool)
    const treasurer = await this.deriveTreasurerAddress(pool)

    const metadataAddress = await findNftMetadataAddress(
      new web3.PublicKey(mintNFT),
    )
    const metadataPublicKey = metadataAddress.toBase58()

    const tokenAccountLpt = await utils.token.associatedAddress({
      mint: mintLpt,
      owner: new web3.PublicKey(this._provider.wallet.publicKey),
    })

    const dstAssociatedTokenAccount = await utils.token.associatedAddress({
      mint: mintNFT,
      owner: new web3.PublicKey(this._provider.wallet.publicKey),
    })

    const treasury = await utils.token.associatedAddress({
      mint: new web3.PublicKey(mintNFT),
      owner: new web3.PublicKey(treasurer),
    })

    let tx = await this.program.methods
      .withdrawNft()
      .accounts({
        authority: this._provider.wallet.publicKey,
        pool,
        associatedTokenAccountLpt: tokenAccountLpt,
        mint: mintNFT,
        mintLpt,
        dstAssociatedTokenAccount,
        treasurer,
        treasury,
        metadata: metadataPublicKey,
        cheque: chequeAddress,
        ...PROGRAMS,
      })
      .transaction()

    let txId = ''
    if (sendAndConfirm) {
      txId = await this._provider.sendAndConfirm(tx, [])
    }
    return { txId, tx }
  }

  closeCheque = async ({
    chequeAddress,
    sendAndConfirm = true,
  }: {
    chequeAddress: string
    sendAndConfirm?: boolean
  }) => {
    const chequePubkey = new web3.PublicKey(chequeAddress)
    const tx = await this.program.methods
      .closeCheque()
      .accounts({
        authority: this._provider.wallet.publicKey,
        cheque: chequePubkey,
        ...PROGRAMS,
      })
      .transaction()
    let txId = ''
    if (sendAndConfirm) {
      txId = await this._provider.sendAndConfirm(tx, [])
    }
    return { txId, tx }
  }

  /**
   * Parse distributor buffer data.
   * @param data Distributor buffer data.
   * @returns Distributor readable data.
   */
  parseDistributorData = (data: Buffer): DistributorData => {
    return this.program.coder.accounts.decode('distributor', data)
  }

  /**
   * Get distributor data.
   * @param distributorAddress Distributor address.
   * @returns Distributor readable data.
   */
  getDistributorData = async (
    distributorAddress: string,
  ): Promise<DistributorData> => {
    return this.program.account.distributor.fetch(distributorAddress) as any
  }

  /**
   * Parse receipt buffer data.
   * @param data Receipt buffer data.
   * @returns Receipt readable data.
   */
  parseReceiptData = (data: Buffer): ReceiptData => {
    return this.program.coder.accounts.decode('receipt', data)
  }

  /**
   * Get receipt data.
   * @param receiptAddress Receipt address.
   * @returns Receipt readable data.
   */
  getReceiptData = async (receiptAddress: string): Promise<ReceiptData> => {
    return this.program.account.receipt.fetch(receiptAddress) as any
  }

  /**
   * Derive my receipt address by distributor address, and salt.
   * @param salt Buffer.
   * @param distributorAddress Distributor address.
   * @param strict (Optional) if true, a validation process will activate to make sure the receipt is safe.
   * @returns Receipt address.
   */
  deriveReceiptAddress = async (
    salt: Buffer,
    distributorAddress: string,
    strict: boolean = false,
  ) => {
    if (salt.length !== 32) throw new Error('The salt must has length 32')
    if (!isAddress(distributorAddress))
      throw new Error('Invalid distributor address')

    const receiptPublicKey = await findReceipt(
      salt,
      new web3.PublicKey(distributorAddress),
      this._provider.wallet.publicKey,
      this.program.programId,
    )
    const receiptAddress = receiptPublicKey.toBase58()

    if (strict) {
      let onchainAuthorityAddress: string
      let onchainDistributorAddress: string
      let onchainSalt: Buffer
      try {
        const { authority, distributor, salt } = await this.getReceiptData(
          receiptAddress,
        )
        onchainAuthorityAddress = authority.toBase58()
        onchainDistributorAddress = distributor.toBase58()
        onchainSalt = Buffer.from(salt)
      } catch (er) {
        throw new Error(`This receipt ${receiptAddress} is not initialized yet`)
      }
      if (
        this._provider.wallet.publicKey.toBase58() !== onchainAuthorityAddress
      )
        throw new Error('Violated authority address')
      if (distributorAddress !== onchainDistributorAddress)
        throw new Error('Violated proposal address')
      if (salt.compare(onchainSalt) !== 0) throw new Error('Violated salt')
    }

    return receiptAddress
  }

  /**
   * Derive treasurer address of a distributor.
   * @param distributorAddress Distributor address.
   * @returns Treasurer address that holds the secure token treasuries of the distributor.
   */
  deriveDistributorTreasurerAddress = async (distributorAddress: string) => {
    if (!isAddress(distributorAddress))
      throw new Error('Invalid distributor address')
    const distributorPublicKey = new web3.PublicKey(distributorAddress)
    const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), distributorPublicKey.toBuffer()],
      this.program.programId,
    )
    return treasurerPublicKey.toBase58()
  }

  /**
   * Initialize a merkle distributor.
   * @param tokenAddress Distributed token address.
   * @param total The total number of tokens that will be distributed out to the community.
   * @param merkleRoot Root of the merkle tree.
   * @param metadata The representation that link to the recipient data. For example: CID on IPFS.
   * @param endedAt (Optional) (In seconds) Due date for the distributor, after that the distributor owner can revoke the remaining tokens. Default: 0 - no due date.
   * @param distributor (Optional) The distributor keypair. If it's not provided, a new one will be auto generated.
   * @param feeOptions (Optional) Protocol fee.
   * @param sendAndConfirm (Optional) Send and confirm the transaction immediately.
   * @returns { tx, txId, distributorAddress }
   */
  initializeDistributor = async ({
    tokenAddress,
    total,
    merkleRoot,
    metadata,
    startedAt = 0,
    endedAt = 0,
    distributor = web3.Keypair.generate(),
    feeOptions = FEE_OPTIONS(this._provider.wallet.publicKey.toBase58()),
    sendAndConfirm = true,
  }: {
    tokenAddress: string
    total: BN
    merkleRoot: any
    metadata: any
    startedAt?: number
    endedAt?: number
    distributor?: web3.Keypair
    feeOptions?: FeeOptions
    sendAndConfirm?: boolean
  }) => {
    const { fee, feeCollectorAddress } = feeOptions
    if (!isAddress(feeCollectorAddress))
      throw new Error('Invalid fee collector address')
    if (!isAddress(tokenAddress)) throw new Error('Invalid token address')
    if (!isHash(merkleRoot)) throw new Error('Invalid merkle root')
    if (total.isNeg()) throw new Error('The total must not be negative')
    if (metadata.length !== 32) throw new Error('Invalid metadata path')

    const distributorAddress = distributor.publicKey.toBase58()
    const tokenPublicKey = new web3.PublicKey(tokenAddress)
    const srcPublicKey = await utils.token.associatedAddress({
      mint: tokenPublicKey,
      owner: this._provider.wallet.publicKey,
    })
    const treasurerAddress = await this.deriveDistributorTreasurerAddress(
      distributorAddress,
    )
    const treasurerPublicKey = new web3.PublicKey(treasurerAddress)
    const treasuryPublicKey = await utils.token.associatedAddress({
      mint: tokenPublicKey,
      owner: treasurerPublicKey,
    })

    const builder = await this.program.methods
      .initializeDistributor(
        [...merkleRoot],
        total,
        new BN(endedAt),
        new BN(startedAt),
        [...metadata],
        fee,
      )
      .accounts({
        authority: this._provider.wallet.publicKey,
        distributor: distributor.publicKey,
        src: srcPublicKey,
        treasurer: treasurerPublicKey,
        treasury: treasuryPublicKey,
        feeCollector: new web3.PublicKey(feeCollectorAddress),
        mint: tokenPublicKey,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([distributor])
    const tx = await builder.transaction()
    const txId = sendAndConfirm
      ? await builder.rpc({ commitment: 'confirmed' })
      : ''

    return { tx, txId, distributorAddress }
  }

  /**
   * Claim a distribution.
   * @param distributorAddress The distributor address.
   * @param proof Merkle proof.
   * @param data Receipient data.
   * @param feeOptions (Optional) Protocol fee.
   * @param sendAndConfirm (Optional) Send and confirm the transaction immediately.
   * @returns { tx, txId, dstAddress }
   */
  claim = async ({
    distributorAddress,
    proof,
    data,
    feeOptions = FEE_OPTIONS(this._provider.wallet.publicKey.toBase58()),
    sendAndConfirm = true,
    mintAddress,
  }: {
    distributorAddress: string
    proof: Array<Buffer>
    data: Leaf
    feeOptions?: FeeOptions
    sendAndConfirm?: boolean
    mintAddress: string
  }) => {
    const { fee, feeCollectorAddress } = feeOptions
    if (!isAddress(feeCollectorAddress))
      throw new Error('Invalid fee collector address')
    if (!isAddress(distributorAddress))
      throw new Error('Invalid distributor address')
    if (!this._provider.wallet.publicKey.equals(data.authority))
      throw new Error('Invalid athority address')
    const mintPub = new web3.PublicKey(mintAddress)

    const { mint: tokenPublicKey } = await this.getDistributorData(
      distributorAddress,
    )
    const receiptAddress = await this.deriveReceiptAddress(
      data.salt,
      distributorAddress,
    )
    const dstPublicKey = await utils.token.associatedAddress({
      mint: tokenPublicKey,
      owner: this._provider.wallet.publicKey,
    })
    const treasurerAddress = await this.deriveDistributorTreasurerAddress(
      distributorAddress,
    )
    const treasurerPublicKey = new web3.PublicKey(treasurerAddress)
    const treasuryPublicKey = await utils.token.associatedAddress({
      mint: tokenPublicKey,
      owner: treasurerPublicKey,
    })

    const builder = await this.program.methods
      .claim(
        proof.map((e) => e.toJSON().data),
        new BN(1),
        data.startedAt,
        data.salt.toJSON().data,
        fee,
        data.chequeAddress,
        mintPub,
      )
      .accounts({
        authority: this._provider.wallet.publicKey,
        distributor: new web3.PublicKey(distributorAddress),
        receipt: new web3.PublicKey(receiptAddress),
        dst: dstPublicKey,
        treasurer: treasurerPublicKey,
        treasury: treasuryPublicKey,
        feeCollector: new web3.PublicKey(feeCollectorAddress),
        mint: tokenPublicKey,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
    const tx = await builder.transaction()
    const txId = sendAndConfirm
      ? await builder.rpc({ commitment: 'confirmed' })
      : ''

    return { tx, txId, dstAddress: dstPublicKey.toBase58() }
  }
}

export default LeFlashProgram
