"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/redux/redux.hooks";
import { setDetails } from "@/app/redux/slices/instituteSlice";
import { setTeacherDetails } from "@/app/redux/slices/teacherSlice";
import { GetAccountByToken } from "@/axios/institute/instituteSlice";
import { LocalStorageKey } from "@/axios/LocalStorageUtility";

/**
 * SessionRestore
 *
 * Jab bhi app load ho (refresh, ya naya tab), Redux store khaali hota hai
 * (memory reset ho jaati hai) — lekin localStorage me token/id bache rehte hain.
 *
 * Ye component page load hote hi:
 * 1. localStorage me token check karta hai
 * 2. Agar token hai -> institute ka data GetAccountByToken() se wapas laata hai
 *    (institute ke liye ID ki zaroorat nahi, token hi kaafi hai)
 * 3. Agar userType === "teacher" hai aur teacherId localStorage me hai
 *    -> teacher ka data GET /api/v1/teacher/:id se wapas laata hai
 * 4. Dono ko Redux me wapas dispatch kar deta hai
 *
 * Isse har page pe, chahe refresh ho ya naya tab, data automatically restore
 * ho jaata hai — manual navigation ki zaroorat nahi padti.
 */
export default function SessionRestore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(LocalStorageKey.Token);

    // Koi token hi nahi hai -> user login nahi hai, kuch mat karo
    if (!token) return;

    // ---- Restore both institute AND teacher from ONE call ----
    // GetAccountByToken() already returns the logged-in user's full data
    // (works for admin/teacher/student — the `type` field tells us which),
    // with `instituteId` populated as a full object, not just an ID.
    GetAccountByToken()
      .then((x: any) => {
        const data = x?.data;
        if (!data) return;

        // Institute is nested under `instituteId`, not `institute`.
        if (data.instituteId) {
          const instituteDetails = {
            name: data.instituteId.name,
            _id: data.instituteId._id,
            phoneNumber: data.instituteId.institutePhoneNumber || "",
            address: data.instituteId.address,
            featureAccess: data.instituteId.accessFeatures,
            email: data.instituteId.email,
          };
          dispatch(setDetails(instituteDetails));
        }

        // If the logged-in account is a teacher, this same response
        // already has all the teacher fields we need — no second API call.
        if (x?.type === "teacher") {
          dispatch(
            setTeacherDetails({
              name: data.name,
              _id: data._id,
              phone: data.phoneNumber?.[0] || "",
              institute: data.instituteId?._id || "",
            })
          );
        }
      })
      .catch((error: any) => {
        // Token expired/invalid ho sakta hai — ApiHelper ka 401 interceptor
        // already LogOut() call kar dega, isliye yaha sirf log karo.
        console.log("SESSION RESTORE ERROR :", error?.response || error);
      });
  }, [dispatch]);

  // Ye component kuch render nahi karta — sirf background me kaam karta hai
  return null;
}