// import { createMarksheetPdf } from './CreateMarksheetPdf';
import { GetStudentDetail } from "@/axios/institute/InstituteGetApi";
import { useEffect, useState } from "react";

export const createMarksheetPdf = (data: any) => {
  const getRemark = () => {
    if (data.status === "Fail") {
      return "Needs improvement. Work harder and try again.";
    }

    const percentage = Number(data.percentage);

    if (percentage >= 90) return "Outstanding performance! Keep shining.";

    if (percentage >= 75)
      return "Excellent performance! Keep up the good work.";

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

@page{
  size:A4;
  margin:8mm;
}

body{
  margin:0;
  padding:0;
  background:#f2f2f2;
  font-family:'Times New Roman', serif;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

*{
  box-sizing:border-box;
  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
}

</style>
</head>

<body>

<div style="
  width:100%;
  background:#fff;
  border:3px solid #000;
  padding:10px;
">

  <!-- HEADER -->

  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:2px solid #000;
    padding-bottom:10px;
  ">

    <!-- LEFT LOGO -->

    <div style="
      width:90px;
      height:90px;
      border:2px solid #000;
      overflow:hidden;
      display:flex;
      justify-content:center;
      align-items:center;
    ">

      <img
        src="${data.instituteLogo}"
        crossorigin="anonymous"
        style="
          width:100%;
          height:100%;
          object-fit:contain;
        "
      />

    </div>

    <!-- CENTER -->

    <div style="
      flex:1;
      text-align:center;
      padding:0 15px;
    ">

      <div style="
        font-size:38px;
        font-weight:bold;
      ">
        ${data.instituteName}
      </div>

      <div style="
        font-size:15px;
        margin-top:4px;
      ">
        ${data.instituteAdress || ""}
      </div>

      <div style="
        font-size:15px;
        margin-top:4px;
      ">
        Phone : ${data.institutePhone || "N/A"}
      </div>

      <div style="
        font-size:30px;
        font-weight:bold;
        margin-top:10px;
      ">
        Report Card
      </div>

    </div>

    <!-- RIGHT LOGO -->

    <div style="
      width:90px;
      height:90px;
      border:2px solid #000;
      border-radius:50%;
      overflow:hidden;
      display:flex;
      justify-content:center;
      align-items:center;
    ">

      <img
        src="${data.instituteLogo}"
        crossorigin="anonymous"
        style="
          width:100%;
          height:100%;
          object-fit:contain;
        "
      />

    </div>

  </div>

  <!-- SESSION -->

  <div style="
    display:flex;
    justify-content:center;
    gap:40px;
    margin-top:12px;
    font-size:16px;
    font-weight:bold;
  ">

    <div>Class : ${data.batchName}</div>

    <div>Section : ${data.section || "A"}</div>

    <div>Session : ${data.session}</div>

  </div>

  <!-- STUDENT PROFILE -->

  <div style="
    border:2px solid #000;
    margin-top:14px;
  ">

    <!-- TITLE -->

    <div style="
      text-align:center;
      font-size:22px;
      font-weight:bold;
      border-bottom:2px solid #000;
      padding:7px;
      background:#f3f3f3;
    ">
      Student Profile
    </div>

    <!-- CONTENT -->

    <div style="
      display:flex;
      gap:20px;
      padding:15px;
    ">

      <!-- IMAGE -->

      <div style="
        width:150px;
        display:flex;
        justify-content:center;
      ">

        <img
          src="${data.photo}"
          crossorigin="anonymous"
          style="
            width:130px;
            height:150px;
            border:2px solid #000;
            object-fit:cover;
          "
        />

      </div>

      <!-- DETAILS -->

      <div style="
        flex:1;
      ">

      <table style="
  width:100%;
  border-collapse:collapse;
  font-size:15px;
">

  <tr>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Student Name
        </span>

        <span>:</span>

        <span>${data.studentName}</span>
      </div>

    </td>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Roll Number
        </span>

        <span>:</span>

        <span>${data.rollNumber}</span>
      </div>

    </td>

  </tr>

  <tr>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Father Name
        </span>

        <span>:</span>

        <span>${data.fName}</span>
      </div>

    </td>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Enrollment No
        </span>

        <span>:</span>

        <span>${data.enrolment || "-"}</span>
      </div>

    </td>

  </tr>

  <tr>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Class
        </span>

        <span>:</span>

        <span>${data.batchName}</span>
      </div>

    </td>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Section
        </span>

        <span>:</span>

        <span>${data.section || "A"}</span>
      </div>

    </td>

  </tr>

  <tr>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Session
        </span>

        <span>:</span>

        <span>${data.session}</span>
      </div>

    </td>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Date Of Birth
        </span>

        <span>:</span>

        <span>${data.dob}</span>
      </div>

    </td>

  </tr>

  <tr>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Parent Mobile
        </span>

        <span>:</span>

        <span>${data.parentNumber}</span>
      </div>

    </td>

    <td style="padding:6px 8px;">

      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-weight:bold;white-space:nowrap;">
          Exam Name
        </span>

        <span>:</span>

        <span>${data.examName}</span>
      </div>

    </td>

  </tr>

  <tr>

    <td colspan="2" style="padding:6px 8px;">

      <div style="
        display:flex;
        align-items:flex-start;
        gap:6px;
      ">

        <span style="
          font-weight:bold;
          white-space:nowrap;
        ">
          Address
        </span>

        <span>:</span>

        <span style="line-height:22px;">
          ${data.address}
        </span>

      </div>

    </td>

  </tr>

</table>

      </div>

    </div>

  </div>

  <!-- ACADEMIC PERFORMANCE -->

  <div style="
    margin-top:16px;
    font-size:19px;
    font-weight:bold;
  ">
    Academic Performance : Scholastic Areas
  </div>

  <table style="
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
    font-size:13px;
  ">

    <!-- TOP HEADER -->

    <tr>

      <th rowspan="2" style="
        border:1px solid #000;
        padding:8px;
        text-align:center;
        width:20%;
      ">
        SUBJECTS
      </th>

      <th colspan="6" style="
        border:1px solid #000;
        padding:8px;
        text-align:center;
      ">
        INTERNAL ASSESSMENT
      </th>

      <th colspan="3" style="
        border:1px solid #000;
        padding:8px;
        text-align:center;
      ">
        FINAL RESULT
      </th>

    </tr>

    <!-- SUB HEADER -->

    <tr>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Periodic Test
        <br>
        10
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Note Book
        <br>
        5
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Subject Enrichment
        <br>
        5
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Practical
        <br>
        20
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Theory
        <br>
        80
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Total
        <br>
        100
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Obtained
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Grade
      </th>

      <th style="
        border:1px solid #000;
        padding:6px;
        text-align:center;
      ">
        Result
      </th>

    </tr>

    ${data.marks
      .map(
        (m: any) => `
      <tr>

        <td style="
          border:1px solid #000;
          padding:8px;
          font-weight:bold;
        ">
          ${m.subjectName}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
        ">
          ${m.periodic_test}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
        ">
          ${m.note_book}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
        ">
          ${m.subject_enrichment}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
        ">
          ${m.practical_marks}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
        ">
          ${m.theory_marks}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
          font-weight:bold;
        ">
          100
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
          font-weight:bold;
        ">
          ${m.obtained_marks}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
          font-weight:bold;
        ">
          ${m.grade}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
          font-weight:bold;
        ">
          ${m.obtained_marks >= 33 ? "PASS" : "FAIL"}
        </td>

      </tr>
    `,
      )
      .join("")}

  </table>

  <!-- CO SCHOLASTIC -->

  <div style="
    margin-top:18px;
    font-size:18px;
    font-weight:bold;
  ">
    Co-Scholastic
  </div>

  <table style="
    width:100%;
    border-collapse:collapse;
    margin-top:8px;
    font-size:14px;
  ">

    <tr>

      <th style="
        border:1px solid #000;
        padding:8px;
        text-align:left;
      ">
        Activity
      </th>

      <th style="
        border:1px solid #000;
        padding:8px;
        text-align:center;
      ">
        Grade
      </th>

    </tr>

    ${data.activity
      ?.map(
        (item: any) => `
      <tr>

        <td style="
          border:1px solid #000;
          padding:8px;
        ">
          ${item.subjectName}
        </td>

        <td style="
          border:1px solid #000;
          text-align:center;
          font-weight:bold;
        ">
          ${item.grade}
        </td>

      </tr>
    `,
      )
      .join("")}

  </table>

  <!-- SKILLS + GRADE SYSTEM -->

  <div style="
    display:flex;
    gap:15px;
    margin-top:18px;
  ">

    <!-- SKILLS -->

    <div style="width:70%;">

      <div style="
        font-size:18px;
        font-weight:bold;
        margin-bottom:8px;
      ">
        Co-Scholastic Areas [3-Point Scale]
      </div>

      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:14px;
      ">

        <tr>

          <th style="
            border:1px solid #000;
            padding:8px;
            text-align:left;
          ">
            Skill
          </th>

          <th style="
            border:1px solid #000;
            padding:8px;
            text-align:center;
          ">
            Grade
          </th>

        </tr>

        ${data.skills
          ?.map(
            (item: any) => `
          <tr>

            <td style="
              border:1px solid #000;
              padding:8px;
            ">
              ${item.subjectName}
            </td>

            <td style="
              border:1px solid #000;
              text-align:center;
              font-weight:bold;
            ">
              ${item.grade}
            </td>

          </tr>
        `,
          )
          .join("")}

      </table>

    </div>

    <!-- GRADE SYSTEM -->

    <div style="width:30%;">

      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:13px;
      ">

        <tr>

          <th style="
            border:1px solid #000;
            padding:8px;
            text-align:center;
          ">
            Marks Range
          </th>

          <th style="
            border:1px solid #000;
            padding:8px;
            text-align:center;
          ">
            Grade
          </th>

        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">91-100</td>
          <td style="border:1px solid #000;text-align:center;">A1</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">81-90</td>
          <td style="border:1px solid #000;text-align:center;">A2</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">71-80</td>
          <td style="border:1px solid #000;text-align:center;">B1</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">61-70</td>
          <td style="border:1px solid #000;text-align:center;">B2</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">51-60</td>
          <td style="border:1px solid #000;text-align:center;">C1</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">41-50</td>
          <td style="border:1px solid #000;text-align:center;">C2</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">33-40</td>
          <td style="border:1px solid #000;text-align:center;">D</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">
            32 & Below
          </td>

          <td style="
            border:1px solid #000;
            text-align:center;
          ">
            E
          </td>
        </tr>

      </table>

    </div>

  </div>

  <!-- RESULT -->

  <div style="
    border:2px solid #000;
    margin-top:18px;
    padding:10px;
    display:flex;
    justify-content:space-between;
    font-size:15px;
    font-weight:bold;
  ">

    <div>
      TOTAL : ${data.totalMarks} / ${data.allsubjecttotal}
    </div>

    <div>
      PERCENTAGE : ${Number(data.percentage).toFixed(2)}%
    </div>

    <div>
      GRADE : ${data.overallGrade}
    </div>

    <div>
      RESULT : ${data.status}
    </div>

  </div>

  <!-- REMARKS -->

  <div style="
    margin-top:22px;
    text-align:center;
  ">

    <div style="
      font-size:20px;
      font-weight:bold;
    ">
      Class Teacher Remarks
    </div>

    <div style="
      margin-top:8px;
      font-size:18px;
      font-style:italic;
    ">
      ${getRemark()}
    </div>

  </div>

  <!-- FOOTER -->

  <div style="
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    margin-top:50px;
  ">

    <!-- LEFT -->

    <div>

      <div style="
        font-size:15px;
        margin-bottom:15px;
      ">
        Date : ${data.date}
      </div>

      <img
        src="${data.qr}"
        crossorigin="anonymous"
        style="
          width:90px;
          height:90px;
          object-fit:contain;
        "
      />

    </div>

    <!-- RIGHT -->

    <div style="
      width:300px;
      text-align:center;
    ">

      <img
        src="${data.principalSignature}"
        crossorigin="anonymous"
        style="
          width:250px;
          height:70px;
          object-fit:contain;
          mix-blend-mode:multiply;
        "
      />

      <div style="
        border-top:2px solid #000;
        margin-top:5px;
        padding-top:5px;
        font-size:16px;
        font-weight:bold;
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


// Given below is Combine createMarksheetPdf
export const createCombinedMarksheetPdf = (
  term1: any,
  term2: any
) => {
  const getRemark = () => {
    const percentage =
      (Number(term1.percentage) + Number(term2.percentage)) / 2;

    if (percentage >= 90)
      return "Outstanding performance! Keep shining.";

    if (percentage >= 75)
      return "Excellent performance! Keep up the good work.";

    if (percentage >= 60)
      return "Good job! You are doing well.";

    if (percentage >= 40)
      return "Satisfactory performance. Keep improving.";

    return "Needs improvement. Focus more on studies.";
  };

  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">

<style>

@page{
  size:A4;
  margin:5mm;
}

body{
  margin:0;
  padding:0;
  background:#fff;
  font-family:'Times New Roman', serif;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

*{
  box-sizing:border-box;
  -webkit-print-color-adjust:exact !important;
  print-color-adjust:exact !important;
}

table{
  border-collapse:collapse;
}

</style>
</head>

<body>

<div style="
  width:100%;
  border:2px solid #000;
  padding:6px;
">

  <!-- HEADER -->

  <div style="
    border:1px solid #000;
    padding:6px;
  ">

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
    ">

      <!-- LEFT LOGO -->

      <div style="
        width:70px;
        height:70px;
      ">

        <img
          src="${term1.instituteLogo}"
          crossorigin="anonymous"
          style="
            width:100%;
            height:100%;
            object-fit:contain;
          "
        />

      </div>

      <!-- CENTER -->

      <div style="
        flex:1;
        text-align:center;
      ">

        <div style="
          font-size:30px;
          font-weight:bold;
          line-height:32px;
        ">
          ${term1.instituteName}
        </div>

        <div style="
          font-size:12px;
          margin-top:3px;
        ">
          ${term1.instituteAdress || ""}
        </div>

        <div style="
          font-size:12px;
          margin-top:2px;
        ">
          Ph. ${term1.institutePhone || ""}
        </div>

      </div>



    </div>

    <!-- REPORT TITLE -->

    <div style="
      text-align:center;
      font-size:24px;
      font-weight:bold;
      margin-top:4px;
      border-top:1px solid #000;
      padding-top:4px;
    ">
      Report Card
    </div>

    <!-- SESSION -->

    <div style="
      text-align:center;
      margin-top:4px;
      font-size:13px;
      font-weight:bold;
    ">

      Class : ${term1.batchName}
      &nbsp;&nbsp;&nbsp;

      Sec : ${term1.section || "A"}
      &nbsp;&nbsp;&nbsp;

      Session : ${term1.session}

    </div>

  </div>

  <!-- STUDENT PROFILE -->

  <div style="
    border:1px solid #000;
    margin-top:6px;
  ">

    <div style="
      text-align:center;
      font-weight:bold;
      font-size:16px;
      padding:4px;
      border-bottom:1px solid #000;
      background:#efefef;
    ">
      Student Profile
    </div>

    <div style="
      display:flex;
      gap:10px;
      padding:6px;
      align-items:flex-start;
    ">

      <!-- STUDENT PHOTO -->

      <div style="
        width:90px;
      ">

        <img
          src="${term1.photo}"
          crossorigin="anonymous"
          style="
            width:85px;
            height:95px;
            border:1px solid #000;
            object-fit:cover;
          "
        />

      </div>

      <!-- LEFT INFO -->

      <div style="flex:1;">

        <table style="
          width:100%;
          font-size:11px;
        ">

          <tr>

            <td style="padding:2px;font-weight:bold;">
              Admission No.
            </td>

            <td style="padding:2px;">
              : ${term1.enrolment || "-"}
            </td>

            <td style="padding:2px;font-weight:bold;">
              Roll No
            </td>

            <td style="padding:2px;">
              : ${term1.rollNumber}
            </td>

          </tr>

          <tr>

            <td style="padding:2px;font-weight:bold;">
              Student Name
            </td>

            <td style="padding:2px;">
              : ${term1.studentName}
            </td>

            <td style="padding:2px;font-weight:bold;">
              DOB
            </td>

            <td style="padding:2px;">
              : ${term1.dob}
            </td>

          </tr>

          <tr>

            <td style="padding:2px;font-weight:bold;">
              Mother Name
            </td>

            <td style="padding:2px;">
              : ${term1.motherName || "-"}
            </td>

            <td style="padding:2px;font-weight:bold;">
              Mobile
            </td>

            <td style="padding:2px;">
              : ${term1.parentNumber}
            </td>

          </tr>

          <tr>

            <td style="padding:2px;font-weight:bold;">
              Father Name
            </td>

            <td style="padding:2px;">
              : ${term1.fName}
            </td>

            <td style="padding:2px;font-weight:bold;">
              Attendance
            </td>

            <td style="padding:2px;">
              : ${term1.attendance || "-"}
            </td>

          </tr>

          <tr>

            <td style="padding:2px;font-weight:bold;">
              Address
            </td>

            <td colspan="3" style="padding:2px;">
              : ${term1.address}
            </td>

          </tr>

        </table>

      </div>



    </div>

  </div>

  <!-- SCHOLASTIC -->

  <div style="
    margin-top:6px;
    font-size:15px;
    font-weight:bold;
  ">
    Academic Performance : Scholastic Areas
  </div>

  <table style="
    width:100%;
    margin-top:3px;
    font-size:10px;
  ">

    <!-- MAIN HEADER -->

    <tr>

      <th rowspan="2" style="
        border:1px solid #000;
        padding:4px;
        width:16%;
      ">
        SUBJECTS
      </th>

      <th colspan="6" style="
        border:1px solid #000;
        padding:4px;
      ">
        TERM - I
      </th>

      <th colspan="6" style="
        border:1px solid #000;
        padding:4px;
      ">
        TERM - II
      </th>

    </tr>

    <!-- SUB HEADER -->

    <tr>

      <!-- TERM 1 -->

      <th style="border:1px solid #000;padding:2px;">
        PT
      </th>

      <th style="border:1px solid #000;padding:2px;">
        NB
      </th>

      <th style="border:1px solid #000;padding:2px;">
        SE
      </th>

      <th style="border:1px solid #000;padding:2px;">
        Theory
      </th>

      <th style="border:1px solid #000;padding:2px;">
        Marks
      </th>

      <th style="border:1px solid #000;padding:2px;">
        Grade
      </th>

      <!-- TERM 2 -->

      <th style="border:1px solid #000;padding:2px;">
        PT
      </th>

      <th style="border:1px solid #000;padding:2px;">
        NB
      </th>

      <th style="border:1px solid #000;padding:2px;">
        SE
      </th>

      <th style="border:1px solid #000;padding:2px;">
        Theory
      </th>

      <th style="border:1px solid #000;padding:2px;">
        Marks
      </th>

      <th style="border:1px solid #000;padding:2px;">
        Grade
      </th>

    </tr>

    ${term1?.marks
      .map((m1: any) => {
        const m2 = term2.marks.find(
          (x: any) => x.subjectName === m1.subjectName
        );

        return `
        <tr>

          <td style="
            border:1px solid #000;
            padding:3px;
            font-weight:bold;
          ">
            ${m1.subjectName}
          </td>

          <!-- TERM 1 -->

          <td style="border:1px solid #000;text-align:center;">
            ${m1.periodic_test}
          </td>

          <td style="border:1px solid #000;text-align:center;">
            ${m1.note_book}
          </td>

          <td style="border:1px solid #000;text-align:center;">
            ${m1.subject_enrichment}
          </td>

          <td style="border:1px solid #000;text-align:center;">
            ${m1.theory_marks}
          </td>

          <td style="border:1px solid #000;text-align:center;font-weight:bold;">
            ${m1.obtained_marks}
          </td>

          <td style="border:1px solid #000;text-align:center;font-weight:bold;">
            ${m1.grade}
          </td>

          <!-- TERM 2 -->

          <td style="border:1px solid #000;text-align:center;">
            ${m2?.periodic_test || "-"}
          </td>

          <td style="border:1px solid #000;text-align:center;">
            ${m2?.note_book || "-"}
          </td>

          <td style="border:1px solid #000;text-align:center;">
            ${m2?.subject_enrichment || "-"}
          </td>

          <td style="border:1px solid #000;text-align:center;">
            ${m2?.theory_marks || "-"}
          </td>

          <td style="border:1px solid #000;text-align:center;font-weight:bold;">
            ${m2?.obtained_marks || "-"}
          </td>

          <td style="border:1px solid #000;text-align:center;font-weight:bold;">
            ${m2?.grade || "-"}
          </td>

        </tr>
      `;
      })
      .join("")}

  </table>

  <!-- CO SCHOLASTIC -->

  <div style="
    margin-top:5px;
    font-size:14px;
    font-weight:bold;
  ">
    Co-Scholastic
  </div>

  <table style="
    width:100%;
    margin-top:2px;
    font-size:10px;
  ">

    ${term1.activity
      ?.map((a1: any) => {
        const a2 = term2.activity.find(
          (x: any) => x.subjectName === a1.subjectName
        );

        return `
        <tr>

          <td style="
            border:1px solid #000;
            padding:4px;
            width:70%;
            font-weight:bold;
          ">
            ${a1.subjectName}
          </td>

          <!-- TERM 1 GRADE -->

          <td style="
            border:1px solid #000;
            text-align:center;
            width:15%;
            font-weight:bold;
          ">
            ${a1.grade}
          </td>

          <!-- TERM 2 GRADE -->

          <td style="
            border:1px solid #000;
            text-align:center;
            width:15%;
            font-weight:bold;
          ">
            ${a2?.grade || "-"}
          </td>

        </tr>
      `;
      })
      .join("")}

  </table>

  <!-- SKILLS + GRADE TABLE -->

  <div style="
    display:flex;
    gap:6px;
    margin-top:6px;
  ">

    <!-- SKILLS -->

    <div style="flex:1;">

      <div style="
        font-size:13px;
        font-weight:bold;
        margin-bottom:2px;
      ">
        Co-Scholastic Areas [on a 3-point (A-C) grading scale]
      </div>

      <table style="
        width:100%;
        font-size:10px;
      ">

        <tr>

          <th style="
            border:1px solid #000;
            padding:4px;
          ">
            Skill
          </th>

          <th style="
            border:1px solid #000;
            padding:4px;
          ">
            Term - I
          </th>

          <th style="
            border:1px solid #000;
            padding:4px;
          ">
            Term - II
          </th>

        </tr>

        ${term1.skills
          ?.map((s1: any) => {
            const s2 = term2.skills.find(
              (x: any) => x.subjectName === s1.subjectName
            );

            return `
            <tr>

              <td style="
                border:1px solid #000;
                padding:4px;
                font-weight:bold;
              ">
                ${s1.subjectName}
              </td>

              <td style="
                border:1px solid #000;
                text-align:center;
                font-weight:bold;
              ">
                ${s1.grade}
              </td>

              <td style="
                border:1px solid #000;
                text-align:center;
                font-weight:bold;
              ">
                ${s2?.grade || "-"}
              </td>

            </tr>
          `;
          })
          .join("")}

      </table>

      <!-- DISCIPLINE -->

      <table style="
        width:100%;
        margin-top:5px;
        font-size:10px;
      ">

        <tr>

          <td style="
            border:1px solid #000;
            padding:4px;
            font-weight:bold;
            width:70%;
          ">
            DISCIPLINE
          </td>

          <td style="
            border:1px solid #000;
            text-align:center;
            width:15%;
            font-weight:bold;
          ">
            A
          </td>

          <td style="
            border:1px solid #000;
            text-align:center;
            width:15%;
            font-weight:bold;
          ">
            A
          </td>

        </tr>

      </table>

    </div>

    <!-- GRADE TABLE -->

    <div style="
      width:180px;
    ">

      <table style="
        width:100%;
        font-size:10px;
      ">

        <tr>

          <th style="
            border:1px solid #000;
            padding:4px;
          ">
            Marks Range
          </th>

          <th style="
            border:1px solid #000;
            padding:4px;
          ">
            Grade
          </th>

        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">91-100</td>
          <td style="border:1px solid #000;text-align:center;">A1</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">81-90</td>
          <td style="border:1px solid #000;text-align:center;">A2</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">71-80</td>
          <td style="border:1px solid #000;text-align:center;">B1</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">61-70</td>
          <td style="border:1px solid #000;text-align:center;">B2</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">51-60</td>
          <td style="border:1px solid #000;text-align:center;">C1</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">41-50</td>
          <td style="border:1px solid #000;text-align:center;">C2</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">33-40</td>
          <td style="border:1px solid #000;text-align:center;">D</td>
        </tr>

        <tr>
          <td style="border:1px solid #000;text-align:center;">
            32 & Below
          </td>

          <td style="border:1px solid #000;text-align:center;">
            E
          </td>

        </tr>

      </table>

    </div>

  </div>

  <!-- REMARK -->

  <div style="
    text-align:center;
    margin-top:6px;
  ">

    <div style="
      font-size:16px;
      font-weight:bold;
    ">
      Class Teacher Remarks
    </div>

    <div style="
      font-size:12px;
      margin-top:2px;
      font-style:italic;
    ">
      ${getRemark()}
    </div>

  </div>

  <!-- FOOTER -->

  <div style="
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    margin-top:20px;
  ">

    <!-- LEFT -->

    <div style="
      font-size:11px;
      font-weight:bold;
    ">
      Dated : ${term2.date}
    </div>

    <!-- CLASS TEACHER -->

    <div style="
      text-align:center;
    ">

      <div style="
        height:40px;
        width:120px;
      ">
      </div>

      <div style="
        border-top:1px solid #000;
        width:120px;
        padding-top:3px;
        font-size:11px;
        font-weight:bold;
      ">
        Class Teacher
      </div>

    </div>

    <!-- PRINCIPAL -->

    <div style="
      text-align:center;
    ">

      <div style="
        height:40px;
        width:120px;
      ">
      </div>

      <div style="
        border-top:1px solid #000;
        width:120px;
        padding-top:3px;
        font-size:11px;
        font-weight:bold;
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

// below code is for acadmy createMarksheetPdf

export const createAcadmyMarksheetPdf = (data: any) => {

  const getRemark = () => {
    if (data.status === "Fail") {
      return "Needs improvement. Work harder and try again.";
    }

    const percentage = Number(data.percentage);

    if (percentage >= 90) return "Outstanding performance! Keep shining.";
    if (percentage >= 75)
      return "Excellent performance! Keep up the good work.";
    if (percentage >= 60) return "Good job! You are doing well.";
    if (percentage >= 40) return "Satisfactory performance. Keep improving.";

    return "Needs improvement. Focus more on studies.";
  };

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Marksheet</title>
<style>
  @page {
    size: A4;
    margin: 10mm;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
</style>

</head>

<body style="margin:0; font-family:Arial, sans-serif; background:#dfe7f1;">

 <div style="width:900px; margin:20px auto; background:#f7fbff; border:6px double #b5c7d8; padding:20px; box-sizing:border-box;">


   
    <div style="background:linear-gradient(#eaf3fb,#d6e6f5); padding:15px; border:2px solid #c3d3e2; -webkit-print-color-adjust: exact;">
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
            
            <div style="display:flex; align-items:center; gap:10px;">
                <img src=${data.instituteLogo} crossorigin="anonymous" style="width:80px;">
                <div>
                    <h1 style="margin:0; color:#1f4e8c; font-size:35px; border-bottom:2px solid #f4934d96; display:inline-block;">
                      
                        ${data.instituteName}
                    </h1>
                     <div style="margin-top:8px; display:flex; flex-direction:column; gap:4px;">

    <div style="color:#2e3f57; font-size:13px; font-weight:500; display:flex; align-items:flex-start;">
        <span style="margin-right:6px;"></span>
        <span style="line-height:1.4;">
            ${data.instituteAdress || "N/A"}
        </span>
    </div>

    <div style="color:#1f4e8c; font-size:13px; font-weight:600; display:flex; align-items:center;">
        <span style="margin-right:6px;"></span>
        <span>
            ${data.institutePhone ? data.institutePhone : "N/A"}
        </span>
    </div>

</div>
                </div>
            </div>

            <div style="text-align:right;">
                <div style="color:#1f4e8c; font-size:25px; font-weight:bold; border-bottom:2px solid #1f4e8c;">MARKSHEET</div>
                <div style="font-size:14px; margin-top: 10px; color:#1f4e8c; font-weight: bold;"> ${data.examName}</div>
            </div>

        </div>
    </div>

    <div style="background:linear-gradient(#eaf3fb,#d6e6f5); margin-top:15px; padding:20px; border:2px solid #c3d3e2; display:flex; -webkit-print-color-adjust: exact;">

    <img src="${data.photo}" crossorigin="anonymous" style="width:130px; border:3px solid #fff; box-shadow:0 0 5px rgba(0,0,0,0.2); ">

    <div style="flex:1; padding-left:25px;">
        
       <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">

  <!-- LEFT COLUMN -->
  <div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Name:</b>
      <span style="font-weight:bold;"> ${data.studentName}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Father Name:</b>
      <span style="font-weight:bold;"> ${data.fName}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Roll No:</b>
      <span style="font-weight:bold;"> ${data.rollNumber}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Class:</b>
      <span style="font-weight:bold;"> ${data.batchName}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">DOB:</b>
      <span style="font-weight:bold;"> ${data.dob}</span>
    </div>

  </div>

  <!-- RIGHT COLUMN -->
  <div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Enrollment No:</b>
      <span style="font-weight:bold;"> ${data.enrolment}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Session:</b>
      <span style="font-weight:bold;"> ${data.session}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Parent Mobile:</b>
      <span style="font-weight:bold;"> ${data.parentNumber}</span>
    </div>

    <div style="margin:10px 0; border-bottom:2px solid #c3d3e2; padding-bottom:5px;">
      <b style="color:#1f4e8c;">Address:</b>
      <span style="font-weight:bold;">${data.address}</span>
    </div>

  </div>

</div>
    </div>

</div>
 <p  style="border-bottom: 6px double #9db9d4;"></p>
   
    <div style="margin-top:20px; text-align:center;" >
        <span style="background:#1f4e8c; color:#fff; padding:8px 25px; font-weight:bold; letter-spacing:1px; -webkit-print-color-adjust: exact; ">
            ACADEMIC PERFORMANCE
        </span>
    </div>
     <p  style="border-bottom: 6px double #9db9d4;"></p>

    
  
    <table style="width:100%; border-collapse:collapse; margin-top:20px; text-align:center;">

    <tr style="background:#1f4e8c; color:#fff;  -webkit-print-color-adjust: exact;">
        <th style="padding:px; border:1px solid #c3d3e2;">Subject</th>
        <th style="padding:10px; border:1px solid #c3d3e2;">Max Marks</th>
        <th style="padding:10px; border:1px solid #c3d3e2;">Practical</th>
        <th style="padding:10px; border:1px solid #c3d3e2;">Theory</th>
        <th style="padding:10px; border:1px solid #c3d3e2;">Marks Obtained</th>
    </tr>
          ${data.marks
            .map(
              (m: any, i: number) => `
    <tr style="background:${(i + 1) % 2 === 0 ? "#ffffff" : "#eaf3fb"}; -webkit-print-color-adjust: exact;">
        <td style="padding:10px; border:1px solid #c3d3e2;">${m.subjectName}</td>
        <td style="border:1px solid #c3d3e2;">100</td>
        <td style="border:1px solid #c3d3e2;">${m.practical_marks}</td>
        <td style="border:1px solid #c3d3e2;">${m.theory_marks}</td>
        <td style="border:1px solid #c3d3e2;">${m.obtained_marks}</td>

    </tr>

      `,
            )
            .join("")}


</table>
 <p style=" border-bottom:2px solid #c3d3e2; padding-bottom:10px; "></p>
   
    <div style="margin-top:20px; background:#1f4e8c; color:#fff; padding:10px; display:flex; justify-content:space-between;  -webkit-print-color-adjust: exact;">
        <div><b>TOTAL MARKS:</b><span style="font-weight: bolder; font-size: larger;"> ${data.totalMarks} </span> / ${data.allsubjecttotal}</div>
        <div><b>PERCENTAGE:</b><span  style="font-weight: bolder; font-size: larger;" > ${Number(data.percentage).toFixed(2)}</span>%</div>
        <div><b>GRADE:</b> <span style="font-weight: bolder; font-size: larger;" >  ${data.overallGrade}</span></div>
        <div><b>RESULT:</b> <span style="font-weight: bolder; font-size: larger;" > ${data.status}</span></div>
    </div>
    <p  style="border-bottom: 6px double #9db9d4;"></p>
  
    <div style="margin-top:20px;">
        <p style="color:#1f4e8c;"> Date: <span style="color: #2e3f57; font-weight: bolder; "> ${data.date}</span></p>

<div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:50px;">

    <!-- QR Code Section (Left Side) -->
    <div style="width:40%; display:flex; justify-content:flex-start;">
        <img src="${data.qr}" crossorigin="anonymous" alt="QR Code" style="
            height: 100px;
            width: 100px;
            object-fit: contain;
        " />
    </div>

    <!-- Director/Principal Section (Right Side) -->
    <div style="text-align:center; width:40%; display: flex; flex-direction: column; align-items: center;">
        
        <!-- Principal Signature Image -->
        <img src="${data.principalSignature}" crossorigin="anonymous" alt="Principal Sign" style="
            height: 70px; 
            width: 350px; 
            object-fit: contain; 
            margin-bottom: -5px; 
            mix-blend-mode: multiply;
        " />

        <div style="border-top:2px solid #9db9d4; width: 100%; margin-top:5px; font-style: italic; font-size: 20px;"> 
            <span style="color: #1f4e8c;">Director or Principal</span>
        </div>
    </div>

</div>
    </div>

   
   

</div>

</body>
</html>
`;
};