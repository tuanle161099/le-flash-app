import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { util } from '@sentre/senhub'
import { ChequeData } from 'lib'

export type ChequeState = Record<string, ChequeData>

const NAME = 'cheque'
const initialState: ChequeState = {}

/**
 * Actions
 */

export const initCheques = createAsyncThunk(
  `${NAME}/initCheques`,
  async (bulk: ChequeState) => {
    return bulk
  },
)

export const upsetCheque = createAsyncThunk<
  ChequeState,
  { address: string; data: ChequeData },
  { state: any }
>(`${NAME}/upsetCheque`, async ({ address, data }) => {
  if (!util.isAddress(address)) throw new Error('Invalid farm address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const removeCheque = createAsyncThunk(
  `${NAME}/removeCheque`,
  async (address: string) => {
    if (!util.isAddress(address)) throw new Error('Invalid farm address')
    return address
  },
)

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
        initCheques.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetCheque.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeCheque.fulfilled,
        (state, { payload }) => void delete state[payload],
      ),
})

export default slice.reducer
