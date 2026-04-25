import { SaveUserToken } from "@/axios/LocalStorageUtility";
import { createSlice } from "@reduxjs/toolkit";

interface User {
  name: string;
  _id: string;
  phone: string;
  institute: string;
}

interface UserIntialState {
  userDetails: User | null;
}
const intitalUserState: UserIntialState = {
  userDetails: null,
};
export const userDetails = createSlice({
  name: "userDetails",
  initialState: intitalUserState,
  reducers: {
    setUserDetails(
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
      state.userDetails = actions.payload;
    },
    saveToken(state, actions) {
      const token = actions.payload;
      SaveUserToken(token)
    },
  },
});
export const { setUserDetails , saveToken } = userDetails.actions;
export default userDetails.reducer;
