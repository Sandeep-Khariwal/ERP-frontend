import ApiHelper from "../../ApiHelper";

// ───────────────── NOTES ─────────────────

export function DeleteNotes(id: string,batchId:string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/batch/notes/${id}/${batchId}`
    )
      .then((response) => {
        console.log("DELETE NOTES SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("DELETE NOTES ERROR :", error?.response);
        reject(error);
      });
  });
}

// ───────────────── GALLERY ─────────────────

export function DeleteGallery(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/batch/gallery/${id}`
    )
      .then((response) => {
        console.log("DELETE GALLERY SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("DELETE GALLERY ERROR :", error?.response);
        reject(error);
      });
  });
}

// ───────────────── EXAMINATION ─────────────────

export function DeleteExamination(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/batch/examination/${id}`
    )
      .then((response) => {
        console.log("DELETE EXAMINATION SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("DELETE EXAMINATION ERROR :", error?.response);
        reject(error);
      });
  });
}

// ───────────────── TIMETABLE ─────────────────

export function DeleteTimeTable(id: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.delete(
      `${process.env.URL}/api/v1/batch/timeTable/${id}`
    )
      .then((response) => {
        console.log("DELETE TIMETABLE SUCCESS :", response);
        resolve(response);
      })
      .catch((error: any) => {
        console.log("DELETE TIMETABLE ERROR :", error?.response);
        reject(error);
      });
  });
}