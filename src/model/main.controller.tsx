import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type State = {
  collection: string
}

/**
 * Store constructor
 */

const NAME = 'main'
const initialState: State = {
  collection: '',
}

/**
 * Actions
 */

export const setCollection = createAsyncThunk(
  `${NAME}/setCollection`,
  async (collection: string) => {
    return { collection }
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
    void builder.addCase(
      setCollection.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
