import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'model/devTools'

import main from 'model/main.controller'
import recipients from 'model/recipients.controller'
import distributors from 'model/distributor.controller'
import pools from 'model/pool.controller'
import cheques from 'model/cheque.controller'
import receipts from 'model/receipt.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools(process.env.REACT_APP_ID as string),
  reducer: {
    main,
    recipients,
    distributors,
    pools,
    cheques,
    receipts,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
