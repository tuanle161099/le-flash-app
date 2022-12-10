import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { util } from '@sentre/senhub'
import { PoolData } from 'lib'

export type PoolState = Record<string, PoolData>

const NAME = 'pool'
const initialState: PoolState = {}

/**
 * Actions
 */

export const initPools = createAsyncThunk(
  `${NAME}/initPools`,
  async (bulk: PoolState) => {
    return bulk
  },
)

export const upsetPool = createAsyncThunk<
  PoolState,
  { address: string; data: PoolData },
  { state: any }
>(`${NAME}/upsetPool`, async ({ address, data }) => {
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
        initPools.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
