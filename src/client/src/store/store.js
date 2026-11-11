import { configureStore } from '@reduxjs/toolkit'
import appReducer from './appSlice'

// created the single Redux store used by the patient dashboard and auth flows
export const store = configureStore({
  reducer: {
    app: appReducer,
  },
})
