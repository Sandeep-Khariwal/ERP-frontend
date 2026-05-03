import { LogOut, SaveUserToken } from "@/axios/LocalStorageUtility";
import { createSlice } from "@reduxjs/toolkit";

export interface InstituteDetails {
  name: string;
  _id: string;
  phoneNumber: string;
  address: string;
  email?: string;
  featureAccess?: {
    financeManagement: boolean;
    aiChatBoat: boolean;
    transportManagement: boolean;
    onlineTestSchedule: boolean;
    feesReminderMessage: boolean;
  };
  gst?: {
    sgst: number;
    cgst: number;
  };
}

export interface instituteDetailsIntialState {
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
          email?: string;
          featureAccess?: {
            financeManagement: boolean;
            aiChatBoat: boolean;
            transportManagement: boolean;
            onlineTestSchedule: boolean;
            feesReminderMessage: boolean;
          };
          gst?: {
            sgst: number;
            cgst: number;
          };
        };
      },
    ) {
      state.instituteDetails = actions.payload;
    },
    saveToken(state, actions) {
      const token = actions.payload;
      SaveUserToken(token);
    },
  },
});
export const { setDetails, saveToken } = instituteDetails.actions;
export default instituteDetails.reducer;
