export interface AdmitCardPrintData {
  instituteName?: string;
  instituteLogo?: string;
  instituteAddress?: string;
  institutePhone?: string;
  instituteEmail?: string;
  principalSignature?: string;

  examName: string;
  session: string;

  studentName: string;
  rollNumber: string;
  enrollmentNo?: string;
  batchName: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  studentPhoto?: string;

  schedules: {
    subjectName: string;
    subjectCode?: string;
    examDate: string;
    examTime: string;
    subjectType?: string;
  }[];
}

export const generateAdmitCardHtml = (data: AdmitCardPrintData): string => {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Admit Card - ${data.studentName}</title>
<style>
@page {
  size: A4 portrait;
  margin: 8mm;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman', Times, serif;
  background: #fff;
  color: #111;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
}

.admit-card-wrapper {
  width: 100%;
  border: 2px solid #1a365d;
  padding: 14px 18px;
  background: #fff;
  position: relative;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #1a365d;
  padding-bottom: 10px;
}

.school-title {
  font-size: 24px;
  font-weight: 800;
  text-transform: uppercase;
  color: #1a365d;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.sub-text {
  font-size: 11px;
  color: #333;
  margin-top: 3px;
}

.badge-title {
  background: #1a365d;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 5px 20px;
  display: inline-block;
  border-radius: 4px;
  margin-top: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #2d3748;
  padding: 6px 8px;
  font-size: 11.5px;
}

.table-bordered th {
  background-color: #f1f5f9;
  text-transform: uppercase;
  font-weight: bold;
  color: #1a202c;
}

.instructions-box {
  margin-top: 14px;
  border: 1px dashed #4a5568;
  padding: 8px 12px;
  font-size: 10.5px;
  line-height: 1.45;
  background-color: #fafbfc;
}

.sign-box {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 11px;
  font-weight: bold;
}
</style>
</head>
<body>

<div class="admit-card-wrapper">
  <!-- HEADER -->
  <div class="header-container">
    <div style="width: 80px; height: 80px; text-align: center; flex-shrink: 0;">
      ${
        data.instituteLogo
          ? `<img src="${data.instituteLogo}" crossorigin="anonymous" style="width: 80px; height: 80px; object-fit: contain;" />`
          : `<div style="width: 75px; height: 75px; border: 1px dashed #999; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px;">LOGO</div>`
      }
    </div>

    <div style="flex: 1; text-align: center; padding: 0 12px;">
      <div class="school-title">${data.instituteName || "INSTITUTION NAME"}</div>
      <div class="sub-text">${data.instituteAddress || ""}</div>
      ${data.institutePhone ? `<div class="sub-text">Phone: ${data.institutePhone} </div>` : ""}
      <div class="badge-title">HALL TICKET / ADMIT CARD</div>
      <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">
        ${data.examName.toUpperCase()} &bull; SESSION: ${data.session || "2026-2027"}
      </div>
    </div>

    <!-- STUDENT PHOTO -->
    <div style="width: 85px; height: 95px; border: 1px solid #1a365d; text-align: center; padding: 2px; flex-shrink: 0; background: #fff;">
      ${
        data.studentPhoto
          ? `<img src="${data.studentPhoto}" crossorigin="anonymous" style="width: 100%; height: 100%; object-fit: cover;" />`
          : `<div style="height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777;">STUDENT PHOTO</div>`
      }
    </div>
  </div>

  <!-- CANDIDATE DETAILS -->
  <div style="font-size: 12px; font-weight: bold; text-decoration: underline; margin: 10px 0 6px 0; color: #1a365d;">
    CANDIDATE DETAILS:
  </div>

  <table class="table-bordered" style="margin-bottom: 12px;">
    <tr>
      <td style="width: 18%; font-weight: bold; background: #f8fafc;">Student Name:</td>
      <td style="width: 32%; font-weight: bold; text-transform: uppercase;">${data.studentName}</td>
      <td style="width: 18%; font-weight: bold; background: #f8fafc;">Roll Number:</td>
      <td style="width: 32%; font-weight: bold; color: #1a365d; font-size: 13px;">${data.rollNumber}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; background: #f8fafc;">Class / Batch:</td>
      <td>${data.batchName}</td>
      <td style="font-weight: bold; background: #f8fafc;">Date of Birth:</td>
      <td>${data.dob || "-"}</td>
   
    </tr>
    <tr>
      <td style="font-weight: bold; background: #f8fafc;">Father's Name:</td>
      <td style="text-transform: uppercase;">${data.fatherName || "-"}</td>
      <td style="font-weight: bold; background: #f8fafc;">Mother's Name:</td>
      <td style="text-transform: uppercase;">${data.motherName || "-"}</td>
    </tr>
   
  </table>

  <!-- EXAMINATION SCHEDULE -->
  <div style="font-size: 12px; font-weight: bold; text-decoration: underline; margin: 10px 0 6px 0; color: #1a365d;">
    EXAMINATION SCHEDULE:
  </div>

  <table class="table-bordered" style="text-align: center; margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="width: 8%;">S.No</th>
        <th style="width: 16%;">Subject Code</th>
        <th style="width: 32%; text-align: left; padding-left: 10px;">Subject Name</th>
        <th style="width: 22%;">Exam Date</th>
        <th style="width: 22%;">Exam Timing</th>
      </tr>
    </thead>
    <tbody>
      ${data.schedules
        .map(
          (sub, i) => `
        <tr>
          <td>${i + 1}</td>
          <td style="font-weight: bold;">${sub.subjectCode || "-"}</td>
          <td style="text-align: left; padding-left: 10px; font-weight: bold;">
            ${sub.subjectName}
            ${sub.subjectType ? `<span style="font-size: 9px; font-weight: normal; color: #555;"> (${sub.subjectType})</span>` : ""}
          </td>
          <td>${sub.examDate || "-"}</td>
          <td>${sub.examTime || "-"}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <!-- INSTRUCTIONS -->
  <div class="instructions-box">
    <div style="font-weight: bold; text-decoration: underline; margin-bottom: 4px;">IMPORTANT INSTRUCTIONS:</div>
    <ol style="margin: 0; padding-left: 18px;">
      <li>Candidate must carry this Admit Card along with School ID proof to enter the examination hall.</li>
      <li>Entry will not be permitted after 15 minutes of the examination start time.</li>
      <li>Electronic gadgets, mobile phones, smartwatches, or cheat sheets are strictly prohibited.</li>
      <li>Check question paper code and fill your roll number carefully on the answer sheet.</li>
    </ol>
  </div>

  <!-- SIGNATURE SECTION -->
  <div class="sign-box">
    <div style="text-align: center; width: 180px;">
      <div style="height: 35px; border-bottom: 1px solid #444;"></div>
      <div style="margin-top: 4px;">Candidate's Signature</div>
    </div>

    <div style="text-align: center; width: 180px;">
      <div style="height: 35px; border-bottom: 1px solid #444;"></div>
      <div style="margin-top: 4px;">Invigilator's Signature</div>
    </div>

    <div style="text-align: center; width: 200px;">
      <div style="height: 35px; display: flex; align-items: flex-end; justify-content: center;">
        ${
          data.principalSignature
            ? `<img src="${data.principalSignature}" crossorigin="anonymous" style="max-height: 35px; max-width: 140px; object-fit: contain;" />`
            : ""
        }
      </div>
      <div style="border-top: 1px solid #444; margin-top: 4px; padding-top: 2px;">
        Controller of Exams / Principal
      </div>
    </div>
  </div>
</div>

</body>
</html>`;
};