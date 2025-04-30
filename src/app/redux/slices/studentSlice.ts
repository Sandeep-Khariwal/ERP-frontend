import { SaveUserToken } from "@/axios/LocalStorageUtility";
import { createSlice } from "@reduxjs/toolkit";

interface Student {
  name: string;
  _id: string;
  phone: string;
  institute: string;
}

interface StudentIntialState {
    studentDetails: Student | null;
}
const intitalStudentState: StudentIntialState = {
    studentDetails: null,
};
export const studentDetails = createSlice({
  name: "studentDetails",
  initialState: intitalStudentState,
  reducers: {
    setStudentDetails(
      state,
      actions: {
        payload: {
          name: string;
          _id: string;
          phone: string;
          institute: string;
        };
      }
    ) {
      state.studentDetails = actions.payload;
    },
    saveToken(state, actions) {
      const token = actions.payload;
      SaveUserToken(token)
    },
  },
});
export const { setStudentDetails , saveToken } = studentDetails.actions;
export default studentDetails.reducer;
