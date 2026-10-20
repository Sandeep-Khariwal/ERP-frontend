// =========================================================================================
// 1. MID-TERM MARKSHEET (Exact Match to Uploaded Image)
// =========================================================================================
export const generateMidTermMarksheet3 = (data: any) => {
  const getRemark = () => {
    if (data.status === "Fail") {
      return "Needs improvement. Work harder and try again.";
    }

    const percentage = Number(data.percentage);
    if (percentage >= 90) return "Outstanding performance! Keep shining.";
    if (percentage >= 75) return "Excellent performance! Keep up the good work.";
    if (percentage >= 60) return "Good job! You are doing well.";
    if (percentage >= 40) return "Satisfactory performance. Keep improving.";
    return "Needs improvement. Focus more on studies.";
  };

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {
  size: A4;
  margin: 6mm;
}

body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

table {
  border-collapse: collapse;
}
</style>
</head>

<body>

<!-- MAIN CONTAINER -->
<div style="
  width: 100%;
  border: 1.5px solid #222222;
  background: #ffffff;
  padding: 8px;
">

  <!-- TOP HEADER BOX (Red & Gold Framed Box) -->
  <div style="
    border: 2px solid #b8860b;
    border-radius: 4px;
    padding: 8px 10px;
    background: #fffdf9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  ">
    <!-- LEFT LOGO -->
    <div style="
      width: 78px;
      height: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    ">
      <img
        src="${data.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>

    <!-- CENTER SCHOOL INFO -->
    <div style="flex: 1; text-align: center; padding: 0 12px;">
      <div style="
        font-size: 26px;
        font-weight: bold;
        color: #b31b1b;
        font-family: 'Times New Roman', serif;
        letter-spacing: 0.5px;
        line-height: 1.15;
      ">
        ${data.instituteName}
      </div>

      <div style="
        font-size: 11px;
        color: #222222;
        margin-top: 3px;
        line-height: 1.35;
      ">
        ${data.instituteAdress || ""}
      </div>

      <div style="
        font-size: 11px;
        color: #222222;
        margin-top: 2px;
      ">
        Ph. No.: ${data.institutePhone || "N/A"}
      </div>

      <div style="
        font-size: 13px;
        font-weight: bold;
        color: #111111;
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">
        Report Card (${data.examName})
      </div>
    </div>

    <!-- RIGHT LOGO -->
    <div style="
      width: 78px;
      height: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    ">
      <img
        src="${data.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>
  </div>

  <!-- SESSION BAR -->
  <div style="
    text-align: right;
    font-size: 12px;
    font-weight: bold;
    color: #111111;
    margin: 5px 4px 6px 0;
  ">
    Session : ${data.session}
  </div>

  <!-- STUDENT PROFILE SECTION -->
  <div style="
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 4px 6px 4px;
    font-size: 12px;
  ">
    <!-- DETAILS (LEFT & MIDDLE) -->
    <div style="flex: 1; padding-right: 12px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 2.5px 0; font-weight: bold; width: 18%;">Student's Name</td>
          <td style="padding: 2.5px 4px; width: 2%;">:</td>
          <td style="padding: 2.5px 0; width: 33%; font-weight: bold;">${data.studentName}</td>

          <td style="padding: 2.5px 0; font-weight: bold; width: 16%;">Class</td>
          <td style="padding: 2.5px 4px; width: 2%;">:</td>
          <td style="padding: 2.5px 0; width: 29%; font-weight: bold;">${data.batchName}</td>
        </tr>

        <tr>
          <td style="padding: 2.5px 0; font-weight: bold;">Father's Name</td>
          <td style="padding: 2.5px 4px;">:</td>
          <td style="padding: 2.5px 0;">${data.fName}</td>

          <td style="padding: 2.5px 0; font-weight: bold;">Section</td>
          <td style="padding: 2.5px 4px;">:</td>
          <td style="padding: 2.5px 0;">${data.section || "A"}</td>
        </tr>

        <tr>
          <td style="padding: 2.5px 0; font-weight: bold;">Admission No.</td>
          <td style="padding: 2.5px 4px;">:</td>
          <td style="padding: 2.5px 0;">${data.enrolment || "-"}</td>

          <td style="padding: 2.5px 0; font-weight: bold;">Roll No</td>
          <td style="padding: 2.5px 4px;">:</td>
          <td style="padding: 2.5px 0;">${data.rollNumber}</td>
        </tr>

        <tr>
          <td style="padding: 2.5px 0; font-weight: bold;">D.O.B.</td>
          <td style="padding: 2.5px 4px;">:</td>
          <td style="padding: 2.5px 0;">${data.dob}</td>

          <td style="padding: 2.5px 0; font-weight: bold;">Mobile</td>
          <td style="padding: 2.5px 4px;">:</td>
          <td style="padding: 2.5px 0;">${data.parentNumber}</td>
        </tr>

        <tr>
          <td style="padding: 2.5px 0; font-weight: bold; vertical-align: top;">Address</td>
          <td style="padding: 2.5px 4px; vertical-align: top;">:</td>
          <td colspan="4" style="padding: 2.5px 0; line-height: 16px;">${data.address}</td>
        </tr>
      </table>
    </div>

    <!-- STUDENT PHOTO (RIGHT) -->
    <div style="
      width: 82px;
      height: 98px;
      border: 1px solid #333333;
      padding: 1px;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    ">
      <img
        src="${data.photo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </div>
  </div>

  <!-- SCHOLASTIC AREAS TITLE BANNER -->
  <div style="
    background: #dfe3f3;
    border: 1px solid #777777;
    border-bottom: none;
    text-align: center;
    font-size: 11.5px;
    font-weight: bold;
    padding: 3.5px 0;
    color: #111111;
    letter-spacing: 0.5px;
  ">
    SCHOLASTIC AREAS
  </div>

  <!-- SCHOLASTIC TABLE -->
  <table style="
    width: 100%;
    font-size: 10.5px;
    border: 1px solid #777777;
  ">
    <!-- HEADER -->
    <tr style="background: #eaedf7; font-weight: bold; text-align: center;">
      <th style="border: 1px solid #777777; padding: 4px; width: 22%; text-align: left;">
        Subjects
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 10%;">
        Periodic Test<br>(10)
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 9%;">
        Note Book<br>(5)
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 9%;">
        S.E.<br>(5)
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 9%;">
        Practical<br>(20)
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 9%;">
        Theory<br>(80)
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 9%;">
        Total<br>(100)
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 11%;">
        Obtained
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 6%;">
        Grade
      </th>
      <th style="border: 1px solid #777777; padding: 4px; width: 6%;">
        Result
      </th>
    </tr>

    <!-- ROWS -->
    ${data.marks
      .map(
        (m: any) => `
    <tr>
      <td style="border: 1px solid #777777; padding: 3.5px 6px; font-weight: bold;">
        ${m.subjectName}
      </td>
      <td style="border: 1px solid #777777; text-align: center;">${m.periodic_test}</td>
      <td style="border: 1px solid #777777; text-align: center;">${m.note_book}</td>
      <td style="border: 1px solid #777777; text-align: center;">${m.subject_enrichment}</td>
      <td style="border: 1px solid #777777; text-align: center;">${m.practical_marks}</td>
      <td style="border: 1px solid #777777; text-align: center;">${m.theory_marks}</td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">100</td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">${m.obtained_marks}</td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">${m.grade}</td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold; color: ${m.obtained_marks >= 33 ? "#006600" : "#cc0000"};">
        ${m.obtained_marks >= 33 ? "PASS" : "FAIL"}
      </td>
    </tr>
    `
      )
      .join("")}

    <!-- SUMMARY ROW -->
    <tr style="background: #fbfbfb; font-weight: bold;">
      <td colspan="7" style="border: 1px solid #777777; padding: 4px 6px; text-align: right;">
        Grand Total : ${data.totalMarks} / ${data.allsubjecttotal} &nbsp;&nbsp;|&nbsp;&nbsp; Percentage : ${Number(data.percentage).toFixed(2)}%
      </td>
      <td style="border: 1px solid #777777; text-align: center;">${data.totalMarks}</td>
      <td style="border: 1px solid #777777; text-align: center;">${data.overallGrade}</td>
      <td style="border: 1px solid #777777; text-align: center; color: ${data.status === "Pass" ? "#006600" : "#cc0000"};">
        ${data.status}
      </td>
    </tr>
  </table>

  <!-- CO-SCHOLASTIC AREAS -->
  <div style="
    background: #dfe3f3;
    border: 1px solid #777777;
    border-bottom: none;
    margin-top: 6px;
    font-size: 11px;
    font-weight: bold;
    padding: 3.5px 6px;
    color: #111111;
  ">
    Co-Scholastic Areas (on a 3-point / 5-point scale)
  </div>

  <table style="
    width: 100%;
    font-size: 10.5px;
    border: 1px solid #777777;
  ">
    <tr style="background: #eaedf7; font-weight: bold;">
      <th style="border: 1px solid #777777; padding: 3px 6px; text-align: left; width: 80%;">
        Activities & Skills
      </th>
      <th style="border: 1px solid #777777; padding: 3px; text-align: center; width: 20%;">
        Grade
      </th>
    </tr>

    ${data.activity
      ?.map(
        (item: any) => `
    <tr>
      <td style="border: 1px solid #777777; padding: 3px 6px; text-transform: uppercase;">
        ${item.subjectName}
      </td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
        ${item.grade}
      </td>
    </tr>
    `
      )
      .join("")}

    ${data.skills
      ?.map(
        (item: any) => `
    <tr>
      <td style="border: 1px solid #777777; padding: 3px 6px; text-transform: uppercase;">
        ${item.subjectName}
      </td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
        ${item.grade}
      </td>
    </tr>
    `
      )
      .join("")}
  </table>

  <!-- 8-POINT GRADE SCALE -->
  <div style="
    background: #dfe3f3;
    border: 1px solid #777777;
    border-bottom: none;
    margin-top: 6px;
    font-size: 10.5px;
    font-weight: bold;
    padding: 3px 6px;
    color: #111111;
  ">
    Grade Scale For Scholastic Areas (Grades are awarded on 8 Point grade scale as Follows)
  </div>

  <table style="
    width: 100%;
    font-size: 10px;
    border: 1px solid #777777;
    text-align: center;
  ">
    <tr style="background: #eaedf7;">
      <td style="border: 1px solid #777777; padding: 2px 4px; font-weight: bold; width: 16%;">Marks Range (%)</td>
      <td style="border: 1px solid #777777; padding: 2px;">91-100</td>
      <td style="border: 1px solid #777777; padding: 2px;">81-90</td>
      <td style="border: 1px solid #777777; padding: 2px;">71-80</td>
      <td style="border: 1px solid #777777; padding: 2px;">61-70</td>
      <td style="border: 1px solid #777777; padding: 2px;">51-60</td>
      <td style="border: 1px solid #777777; padding: 2px;">41-50</td>
      <td style="border: 1px solid #777777; padding: 2px;">33-40</td>
      <td style="border: 1px solid #777777; padding: 2px;">0-32</td>
    </tr>
    <tr>
      <td style="border: 1px solid #777777; padding: 2px 4px; font-weight: bold;">Grade</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">A1</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">A2</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">B1</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">B2</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">C1</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">C2</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">D</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">E</td>
    </tr>
  </table>

  <!-- REMARKS BOX -->
  <div style="
    margin-top: 6px;
    border: 1px solid #777777;
    padding: 6px 8px;
    font-size: 11px;
    background: #ffffff;
    line-height: 16px;
  ">
    <strong>Remarks:</strong> ${data.studentName}'s overall performance: ${getRemark()}
    <div style="margin-top: 3px; font-weight: bold; color: #111111;">
      Status : ${data.status} &nbsp;|&nbsp; Overall Grade : ${data.overallGrade}
    </div>
  </div>

  <!-- FOOTER & SIGNATURES -->
  <div style="
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 24px;
    padding: 0 10px 4px 10px;
  ">
    <!-- CLASS INCHARGE -->
    <div style="text-align: center; width: 140px;">
      <div style="height: 30px;"></div>
      <div style="
        border-top: 1px solid #222222;
        padding-top: 3px;
        font-size: 11px;
        font-weight: bold;
      ">
        Class Incharge
      </div>
    </div>

    <!-- DATE & QR / PARENT -->
    <div style="text-align: center; width: 140px;">
      <div style="font-size: 10.5px; font-weight: bold; margin-bottom: 2px;">
        Date : ${data.date}
      </div>
      <img
        src="${data.qr}"
        crossorigin="anonymous"
        style="
          width: 50px;
          height: 50px;
          object-fit: contain;
          margin-bottom: 2px;
        "
      />
      <div style="
        border-top: 1px solid #222222;
        padding-top: 3px;
        font-size: 11px;
        font-weight: bold;
      ">
        Parent
      </div>
    </div>

    <!-- PRINCIPAL SIGNATURE -->
    <div style="text-align: center; width: 150px;">
      <img
        src="${data.principalSignature}"
        crossorigin="anonymous"
        style="
          width: 130px;
          height: 40px;
          object-fit: contain;
          mix-blend-mode: multiply;
        "
      />
      <div style="
        border-top: 1px solid #222222;
        padding-top: 3px;
        font-size: 11px;
        font-weight: bold;
      ">
        Principal
      </div>
    </div>
  </div>

</div>

</body>
</html>
`;
};


// =========================================================================================
// 2. ANNUAL / COMBINED MARKSHEET (Matching Theme to Uploaded Image)
// =========================================================================================
export const generateAnnualMarksheet3 = (
  term1: any,
  term2: any
) => {
  const getRemark = () => {
    const percentage =
      (Number(term1.percentage) + Number(term2.percentage)) / 2;

    if (percentage >= 90) return "Outstanding performance! Keep shining.";
    if (percentage >= 75) return "Excellent performance! Keep up the good work.";
    if (percentage >= 60) return "Good job! You are doing well.";
    if (percentage >= 40) return "Satisfactory performance. Keep improving.";
    return "Needs improvement. Focus more on studies.";
  };

  const avgPercentage = (
    (Number(term1.percentage) + Number(term2.percentage)) / 2
  ).toFixed(2);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {
  size: A4;
  margin: 5mm;
}

body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

table {
  border-collapse: collapse;
}
</style>
</head>

<body>

<!-- MAIN CONTAINER -->
<div style="
  width: 100%;
  border: 1.5px solid #222222;
  background: #ffffff;
  padding: 6px;
">

  <!-- TOP HEADER BOX (Red & Gold Framed Box) -->
  <div style="
    border: 2px solid #b8860b;
    border-radius: 4px;
    padding: 6px 10px;
    background: #fffdf9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  ">
    <!-- LEFT LOGO -->
    <div style="
      width: 70px;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    ">
      <img
        src="${term1.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>

    <!-- CENTER SCHOOL INFO -->
    <div style="flex: 1; text-align: center; padding: 0 10px;">
      <div style="
        font-size: 24px;
        font-weight: bold;
        color: #b31b1b;
        font-family: 'Times New Roman', serif;
        letter-spacing: 0.5px;
        line-height: 1.15;
      ">
        ${term1.instituteName}
      </div>

      <div style="
        font-size: 10.5px;
        color: #222222;
        margin-top: 2px;
      ">
        ${term1.instituteAdress || ""}
      </div>

      <div style="
        font-size: 10.5px;
        color: #222222;
        margin-top: 1px;
      ">
        Ph. No.: ${term1.institutePhone || "N/A"}
      </div>

      <div style="
        font-size: 12.5px;
        font-weight: bold;
        color: #111111;
        margin-top: 3px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">
        Annual Report Card
      </div>
    </div>

    <!-- RIGHT LOGO -->
    <div style="
      width: 70px;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    ">
      <img
        src="${term1.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>
  </div>

  <!-- SESSION BAR -->
  <div style="
    text-align: right;
    font-size: 11.5px;
    font-weight: bold;
    color: #111111;
    margin: 4px 4px 5px 0;
  ">
    Session : ${term1.session}
  </div>

  <!-- STUDENT PROFILE SECTION -->
  <div style="
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 4px 4px 4px;
    font-size: 11px;
  ">
    <!-- DETAILS -->
    <div style="flex: 1; padding-right: 10px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 2px 0; font-weight: bold; width: 17%;">Student's Name</td>
          <td style="padding: 2px 2px; width: 2%;">:</td>
          <td style="padding: 2px 0; width: 34%; font-weight: bold;">${term1.studentName}</td>

          <td style="padding: 2px 0; font-weight: bold; width: 16%;">Class</td>
          <td style="padding: 2px 2px; width: 2%;">:</td>
          <td style="padding: 2px 0; width: 29%; font-weight: bold;">${term1.batchName}</td>
        </tr>

        <tr>
          <td style="padding: 2px 0; font-weight: bold;">Father's Name</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.fName}</td>

          <td style="padding: 2px 0; font-weight: bold;">Section</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.section || "A"}</td>
        </tr>

        <tr>
          <td style="padding: 2px 0; font-weight: bold;">Mother's Name</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.motherName || "-"}</td>

          <td style="padding: 2px 0; font-weight: bold;">Roll No</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.rollNumber}</td>
        </tr>

        <tr>
          <td style="padding: 2px 0; font-weight: bold;">Admission No.</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.enrolment || "-"}</td>

          <td style="padding: 2px 0; font-weight: bold;">D.O.B.</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.dob}</td>
        </tr>

        <tr>
          <td style="padding: 2px 0; font-weight: bold;">Parent Mobile</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.parentNumber}</td>

          <td style="padding: 2px 0; font-weight: bold;">Attendance</td>
          <td style="padding: 2px 2px;">:</td>
          <td style="padding: 2px 0;">${term1.attendance || "-"}</td>
        </tr>

        <tr>
          <td style="padding: 2px 0; font-weight: bold; vertical-align: top;">Address</td>
          <td style="padding: 2px 2px; vertical-align: top;">:</td>
          <td colspan="4" style="padding: 2px 0;">${term1.address}</td>
        </tr>
      </table>
    </div>

    <!-- STUDENT PHOTO -->
    <div style="
      width: 74px;
      height: 88px;
      border: 1px solid #333333;
      padding: 1px;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    ">
      <img
        src="${term1.photo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </div>
  </div>

  <!-- SCHOLASTIC AREAS TITLE BANNER -->
  <div style="
    background: #dfe3f3;
    border: 1px solid #777777;
    border-bottom: none;
    text-align: center;
    font-size: 11px;
    font-weight: bold;
    padding: 3px 0;
    color: #111111;
    letter-spacing: 0.5px;
  ">
    SCHOLASTIC AREAS
  </div>

  <!-- SCHOLASTIC TABLE (TERM 1 & TERM 2) -->
  <table style="
    width: 100%;
    font-size: 9.5px;
    border: 1px solid #777777;
  ">
    <!-- MAIN HEADER -->
    <tr style="background: #eaedf7; font-weight: bold; text-align: center;">
      <th rowspan="2" style="border: 1px solid #777777; padding: 3px; width: 18%; text-align: left;">
        Subjects
      </th>
      <th colspan="6" style="border: 1px solid #777777; padding: 2px;">
        TERM — I
      </th>
      <th colspan="6" style="border: 1px solid #777777; padding: 2px;">
        TERM — II
      </th>
    </tr>

    <!-- SUB HEADER -->
    <tr style="background: #f0f2fa; text-align: center;">
      <!-- Term 1 -->
      <th style="border: 1px solid #777777; padding: 2px;">PT</th>
      <th style="border: 1px solid #777777; padding: 2px;">NB</th>
      <th style="border: 1px solid #777777; padding: 2px;">SE</th>
      <th style="border: 1px solid #777777; padding: 2px;">Theory</th>
      <th style="border: 1px solid #777777; padding: 2px; font-weight: bold;">Marks</th>
      <th style="border: 1px solid #777777; padding: 2px; font-weight: bold;">Grade</th>

      <!-- Term 2 -->
      <th style="border: 1px solid #777777; padding: 2px;">PT</th>
      <th style="border: 1px solid #777777; padding: 2px;">NB</th>
      <th style="border: 1px solid #777777; padding: 2px;">SE</th>
      <th style="border: 1px solid #777777; padding: 2px;">Theory</th>
      <th style="border: 1px solid #777777; padding: 2px; font-weight: bold;">Marks</th>
      <th style="border: 1px solid #777777; padding: 2px; font-weight: bold;">Grade</th>
    </tr>

    <!-- ROWS -->
    ${term1?.marks
      .map((m1: any) => {
        const m2 = term2.marks.find(
          (x: any) => x.subjectName === m1.subjectName
        );

        return `
        <tr>
          <td style="border: 1px solid #777777; padding: 2.5px 4px; font-weight: bold;">
            ${m1.subjectName}
          </td>

          <!-- TERM 1 -->
          <td style="border: 1px solid #777777; text-align: center;">${m1.periodic_test}</td>
          <td style="border: 1px solid #777777; text-align: center;">${m1.note_book}</td>
          <td style="border: 1px solid #777777; text-align: center;">${m1.subject_enrichment}</td>
          <td style="border: 1px solid #777777; text-align: center;">${m1.theory_marks}</td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">${m1.obtained_marks}</td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">${m1.grade}</td>

          <!-- TERM 2 -->
          <td style="border: 1px solid #777777; text-align: center;">${m2?.periodic_test || "-"}</td>
          <td style="border: 1px solid #777777; text-align: center;">${m2?.note_book || "-"}</td>
          <td style="border: 1px solid #777777; text-align: center;">${m2?.subject_enrichment || "-"}</td>
          <td style="border: 1px solid #777777; text-align: center;">${m2?.theory_marks || "-"}</td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">${m2?.obtained_marks || "-"}</td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">${m2?.grade || "-"}</td>
        </tr>
      `;
      })
      .join("")}
  </table>

  <!-- CO-SCHOLASTIC AREAS -->
  <div style="
    background: #dfe3f3;
    border: 1px solid #777777;
    border-bottom: none;
    margin-top: 5px;
    font-size: 10.5px;
    font-weight: bold;
    padding: 3px 6px;
    color: #111111;
  ">
    Co-Scholastic Areas (on a 3-point / 5-point scale)
  </div>

  <table style="
    width: 100%;
    font-size: 9.5px;
    border: 1px solid #777777;
  ">
    <tr style="background: #eaedf7; font-weight: bold;">
      <th style="border: 1px solid #777777; padding: 2px 6px; text-align: left; width: 70%;">
        Activities & Skills
      </th>
      <th style="border: 1px solid #777777; padding: 2px; text-align: center; width: 15%;">
        Term — I
      </th>
      <th style="border: 1px solid #777777; padding: 2px; text-align: center; width: 15%;">
        Term — II
      </th>
    </tr>

    ${term1.activity
      ?.map((a1: any) => {
        const a2 = term2.activity.find(
          (x: any) => x.subjectName === a1.subjectName
        );

        return `
        <tr>
          <td style="border: 1px solid #777777; padding: 2px 6px; text-transform: uppercase;">
            ${a1.subjectName}
          </td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
            ${a1.grade}
          </td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
            ${a2?.grade || "-"}
          </td>
        </tr>
      `;
      })
      .join("")}

    ${term1.skills
      ?.map((s1: any) => {
        const s2 = term2.skills.find(
          (x: any) => x.subjectName === s1.subjectName
        );

        return `
        <tr>
          <td style="border: 1px solid #777777; padding: 2px 6px; text-transform: uppercase;">
            ${s1.subjectName}
          </td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
            ${s1.grade}
          </td>
          <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
            ${s2?.grade || "-"}
          </td>
        </tr>
      `;
      })
      .join("")}

    <!-- DISCIPLINE -->
    <tr>
      <td style="border: 1px solid #777777; padding: 2px 6px; font-weight: bold;">
        DISCIPLINE
      </td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
        A
      </td>
      <td style="border: 1px solid #777777; text-align: center; font-weight: bold;">
        A
      </td>
    </tr>
  </table>

  <!-- 8-POINT GRADE SCALE -->
  <div style="
    background: #dfe3f3;
    border: 1px solid #777777;
    border-bottom: none;
    margin-top: 5px;
    font-size: 10px;
    font-weight: bold;
    padding: 2.5px 6px;
    color: #111111;
  ">
    Grade Scale For Scholastic Areas (Grades are awarded on 8 Point grade scale as Follows)
  </div>

  <table style="
    width: 100%;
    font-size: 9.5px;
    border: 1px solid #777777;
    text-align: center;
  ">
    <tr style="background: #eaedf7;">
      <td style="border: 1px solid #777777; padding: 2px 4px; font-weight: bold; width: 16%;">Marks Range (%)</td>
      <td style="border: 1px solid #777777; padding: 2px;">91-100</td>
      <td style="border: 1px solid #777777; padding: 2px;">81-90</td>
      <td style="border: 1px solid #777777; padding: 2px;">71-80</td>
      <td style="border: 1px solid #777777; padding: 2px;">61-70</td>
      <td style="border: 1px solid #777777; padding: 2px;">51-60</td>
      <td style="border: 1px solid #777777; padding: 2px;">41-50</td>
      <td style="border: 1px solid #777777; padding: 2px;">33-40</td>
      <td style="border: 1px solid #777777; padding: 2px;">0-32</td>
    </tr>
    <tr>
      <td style="border: 1px solid #777777; padding: 2px 4px; font-weight: bold;">Grade</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">A1</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">A2</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">B1</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">B2</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">C1</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">C2</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">D</td>
      <td style="border: 1px solid #777777; padding: 2px; font-weight: bold;">E</td>
    </tr>
  </table>

  <!-- REMARKS BOX -->
  <div style="
    margin-top: 5px;
    border: 1px solid #777777;
    padding: 5px 8px;
    font-size: 10.5px;
    background: #ffffff;
    line-height: 15px;
  ">
    <strong>Remarks:</strong> ${term1.studentName}'s overall performance: ${getRemark()}
    <div style="margin-top: 2px; font-weight: bold; color: #111111;">
      Combined Avg. Percentage : ${avgPercentage}% &nbsp;|&nbsp; Term I : ${Number(term1.percentage).toFixed(2)}% &nbsp;|&nbsp; Term II : ${Number(term2.percentage).toFixed(2)}%
    </div>
  </div>

  <!-- FOOTER & SIGNATURES -->
  <div style="
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 20px;
    padding: 0 10px 4px 10px;
  ">
    <!-- CLASS INCHARGE -->
    <div style="text-align: center; width: 130px;">
      <div style="height: 25px;"></div>
      <div style="
        border-top: 1px solid #222222;
        padding-top: 3px;
        font-size: 10.5px;
        font-weight: bold;
      ">
        Class Incharge
      </div>
    </div>

    <!-- PARENT / DATED -->
    <div style="text-align: center; width: 130px;">
      <div style="font-size: 10px; font-weight: bold; margin-bottom: 8px;">
        Dated : ${term2.date}
      </div>
      <div style="
        border-top: 1px solid #222222;
        padding-top: 3px;
        font-size: 10.5px;
        font-weight: bold;
      ">
        Parent
      </div>
    </div>

    <!-- PRINCIPAL -->
    <div style="text-align: center; width: 130px;">
      <div style="height: 25px;"></div>
      <div style="
        border-top: 1px solid #222222;
        padding-top: 3px;
        font-size: 10.5px;
        font-weight: bold;
      ">
        Principal
      </div>
    </div>
  </div>

</div>

</body>
</html>
`;
};