import { SaveUserToken } from "@/app/api/LocalStorageUtility";
import { createSlice } from "@reduxjs/toolkit";

interface Teacher {
  name: string;
  _id: string;
  phone: string;
  institute: string;
}

interface TeacherIntialState {
  teacherDetails: Teacher | null;
}
const intitalTeacherState: TeacherIntialState = {
    teacherDetails: null,
};
export const teacherDetails = createSlice({
  name: "teacherDetails",
  initialState: intitalTeacherState,
  reducers: {
    setTeacherDetails(
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
      state.teacherDetails = actions.payload;
    },
    saveToken(state, actions) {
      const token = actions.payload;
      SaveUserToken(token)
    },
  },
});
export const { setTeacherDetails , saveToken } = teacherDetails.actions;
export default teacherDetails.reducer;
