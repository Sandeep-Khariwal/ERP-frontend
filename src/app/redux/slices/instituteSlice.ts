// import { LogOut, SaveUserToken } from "@/axios/LocalStorageUtility";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface InstituteDetails {
//   name: string;
//   _id: string;
//   phoneNumber: string;
//   address: string;
//   email?: string;
//    logo?: string;
//   featureAccess?: {
//     financeManagement: boolean;
//     aiChatBoat: boolean;
//     transportManagement: boolean;
//     onlineTestSchedule: boolean;
//     feesReminderMessage: boolean;
//   };
//   gst?: {
//     sgst: number;
//     cgst: number;
//   };
//   isAcadmy?:boolean
// }

// export interface instituteDetailsIntialState {
//   instituteDetails: InstituteDetails | null;
// }
// const intitalproductState: instituteDetailsIntialState = {
//   instituteDetails: null,
// };
// export const instituteDetails = createSlice({
//   name: "instituteDetails",
//   initialState: intitalproductState,
//   reducers: {
//     setDetails(
//       state,
//       actions: {
//         payload: {
//           name: string;
//           _id: string;
//           phoneNumber: string;
//           address: string;
//           email?: string;
//           featureAccess?: {
//             financeManagement: boolean;
//             aiChatBoat: boolean;
//             transportManagement: boolean;
//             onlineTestSchedule: boolean;
//             feesReminderMessage: boolean;
//           };
//           gst?: {
//             sgst: number;
//             cgst: number;
//           };
//           isAcadmy?:boolean
//         };
//       },
//     ) {
//       console.log("payloaaad : ",actions.payload);
      
//       state.instituteDetails = actions.payload;
//     },
//       setInstituteLogo(state, actions: PayloadAction<string | undefined>) {
//       if (state.instituteDetails) {
//         state.instituteDetails.logo = actions.payload;
//       }
//     },
//     saveToken(state, actions) {
//       const token = actions.payload;
//       SaveUserToken(token);
//     },
//   },
// });
// export const { setDetails,  setInstituteLogo, saveToken } = instituteDetails.actions;
// export default instituteDetails.reducer;


import { SaveUserToken } from "@/axios/LocalStorageUtility";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InstituteDetails {
  name: string;
  _id: string;
  phoneNumber: string;
  address: string;
  email?: string;
  logo?: string;

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
    number?: string;
    _id?: string;
  };

  isAcadmy?: boolean;
}

export interface InstituteDetailsInitialState {
  instituteDetails: InstituteDetails | null;
}

const initialState: InstituteDetailsInitialState = {
  instituteDetails: null,
};

export const instituteDetails = createSlice({
  name: "instituteDetails",
  initialState,

  reducers: {
    // Save complete institute details in Redux
    setDetails(
      state,
      action: PayloadAction<InstituteDetails>
    ) {
      console.log("Institute payload:", action.payload);

      state.instituteDetails = {
        ...action.payload,
        logo:
          action.payload.logo ??
          state.instituteDetails?.logo,
      };
      
      
      console.log(
        "Institute details saved in Redux:",
        state.instituteDetails
      );
    },

    // Update only institute logo URL
    setInstituteLogo(
      state,
      action: PayloadAction<string | undefined>
    ) {
      if (state.instituteDetails) {
        state.instituteDetails.logo = action.payload;

        console.log(
          "Redux Institute Logo URL:",
          state.instituteDetails.logo
        );
      } else {
        console.warn(
          "Institute details Redux mein available nahi hain."
        );
      }
    },

    // Save user token
    saveToken(state, action: PayloadAction<string>) {
      const token = action.payload;
      SaveUserToken(token);
    },
  },
});


export const {
  setDetails,
  setInstituteLogo,
  saveToken,
} = instituteDetails.actions;

export default instituteDetails.reducer;