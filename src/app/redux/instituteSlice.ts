import { createSlice } from "@reduxjs/toolkit";
import { SaveUserToken } from "../api/LocalStorageUtility";

interface InstituteDetails {
  name: string;
  _id: string;
  phoneNumber: string;
  address: string;
}

interface instituteDetailsIntialState {
  instituteDetails: InstituteDetails | null;
}
const intitalproductState: instituteDetailsIntialState = {
  instituteDetails: null,
};
export const instituteDetails = createSlice({
  name: "instituteDetails",
  initialState: intitalproductState,
  reducers: {
    setDetails(
      state,
      actions: {
        payload: {
          name: string;
          _id: string;
          phoneNumber: string;
          address: string;
        };
      }
    ) {
      state.instituteDetails = actions.payload;
    },
    saveToken(state, actions) {
      const token = actions.payload;
      SaveUserToken(token)
    },
  },
});
export const { setDetails , saveToken } = instituteDetails.actions;
export default instituteDetails.reducer;
