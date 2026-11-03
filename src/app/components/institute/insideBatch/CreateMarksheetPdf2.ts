
export const generateMidTermMarksheet2 = (data: any) => {
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

  const getGradeStyle = (grade: string) => {
    if (["A1", "A2"].includes(grade)) return "background:#1e6b37; color:#ffffff;";
    if (["B1", "B2"].includes(grade)) return "background:#1b4f72; color:#ffffff;";
    if (["C1", "C2"].includes(grade)) return "background:#8c6d1f; color:#ffffff;";
    if (grade === "D") return "background:#935116; color:#ffffff;";
    return "background:#900c3f; color:#ffffff;";
  };

  const isCoScholastic = (type?: string) =>
  type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ??
  false;

const scholasticMarks = (data.marks ?? []).filter(
  (m: any) => !isCoScholastic(m.subjectType)
);

const coScholasticMarks = (data.marks ?? []).filter(
  (m: any) => isCoScholastic(m.subjectType)
);


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
  font-family: 'Times New Roman', serif;
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

<!-- OUTER CERTIFICATE BORDER -->
<div style="
  width: 100%;
  border: 4px solid #5a102a;
  background: #ffffff;
  position: relative;
">
  <!-- INNER ACCENT BORDER -->
  <div style="
    margin: 3px;
    border: 1.5px solid #c4973b;
    padding: 10px;
  ">

    <!-- HEADER SECTION -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #5a102a;
    ">
      <!-- LEFT LOGO -->
      <div style="
        width: 86px;
        height: 86px;
        border: 2px solid #c4973b;
        border-radius: 6px;
        padding: 3px;
        background: #ffffff;
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

      <!-- CENTER INSTITUTE INFO -->
      <div style="flex: 1; text-align: center; padding: 0 16px;">
        <div style="
          font-size: 32px;
          font-weight: bold;
          color: #5a102a;
          letter-spacing: 0.8px;
          line-height: 1.2;
          text-transform: uppercase;
        ">
          ${data.instituteName}
        </div>

        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 4px 0;
        ">
          <span style="height: 1px; width: 50px; background: #c4973b;"></span>
          <span style="color: #c4973b; font-size: 14px;">✦ ✦ ✦</span>
          <span style="height: 1px; width: 50px; background: #c4973b;"></span>
        </div>

        <div style="font-size: 13px; color: #444444; margin-top: 2px;">
          ${data.instituteAdress || ""}
        </div>

        <div style="font-size: 12px; color: #555555; margin-top: 2px;">
          Contact : ${data.institutePhone || "N/A"}
        </div>

        <!-- REPORT CARD PILL -->
        <div style="
          display: inline-block;
          margin-top: 7px;
          background: #5a102a;
          color: #ffffff;
          padding: 3px 28px;
          border-radius: 14px;
          font-size: 17px;
          font-weight: bold;
          letter-spacing: 2px;
          border: 1px solid #c4973b;
        ">
          REPORT CARD
        </div>
      </div>

      <!-- RIGHT LOGO -->
      <div style="
        width: 86px;
        height: 86px;
        border: 2px solid #c4973b;
        border-radius: 50%;
        padding: 3px;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      ">
        <img
          src="${data.instituteLogo}"
          crossorigin="anonymous"
          style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;"
        />
      </div>
    </div>

    <!-- META BAR -->
    <div style="
      background: #fbf5ee;
      border: 1px solid #dfc79b;
      margin-top: 8px;
      padding: 6px 14px;
      display: flex;
      justify-content: space-around;
      font-size: 13.5px;
      font-weight: bold;
      color: #5a102a;
    ">
      <span>Class : ${data.batchName}</span>
      <span>|</span>
      <span>Section : ${data.section || "A"}</span>
      <span>|</span>
      <span>Session : ${data.session}</span>
      <span>|</span>
      <span>Exam : ${data.examName}</span>
    </div>

    <!-- STUDENT PROFILE BOX -->
    <div style="
      margin-top: 10px;
      border: 1.5px solid #5a102a;
      border-radius: 4px;
      overflow: hidden;
    ">
      <!-- TITLE -->
      <div style="
        background: #5a102a;
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        padding: 4px;
        letter-spacing: 1px;
      ">
        STUDENT PROFILE
      </div>

      <!-- BODY -->
      <div style="
        display: flex;
        background: #fffdfa;
        padding: 8px 12px;
        gap: 16px;
        align-items: center;
      ">
        <!-- PHOTO -->
        <div style="
          width: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        ">
          <img
            src="${data.photo}"
            crossorigin="anonymous"
            style="
              width: 100px;
              height: 120px;
              border: 2px solid #5a102a;
              border-radius: 4px;
              object-fit: cover;
            "
          />
        </div>

        <!-- DETAILS TABLE -->
        <div style="flex: 1;">
          <table style="width: 100%; font-size: 12.5px;">
            <tr>
              <td style="padding: 4px; font-weight: bold; color: #5a102a; width: 22%;">Student Name</td>
              <td style="padding: 4px; width: 3%;">:</td>
              <td style="padding: 4px; font-weight: bold; color: #111; width: 25%;">${data.studentName}</td>

              <td style="padding: 4px; font-weight: bold; color: #5a102a; width: 22%;">Roll Number</td>
              <td style="padding: 4px; width: 3%;">:</td>
              <td style="padding: 4px; font-weight: bold; color: #111; width: 25%;">${data.rollNumber}</td>
            </tr>

            <tr style="background: #fbf5ee;">
              <td style="padding: 4px; font-weight: bold; color: #5a102a;">Father's Name</td>
              <td style="padding: 4px;">:</td>
              <td style="padding: 4px; color: #222;">${data.fName}</td>

              <td style="padding: 4px; font-weight: bold; color: #5a102a;">Enrollment No.</td>
              <td style="padding: 4px;">:</td>
              <td style="padding: 4px; color: #222;">${data.enrolment || "-"}</td>
            </tr>

            <tr>
              <td style="padding: 4px; font-weight: bold; color: #5a102a;">Date of Birth</td>
              <td style="padding: 4px;">:</td>
              <td style="padding: 4px; color: #222;">${data.dob}</td>

              <td style="padding: 4px; font-weight: bold; color: #5a102a;">Parent Mobile</td>
              <td style="padding: 4px;">:</td>
              <td style="padding: 4px; color: #222;">${data.parentNumber}</td>
            </tr>

            <tr style="background: #fbf5ee;">
              <td style="padding: 4px; font-weight: bold; color: #5a102a; vertical-align: top;">Address</td>
              <td style="padding: 4px; vertical-align: top;">:</td>
              <td colspan="4" style="padding: 4px; color: #222; line-height: 18px;">${data.address}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- SCHOLASTIC AREAS HEADING -->
    <div style="
      margin-top: 10px;
      font-size: 14.5px;
      font-weight: bold;
      color: #5a102a;
      display: flex;
      align-items: center;
      gap: 6px;
    ">
      <span style="display:inline-block; width:4px; height:16px; background:#c4973b;"></span>
      <span>Academic Performance : Scholastic Areas</span>
    </div>

    <!-- MARKS TABLE -->
    <table style="
      width: 100%;
      margin-top: 6px;
      font-size: 11px;
      border: 1px solid #5a102a;
    ">
      <!-- HEADER ROW 1 -->
      <tr style="background: #5a102a; color: #ffffff;">
        <th rowspan="2" style="
          border: 1px solid #7d1d3f;
          padding: 6px;
          text-align: center;
          width: 20%;
          font-size: 11.5px;
        ">
          SUBJECTS
        </th>

        <th colspan="6" style="
          border: 1px solid #7d1d3f;
          padding: 5px;
          text-align: center;
          background: #721435;
        ">
          INTERNAL ASSESSMENT
        </th>

        <th colspan="3" style="
          border: 1px solid #7d1d3f;
          padding: 5px;
          text-align: center;
          background: #5a102a;
        ">
          FINAL RESULT
        </th>
      </tr>

      <!-- HEADER ROW 2 -->
      <tr style="background: #fbf5ee; color: #5a102a; font-weight: bold; font-size: 10.5px;">
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center;">Periodic Test<br>(10)</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center;">Note Book<br>(5)</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center;">Sub Enrichment<br>(5)</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center;">Practical<br>(20)</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center;">Theory<br>(80)</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center;">Total<br>(100)</th>

        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center; background: #f3e6cf;">Obtained</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center; background: #f3e6cf;">Grade</th>
        <th style="border: 1px solid #c4973b; padding: 4px; text-align: center; background: #f3e6cf;">Status</th>
      </tr>

      <!-- ROWS -->
      ${scholasticMarks
        .map(
          (m: any, i: number) => `
      <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#fdfbfa"};">
        <td style="
          border: 1px solid #dfc79b;
          padding: 5px 8px;
          font-weight: bold;
          color: #5a102a;
        ">
          ${m.subjectName}
        </td>

        <td style="border: 1px solid #dfc79b; text-align: center;">${m.periodic_test}</td>
        <td style="border: 1px solid #dfc79b; text-align: center;">${m.note_book}</td>
        <td style="border: 1px solid #dfc79b; text-align: center;">${m.subject_enrichment}</td>
        <td style="border: 1px solid #dfc79b; text-align: center;">${m.practical_marks}</td>
        <td style="border: 1px solid #dfc79b; text-align: center;">${m.theory_marks}</td>
        <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">100</td>

        <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #111;">
          ${m.obtained_marks}
        </td>

        <td style="border: 1px solid #dfc79b; text-align: center;">
          <span style="
            display: inline-block;
            padding: 1px 7px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
            ${getGradeStyle(m.grade)}
          ">
            ${m.grade}
          </span>
        </td>

        <td style="
          border: 1px solid #dfc79b;
          text-align: center;
          font-weight: bold;
          color: ${m.obtained_marks >= 33 ? "#1e6b37" : "#a93226"};
        ">
          ${m.obtained_marks >= 33 ? "PASS" : "FAIL"}
        </td>
      </tr>
      `
        )
        .join("")}
    </table>

    <!-- CO-SCHOLASTIC & GRADING SYSTEM -->
    <div style="display: flex; gap: 10px; margin-top: 10px;">

      <!-- CO-SCHOLASTIC (LEFT) -->
      <div style="flex: 1;">
        <!-- ACTIVITIES -->
        <div style="font-size: 12.5px; font-weight: bold; color: #5a102a; margin-bottom: 4px;">
          Co-Scholastic Activities
        </div>
        <table style="width: 100%; font-size: 11px; border: 1px solid #5a102a;">
          <tr style="background: #5a102a; color: #ffffff;">
            <th style="border: 1px solid #7d1d3f; padding: 4px 6px; text-align: left;">Activity</th>
            <th style="border: 1px solid #7d1d3f; padding: 4px; text-align: center; width: 75px;">Grade</th>
          </tr>
         ${[
  ...(data.activity ?? []),
  ...coScholasticMarks.map((m: any) => ({
    subjectName: m.subjectName,
    grade: m.grade,
  })),
]
            ?.map(
              (item: any, i: number) => `
          <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#fdfbfa"};">
            <td style="border: 1px solid #dfc79b; padding: 3px 6px;">${item.subjectName}</td>
            <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">
              ${item.grade}
            </td>
          </tr>
          `
            )
            .join("")}
        </table>

        <!-- 3-POINT SKILLS -->
        <div style="font-size: 12.5px; font-weight: bold; color: #5a102a; margin: 8px 0 4px;">
          Co-Scholastic Areas [3-Point Scale]
        </div>
        <table style="width: 100%; font-size: 11px; border: 1px solid #5a102a;">
          <tr style="background: #5a102a; color: #ffffff;">
            <th style="border: 1px solid #7d1d3f; padding: 4px 6px; text-align: left;">Skill</th>
            <th style="border: 1px solid #7d1d3f; padding: 4px; text-align: center; width: 75px;">Grade</th>
          </tr>
          ${data.skills
            ?.map(
              (item: any, i: number) => `
          <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#fdfbfa"};">
            <td style="border: 1px solid #dfc79b; padding: 3px 6px;">${item.subjectName}</td>
            <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">
              ${item.grade}
            </td>
          </tr>
          `
            )
            .join("")}
        </table>
      </div>

      <!-- GRADING SCALE TABLE (RIGHT) -->
      <div style="width: 165px; flex-shrink: 0;">
        <div style="font-size: 12.5px; font-weight: bold; color: #5a102a; margin-bottom: 4px;">
          Grading Scale
        </div>
        <table style="width: 100%; font-size: 10.5px; border: 1px solid #5a102a;">
          <tr style="background: #5a102a; color: #ffffff;">
            <th style="border: 1px solid #7d1d3f; padding: 4px; text-align: center;">Marks Range</th>
            <th style="border: 1px solid #7d1d3f; padding: 4px; text-align: center;">Grade</th>
          </tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">91 - 100</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1e6b37;">A1</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">81 - 90</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1e6b37;">A2</td></tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">71 - 80</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1b4f72;">B1</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">61 - 70</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1b4f72;">B2</td></tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">51 - 60</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #8c6d1f;">C1</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">41 - 50</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #8c6d1f;">C2</td></tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">33 - 40</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #935116;">D</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 2px;">32 & Below</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #900c3f;">E</td></tr>
        </table>
      </div>
    </div>

    <!-- SUMMARY PERFORMANCE BANNER -->
    <div style="
      margin-top: 10px;
      border: 2px solid #5a102a;
      border-radius: 4px;
      display: flex;
      background: #fbf5ee;
      overflow: hidden;
    ">
      <div style="
        flex: 1;
        text-align: center;
        padding: 6px;
        border-right: 1px solid #c4973b;
      ">
        <div style="font-size: 10.5px; color: #666; font-weight: bold;">TOTAL MARKS</div>
        <div style="font-size: 17px; font-weight: bold; color: #5a102a; margin-top: 2px;">
          ${data.totalMarks} / ${data.allsubjecttotal}
        </div>
      </div>

      <div style="
        flex: 1;
        text-align: center;
        padding: 6px;
        border-right: 1px solid #c4973b;
      ">
        <div style="font-size: 10.5px; color: #666; font-weight: bold;">PERCENTAGE</div>
        <div style="font-size: 17px; font-weight: bold; color: #5a102a; margin-top: 2px;">
          ${Number(data.percentage).toFixed(2)}%
        </div>
      </div>

      <div style="
        flex: 1;
        text-align: center;
        padding: 6px;
        border-right: 1px solid #c4973b;
      ">
        <div style="font-size: 10.5px; color: #666; font-weight: bold;">OVERALL GRADE</div>
        <div style="font-size: 17px; font-weight: bold; color: #5a102a; margin-top: 2px;">
          ${data.overallGrade}
        </div>
      </div>

      <div style="
        flex: 1;
        text-align: center;
        padding: 6px;
        background: ${data.status === "Pass" ? "#e9f7ef" : "#f9ebea"};
      ">
        <div style="font-size: 10.5px; color: #666; font-weight: bold;">RESULT</div>
        <div style="
          font-size: 17px;
          font-weight: bold;
          margin-top: 2px;
          color: ${data.status === "Pass" ? "#1e6b37" : "#a93226"};
        ">
          ${data.status.toUpperCase()}
        </div>
      </div>
    </div>

    <!-- REMARKS -->
    <div style="
      margin-top: 9px;
      border: 1px solid #dfc79b;
      background: #fffdfa;
      border-radius: 4px;
      padding: 7px 12px;
      text-align: center;
    ">
      <span style="font-size: 12px; font-weight: bold; color: #5a102a;">
        Class Teacher Remarks :
      </span>
      <span style="font-size: 13.5px; font-style: italic; color: #222; margin-left: 6px;">
        "${getRemark()}"
      </span>
    </div>

    <!-- SIGNATURE & FOOTER -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 18px;
      padding-top: 4px;
    ">
      <!-- DATE & QR -->
      <div>
        <div style="font-size: 11px; font-weight: bold; color: #5a102a; margin-bottom: 6px;">
          Date : ${data.date}
        </div>
        <img
          src="${data.qr}"
          crossorigin="anonymous"
          style="
            width: 70px;
            height: 70px;
            object-fit: contain;
            border: 1px solid #dfc79b;
            padding: 2px;
          "
        />
      </div>

      <!-- CLASS TEACHER -->
      <div style="text-align: center; width: 140px;">
        <div style="height: 35px;"></div>
        <div style="
          border-top: 1.5px solid #5a102a;
          padding-top: 4px;
          font-size: 12px;
          font-weight: bold;
          color: #5a102a;
        ">
          Class Teacher
        </div>
      </div>

      <!-- PRINCIPAL -->
      <div style="text-align: center; width: 160px;">
        <img
          src="${data.principalSignature}"
          crossorigin="anonymous"
          style="
            width: 140px;
            height: 40px;
            object-fit: contain;
            mix-blend-mode: multiply;
          "
        />
        <div style="
          border-top: 1.5px solid #5a102a;
          padding-top: 4px;
          font-size: 12px;
          font-weight: bold;
          color: #5a102a;
        ">
          Principal
        </div>
      </div>
    </div>

  </div>
</div>

</body>
</html>
`;
};


// =========================================================================================
// 2. ANNUAL COMBINED MARKSHEET (TERM I + TERM II)
// =========================================================================================
export const generateAnnualMarksheet2 = (
  term1: any,
  term2: any
) => {

    const isCoScholastic = (type?: string) =>
    type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ??
    false;

  const term1ScholasticMarks = (term1.marks ?? []).filter(
    (m: any) => !isCoScholastic(m.subjectType)
  );

  const term2ScholasticMarks = (term2.marks ?? []).filter(
    (m: any) => !isCoScholastic(m.subjectType)
  );

  const term1CoScholasticMarks = (term1.marks ?? []).filter(
    (m: any) => isCoScholastic(m.subjectType)
  );

  const term2CoScholasticMarks = (term2.marks ?? []).filter(
    (m: any) => isCoScholastic(m.subjectType)
  );

  const getRemark = () => {
    const percentage =
      (Number(term1.percentage) + Number(term2.percentage)) / 2;

    if (percentage >= 90) return "Outstanding performance! Keep shining.";
    if (percentage >= 75) return "Excellent performance! Keep up the good work.";
    if (percentage >= 60) return "Good job! You are doing well.";
    if (percentage >= 40) return "Satisfactory performance. Keep improving.";
    return "Needs improvement. Focus more on studies.";
  };

  const getGradeStyle = (grade: string) => {
    if (["A1", "A2"].includes(grade)) return "background:#1e6b37; color:#ffffff;";
    if (["B1", "B2"].includes(grade)) return "background:#1b4f72; color:#ffffff;";
    if (["C1", "C2"].includes(grade)) return "background:#8c6d1f; color:#ffffff;";
    if (grade === "D") return "background:#935116; color:#ffffff;";
    return "background:#900c3f; color:#ffffff;";
  };

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
  font-family: 'Times New Roman', serif;
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

<!-- OUTER CERTIFICATE BORDER -->
<div style="
  width: 100%;
  border: 4px solid #5a102a;
  background: #ffffff;
  position: relative;
">
  <!-- INNER ACCENT BORDER -->
  <div style="
    margin: 2px;
    border: 1.5px solid #c4973b;
    padding: 7px;
  ">

    <!-- HEADER SECTION -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 6px;
      border-bottom: 2px solid #5a102a;
    ">
      <!-- LEFT LOGO -->
      <div style="
        width: 72px;
        height: 72px;
        border: 2px solid #c4973b;
        border-radius: 6px;
        padding: 2px;
        background: #ffffff;
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

      <!-- CENTER INFO -->
      <div style="flex: 1; text-align: center; padding: 0 10px;">
        <div style="
          font-size: 27px;
          font-weight: bold;
          color: #5a102a;
          letter-spacing: 0.8px;
          line-height: 1.15;
          text-transform: uppercase;
        ">
          ${term1.instituteName}
        </div>

        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 3px 0;
        ">
          <span style="height: 1px; width: 45px; background: #c4973b;"></span>
          <span style="color: #c4973b; font-size: 11px;">✦ ✦ ✦</span>
          <span style="height: 1px; width: 45px; background: #c4973b;"></span>
        </div>

        <div style="font-size: 11.5px; color: #444444;">
          ${term1.instituteAdress || ""}
        </div>

        <div style="font-size: 11px; color: #555555; margin-top: 1px;">
          Ph. ${term1.institutePhone || ""}
        </div>

        <!-- REPORT CARD PILL -->
        <div style="
          display: inline-block;
          margin-top: 5px;
          background: #5a102a;
          color: #ffffff;
          padding: 2px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: bold;
          letter-spacing: 2px;
          border: 1px solid #c4973b;
        ">
          ANNUAL REPORT CARD
        </div>
      </div>

      <!-- RIGHT LOGO -->
      <div style="
        width: 72px;
        height: 72px;
        border: 2px solid #c4973b;
        border-radius: 50%;
        padding: 2px;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      ">
        <img
          src="${term1.instituteLogo}"
          crossorigin="anonymous"
          style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;"
        />
      </div>
    </div>

    <!-- META BAR -->
    <div style="
      background: #fbf5ee;
      border: 1px solid #dfc79b;
      margin-top: 5px;
      padding: 4px 10px;
      display: flex;
      justify-content: space-around;
      font-size: 12px;
      font-weight: bold;
      color: #5a102a;
    ">
      <span>Class : ${term1.batchName}</span>
      <span>|</span>
      <span>Sec : ${term1.section || "A"}</span>
      <span>|</span>
      <span>Session : ${term1.session}</span>
    </div>

    <!-- STUDENT PROFILE BOX -->
    <div style="
      margin-top: 6px;
      border: 1.5px solid #5a102a;
      border-radius: 4px;
      overflow: hidden;
    ">
      <!-- TITLE -->
      <div style="
        background: #5a102a;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: bold;
        text-align: center;
        padding: 3px;
        letter-spacing: 1px;
      ">
        STUDENT PROFILE
      </div>

      <!-- BODY -->
      <div style="
        display: flex;
        background: #fffdfa;
        padding: 6px 10px;
        gap: 12px;
        align-items: center;
      ">
        <!-- PHOTO -->
        <div style="
          width: 82px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        ">
          <img
            src="${term1.photo}"
            crossorigin="anonymous"
            style="
              width: 76px;
              height: 90px;
              border: 1.5px solid #5a102a;
              border-radius: 3px;
              object-fit: cover;
            "
          />
        </div>

        <!-- DETAILS TABLE -->
        <div style="flex: 1;">
          <table style="width: 100%; font-size: 11px;">
            <tr>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a; width: 18%;">Admission No.</td>
              <td style="padding: 2px;">: ${term1.enrolment || "-"}</td>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a; width: 18%;">Roll No</td>
              <td style="padding: 2px;">: ${term1.rollNumber}</td>
            </tr>

            <tr style="background: #fbf5ee;">
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a;">Student Name</td>
              <td style="padding: 2px; font-weight: bold; color: #111;">: ${term1.studentName}</td>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a;">DOB</td>
              <td style="padding: 2px;">: ${term1.dob}</td>
            </tr>

            <tr>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a;">Father Name</td>
              <td style="padding: 2px;">: ${term1.fName}</td>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a;">Mother Name</td>
              <td style="padding: 2px;">: ${term1.mName || "-"}</td>
            </tr>

            <tr style="background: #fbf5ee;">
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a;">Mobile</td>
              <td style="padding: 2px;">: ${term1.parentNumber}</td>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a;">Attendance</td>
              <td style="padding: 2px;">: ${term1.attendance || "-"}</td>
            </tr>

            <tr>
              <td style="padding: 2px 4px; font-weight: bold; color: #5a102a; vertical-align: top;">Address</td>
              <td colspan="3" style="padding: 2px;">: ${term1.address}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- SCHOLASTIC AREAS HEADING -->
    <div style="
      margin-top: 7px;
      font-size: 13px;
      font-weight: bold;
      color: #5a102a;
      display: flex;
      align-items: center;
      gap: 5px;
    ">
      <span style="display:inline-block; width:3.5px; height:14px; background:#c4973b;"></span>
      <span>Academic Performance : Scholastic Areas</span>
    </div>

    <!-- MARKS TABLE -->
    <table style="
      width: 100%;
      margin-top: 4px;
      font-size: 10px;
      border: 1px solid #5a102a;
    ">
      <!-- MAIN HEADER -->
      <tr style="background: #5a102a; color: #ffffff;">
        <th rowspan="2" style="
          border: 1px solid #7d1d3f;
          padding: 4px;
          width: 17%;
          font-size: 10.5px;
        ">
          SUBJECTS
        </th>

        <th colspan="6" style="
          border: 1px solid #7d1d3f;
          padding: 3px;
          text-align: center;
          background: #721435;
        ">
          TERM — I
        </th>

        <th colspan="6" style="
          border: 1px solid #7d1d3f;
          padding: 3px;
          text-align: center;
          background: #5a102a;
        ">
          TERM — II
        </th>
      </tr>

      <!-- SUB HEADER -->
      <tr style="background: #fbf5ee; color: #5a102a; font-weight: bold; font-size: 9.5px;">
        <!-- TERM 1 -->
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">PT</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">NB</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">SE</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">Theory</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center; background: #f3e6cf;">Marks</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center; background: #f3e6cf;">Grade</th>

        <!-- TERM 2 -->
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">PT</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">NB</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">SE</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center;">Theory</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center; background: #f3e6cf;">Marks</th>
        <th style="border: 1px solid #c4973b; padding: 2px; text-align: center; background: #f3e6cf;">Grade</th>
      </tr>

      <!-- ROWS -->
      ${term1ScholasticMarks
  .map((m1: any, i: number) => {
    const m2 = term2ScholasticMarks.find(
      (x: any) => x.subjectName === m1.subjectName
    );

          return `
          <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#fdfbfa"};">
            <td style="
              border: 1px solid #dfc79b;
              padding: 3px 6px;
              font-weight: bold;
              color: #5a102a;
            ">
              ${m1.subjectName}
            </td>

            <!-- TERM 1 -->
            <td style="border: 1px solid #dfc79b; text-align: center;">${m1.periodic_test}</td>
            <td style="border: 1px solid #dfc79b; text-align: center;">${m1.note_book}</td>
            <td style="border: 1px solid #dfc79b; text-align: center;">${m1.subject_enrichment}</td>
            <td style="border: 1px solid #dfc79b; text-align: center;">${m1.theory_marks}</td>
            <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #111;">
              ${m1.obtained_marks}
            </td>
            <td style="border: 1px solid #dfc79b; text-align: center;">
              <span style="
                display: inline-block;
                padding: 1px 6px;
                border-radius: 8px;
                font-size: 9px;
                font-weight: bold;
                ${getGradeStyle(m1.grade)}
              ">
                ${m1.grade}
              </span>
            </td>

            <!-- TERM 2 -->
            <td style="border: 1px solid #dfc79b; text-align: center;">${m2?.periodic_test || "-"}</td>
            <td style="border: 1px solid #dfc79b; text-align: center;">${m2?.note_book || "-"}</td>
            <td style="border: 1px solid #dfc79b; text-align: center;">${m2?.subject_enrichment || "-"}</td>
            <td style="border: 1px solid #dfc79b; text-align: center;">${m2?.theory_marks || "-"}</td>
            <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #111;">
              ${m2?.obtained_marks || "-"}
            </td>
            <td style="border: 1px solid #dfc79b; text-align: center;">
              ${
                m2?.grade
                  ? `<span style="
                      display: inline-block;
                      padding: 1px 6px;
                      border-radius: 8px;
                      font-size: 9px;
                      font-weight: bold;
                      ${getGradeStyle(m2.grade)}
                    ">${m2.grade}</span>`
                  : "-"
              }
            </td>
          </tr>
          `;
        })
        .join("")}
    </table>

    <!-- CO-SCHOLASTIC & SKILLS & GRADING SYSTEM -->
    <div style="display: flex; gap: 8px; margin-top: 6px;">

      <!-- LEFT: CO-SCHOLASTIC + SKILLS + DISCIPLINE -->
      <div style="flex: 1;">

        <!-- ACTIVITIES -->
        <div style="font-size: 11.5px; font-weight: bold; color: #5a102a; margin-bottom: 2px;">
          Co-Scholastic Activities
        </div>
        <table style="width: 100%; font-size: 9.5px; border: 1px solid #5a102a;">
          <tr style="background: #5a102a; color: #ffffff;">
            <th style="border: 1px solid #7d1d3f; padding: 2px 5px; text-align: left;">Activity</th>
            <th style="border: 1px solid #7d1d3f; padding: 2px; text-align: center; width: 65px;">Term I</th>
            <th style="border: 1px solid #7d1d3f; padding: 2px; text-align: center; width: 65px;">Term II</th>
          </tr>

             ${[
  ...(term1.activity ?? []),
  ...term1CoScholasticMarks.map((m: any) => ({
    subjectName: m.subjectName,
    grade: m.grade,
  })),
]
  .map((a1: any, i: number) => {
    const a2 =
      (term2.activity ?? []).find(
        (x: any) => x.subjectName === a1.subjectName
      ) ??
      term2CoScholasticMarks.find(
        (x: any) => x.subjectName === a1.subjectName
      );

              return `
              <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#fdfbfa"};">
                <td style="border: 1px solid #dfc79b; padding: 2px 5px; font-weight: bold; color: #333;">
                  ${a1.subjectName}
                </td>
                <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">
                  ${a1.grade}
                </td>
                <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">
                  ${a2?.grade || "-"}
                </td>
              </tr>
              `;
            })
            .join("")}
        </table>

        <!-- SKILLS 3-POINT SCALE -->
        <div style="font-size: 11.5px; font-weight: bold; color: #5a102a; margin: 4px 0 2px;">
          Co-Scholastic Areas [3-Point Scale]
        </div>
        <table style="width: 100%; font-size: 9.5px; border: 1px solid #5a102a;">
          <tr style="background: #5a102a; color: #ffffff;">
            <th style="border: 1px solid #7d1d3f; padding: 2px 5px; text-align: left;">Skill</th>
            <th style="border: 1px solid #7d1d3f; padding: 2px; text-align: center; width: 65px;">Term I</th>
            <th style="border: 1px solid #7d1d3f; padding: 2px; text-align: center; width: 65px;">Term II</th>
          </tr>

          ${term1.skills
            ?.map((s1: any, i: number) => {
              const s2 = term2.skills.find(
                (x: any) => x.subjectName === s1.subjectName
              );

              return `
              <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#fdfbfa"};">
                <td style="border: 1px solid #dfc79b; padding: 2px 5px; font-weight: bold; color: #333;">
                  ${s1.subjectName}
                </td>
                <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">
                  ${s1.grade}
                </td>
                <td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #5a102a;">
                  ${s2?.grade || "-"}
                </td>
              </tr>
              `;
            })
            .join("")}
        </table>

        <!-- DISCIPLINE -->
        <table style="width: 100%; font-size: 9.5px; margin-top: 3px; border: 1px solid #5a102a;">
          <tr style="background: #fbf5ee;">
            <td style="border: 1px solid #dfc79b; padding: 2px 5px; font-weight: bold; color: #5a102a;">
              DISCIPLINE
            </td>
            <td style="border: 1px solid #dfc79b; text-align: center; width: 65px; font-weight: bold; color: #1e6b37;">
              A
            </td>
            <td style="border: 1px solid #dfc79b; text-align: center; width: 65px; font-weight: bold; color: #1e6b37;">
              A
            </td>
          </tr>
        </table>

      </div>

      <!-- RIGHT: GRADING SYSTEM TABLE -->
      <div style="width: 155px; flex-shrink: 0;">
        <div style="font-size: 11.5px; font-weight: bold; color: #5a102a; margin-bottom: 2px;">
          Grading Scale
        </div>
        <table style="width: 100%; font-size: 9.5px; border: 1px solid #5a102a;">
          <tr style="background: #5a102a; color: #ffffff;">
            <th style="border: 1px solid #7d1d3f; padding: 2px; text-align: center;">Range</th>
            <th style="border: 1px solid #7d1d3f; padding: 2px; text-align: center;">Grade</th>
          </tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">91 - 100</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1e6b37;">A1</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">81 - 90</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1e6b37;">A2</td></tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">71 - 80</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1b4f72;">B1</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">61 - 70</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #1b4f72;">B2</td></tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">51 - 60</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #8c6d1f;">C1</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">41 - 50</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #8c6d1f;">C2</td></tr>
          <tr><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">33 - 40</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #935116;">D</td></tr>
          <tr style="background: #fdfbfa;"><td style="border: 1px solid #dfc79b; text-align: center; padding: 1.5px;">32 & Below</td><td style="border: 1px solid #dfc79b; text-align: center; font-weight: bold; color: #900c3f;">E</td></tr>
        </table>
      </div>

    </div>

    <!-- REMARKS -->
    <div style="
      margin-top: 6px;
      border: 1px solid #dfc79b;
      background: #fffdfa;
      border-radius: 4px;
      padding: 5px 10px;
      text-align: center;
    ">
      <span style="font-size: 11.5px; font-weight: bold; color: #5a102a;">
        Class Teacher Remarks :
      </span>
      <span style="font-size: 12.5px; font-style: italic; color: #222; margin-left: 5px;">
        "${getRemark()}"
      </span>
    </div>

    <!-- FOOTER SIGNATURES -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 14px;
    ">
      <!-- DATE -->
      <div style="font-size: 10.5px; font-weight: bold; color: #5a102a;">
        Dated : ${term2.date}
      </div>

      <!-- CLASS TEACHER -->
      <div style="text-align: center; width: 130px;">
        <div style="height: 30px;"></div>
        <div style="
          border-top: 1.5px solid #5a102a;
          padding-top: 3px;
          font-size: 11px;
          font-weight: bold;
          color: #5a102a;
        ">
          Class Teacher
        </div>
      </div>

      <!-- PRINCIPAL -->
      <div style="text-align: center; width: 130px;">
        <div style="height: 30px;"></div>
        <div style="
          border-top: 1.5px solid #5a102a;
          padding-top: 3px;
          font-size: 11px;
          font-weight: bold;
          color: #5a102a;
        ">
          Principal
        </div>
      </div>
    </div>

  </div>
</div>

</body>
</html>
`;
};