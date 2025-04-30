import { LogOut, SaveUserToken } from "@/axios/LocalStorageUtility";
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
    TeacherLogOut(state, actions) {
      LogOut()
    },
  },
});
export const { setTeacherDetails , saveToken, TeacherLogOut } = teacherDetails.actions;
export default teacherDetails.reducer;
