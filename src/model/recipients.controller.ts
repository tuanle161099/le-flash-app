import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type RecipientInfo = {
  mintAddress: string
  walletAddress: string
  chequeAddress?: string
}

export type RecipientState = RecipientInfo[]

/**
 * Store constructor
 */

const NAME = 'recipients'
const initialState: RecipientState = []
/**
 * Actions
 */

export const addRecipient = createAsyncThunk<
  RecipientState,
  { newRecipients: RecipientInfo[] },
  { state: any }
>(`${NAME}/addRecipient`, async ({ newRecipients }, { getState }) => {
  const { recipients } = getState()
  const nextRecipients = [...recipients]
  return [...nextRecipients, ...newRecipients]
})

export const removeRecipient = createAsyncThunk<
  RecipientState,
  { index: number },
  { state: any }
>(`${NAME}/removeRecipient`, async ({ index }, { getState }) => {
  const { recipients } = getState()
  const nextRecipients = [...recipients]
  nextRecipients.splice(index, 1)
  return [...nextRecipients]
})

export const setRecipient = createAsyncThunk(
  `${NAME}/setRecipient`,
  async (recipients: RecipientInfo[]) => {
    return recipients
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
        addRecipient.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        removeRecipient.fulfilled,
        (state, { payload }) => (state = payload),
      )
      .addCase(
        setRecipient.fulfilled,
        (state, { payload }) => (state = payload),
      ),
})

export default slice.reducer
