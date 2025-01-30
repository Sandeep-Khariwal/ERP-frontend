import { configureStore } from '@reduxjs/toolkit'
import instituteDetails  from './instituteSlice'
import adminDetails  from './adminSlice'

export const store = configureStore({
  reducer: {
    instituteSlice: instituteDetails,
    adminSlice: adminDetails
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch