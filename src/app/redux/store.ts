import { configureStore } from "@reduxjs/toolkit";
import instituteDetails from "./slices/instituteSlice";
import adminDetails from "./slices/adminSlice";
import teacherDetails from "./slices/teacherSlice";
import studentDetails from "./slices/studentSlice";
import userDetails from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    instituteSlice: instituteDetails,
    adminSlice: adminDetails,
    userSlice:userDetails,
    teacherSlice: teacherDetails,
    studentSlice: studentDetails,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
