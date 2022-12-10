import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { util } from '@sentre/senhub'
import { DistributorData } from 'lib'

export type DistributorState = Record<string, DistributorData>

const NAME = 'distributor'
const initialState: DistributorState = {}

/**
 * Actions
 */

export const initDistributors = createAsyncThunk(
  `${NAME}/initDistributors`,
  async (bulk: DistributorState) => {
    return bulk
  },
)

export const upsetDistributor = createAsyncThunk<
  DistributorState,
  { address: string; data: DistributorData },
  { state: any }
>(`${NAME}/upsetDistributor`, async ({ address, data }) => {
  if (!util.isAddress(address)) throw new Error('Invalid farm address')
  if (!data) throw new Error('Data is empty')
  return { [address]: data }
})

export const getFarm = createAsyncThunk<
  DistributorState,
  { address: string },
  { state: any }
>(`${NAME}/getFarm`, async ({ address }, { getState }) => {
  const {
    farms: { [address]: data },
  } = getState()
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
        initDistributors.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        upsetDistributor.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
