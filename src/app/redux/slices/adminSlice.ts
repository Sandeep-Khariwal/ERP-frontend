import { SaveUserToken } from "@/axios/LocalStorageUtility";
import { createSlice } from "@reduxjs/toolkit";

interface Admin {
  name: string;
  _id: string;
  phone: string;
  institute: string;
}

interface AdminIntialState {
  adminDetails: Admin | null;
}
const intitalAdminState: AdminIntialState = {
  adminDetails: null,
};
export const adminDetails = createSlice({
  name: "adminDetails",
  initialState: intitalAdminState,
  reducers: {
    setAdminDetails(
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
      state.adminDetails = actions.payload;
    },
    saveToken(state, actions) {
      const token = actions.payload;
      SaveUserToken(token)
    },
  },
});
export const { setAdminDetails, saveToken } = adminDetails.actions;
export default adminDetails.reducer;
