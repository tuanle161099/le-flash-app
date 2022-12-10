import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { util } from '@sentre/senhub'
import { ReceiptData } from 'lib'

export type ReceiptState = Record<string, ReceiptData>

const NAME = 'receipt'
const initialState: ReceiptState = {}

/**
 * Actions
 */

export const initReceipts = createAsyncThunk(
  `${NAME}/initReceipts`,
  async (bulk: ReceiptState) => {
    return bulk
  },
)

export const upsetReceipt = createAsyncThunk<
  ReceiptState,
  { address: string; data: ReceiptData },
  { state: any }
>(`${NAME}/upsetReceipt`, async ({ address, data }) => {
  if (!util.isAddress(address)) throw new Error('Invalid farm address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        initReceipts.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetReceipt.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
