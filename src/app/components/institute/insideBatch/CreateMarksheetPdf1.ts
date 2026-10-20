// =====================================================================
//  DESIGN 1 : Mid-Term Marksheet  (single term)
//  Modern Blue-Gold theme with accent strips and elegant layout
// =====================================================================

export const generateMidTermMarksheet1 = (data: any) => {
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

  const getResultColor = () =>
    data.status === "Pass" ? "#1a7a4a" : "#c0392b";

  const getGradeBadgeColor = (grade: string) => {
    if (["A1", "A2"].includes(grade)) return "#1a6b3c";
    if (["B1", "B2"].includes(grade)) return "#1a4fa0";
    if (["C1", "C2"].includes(grade)) return "#7d6608";
    if (grade === "D") return "#8e4000";
    return "#8b0000";
  };

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>

@page {
  size: A4;
  margin: 7mm;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman', serif;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

</style>
</head>
<body>

<!-- OUTER WRAPPER -->
<div style="
  width: 100%;
  border: 5px double #1a3a6b;
  background: #fff;
  position: relative;
  overflow: hidden;
">

  <!-- TOP DECORATIVE STRIPE -->
  <div style="
    height: 10px;
    background: linear-gradient(90deg, #1a3a6b 0%, #c9a84c 50%, #1a3a6b 100%);
  "></div>

  <!-- HEADER SECTION -->
  <div style="
    background: linear-gradient(135deg, #1a3a6b 0%, #2d5fa6 60%, #1a3a6b 100%);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  ">

    <!-- LEFT LOGO -->
    <div style="
      width: 85px;
      height: 85px;
      background: #fff;
      border-radius: 50%;
      border: 3px solid #c9a84c;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    ">
      <img
        src="${data.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>

    <!-- CENTER TEXT -->
    <div style="
      flex: 1;
      text-align: center;
      padding: 0 20px;
      color: #fff;
    ">
      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 1px;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
        line-height: 1.2;
      ">${data.instituteName}</div>

      <div style="
        width: 60%;
        height: 2px;
        background: #c9a84c;
        margin: 6px auto;
      "></div>

      <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">
        ${data.instituteAdress || ""}
      </div>
      <div style="font-size: 12px; opacity: 0.85; margin-top: 2px;">
        ☎ ${data.institutePhone || "N/A"}
      </div>

      <div style="
        margin-top: 10px;
        background: #c9a84c;
        display: inline-block;
        padding: 4px 24px;
        border-radius: 20px;
        font-size: 18px;
        font-weight: bold;
        color: #1a3a6b;
        letter-spacing: 2px;
      ">
        REPORT CARD
      </div>
    </div>

    <!-- RIGHT LOGO -->
    <div style="
      width: 85px;
      height: 85px;
      background: #fff;
      border-radius: 8px;
      border: 3px solid #c9a84c;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
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
    background: #f0f4fc;
    border-bottom: 2px solid #c9a84c;
    display: flex;
    justify-content: center;
    gap: 50px;
    padding: 7px 0;
    font-size: 14px;
    font-weight: bold;
    color: #1a3a6b;
  ">
    <span>📚 Class : ${data.batchName}</span>
    <span>🏫 Section : ${data.section || "A"}</span>
    <span>📅 Session : ${data.session}</span>
    <span>📝 Exam : ${data.examName}</span>
  </div>

  <!-- MAIN CONTENT AREA -->
  <div style="padding: 12px 16px;">

    <!-- STUDENT PROFILE CARD -->
    <div style="
      border: 2px solid #1a3a6b;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 14px;
    ">

      <!-- Profile Header -->
      <div style="
        background: linear-gradient(90deg, #1a3a6b, #2d5fa6);
        color: #fff;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        padding: 6px;
        letter-spacing: 1px;
      ">
        ▌ STUDENT PROFILE ▐
      </div>

      <!-- Profile Content -->
      <div style="
        display: flex;
        gap: 0;
        background: linear-gradient(135deg, #f8f9fd 0%, #eef2fb 100%);
      ">

        <!-- PHOTO -->
        <div style="
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-right: 2px solid #c9a84c;
          flex-shrink: 0;
        ">
          <img
            src="${data.photo}"
            crossorigin="anonymous"
            style="
              width: 120px;
              height: 140px;
              object-fit: cover;
              border: 3px solid #1a3a6b;
              border-radius: 6px;
            "
          />
          <div style="
            margin-top: 6px;
            font-size: 11px;
            font-weight: bold;
            color: #1a3a6b;
            text-align: center;
          ">Roll No: ${data.rollNumber}</div>
        </div>

        <!-- DETAILS TABLE -->
        <div style="flex: 1; padding: 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">

            <tr>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b; width: 22%;">Student Name</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; font-weight: bold; color: #111; width: 28%;">${data.studentName}</td>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b; width: 22%;">Enrollment No.</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.enrolment || "-"}</td>
            </tr>

            <tr style="background: rgba(26,58,107,0.04);">
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b;">Father's Name</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.fName}</td>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b;">Date of Birth</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.dob}</td>
            </tr>

            <tr>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b;">Class</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.batchName}</td>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b;">Section</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.section || "A"}</td>
            </tr>

            <tr style="background: rgba(26,58,107,0.04);">
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b;">Session</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.session}</td>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b;">Parent Mobile</td>
              <td style="padding: 5px 4px; color: #555;">:</td>
              <td style="padding: 5px 8px; color: #333;">${data.parentNumber}</td>
            </tr>

            <tr>
              <td style="padding: 5px 8px; font-weight: bold; color: #1a3a6b; vertical-align: top;">Address</td>
              <td style="padding: 5px 4px; color: #555; vertical-align: top;">:</td>
              <td colspan="4" style="padding: 5px 8px; color: #333;">${data.address}</td>
            </tr>

          </table>
        </div>

      </div>
    </div>

    <!-- ACADEMIC PERFORMANCE -->
    <div style="
      font-size: 16px;
      font-weight: bold;
      color: #1a3a6b;
      border-left: 5px solid #c9a84c;
      padding-left: 10px;
      margin-bottom: 8px;
    ">
      Academic Performance — Scholastic Areas
    </div>

    <table style="
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      border: 2px solid #1a3a6b;
    ">

      <!-- HEADER ROW 1 -->
      <tr style="background: linear-gradient(90deg, #1a3a6b, #2d5fa6); color: #fff;">
        <th rowspan="2" style="
          border: 1px solid #4a7abf;
          padding: 7px 6px;
          text-align: center;
          width: 19%;
          font-size: 13px;
        ">SUBJECTS</th>

        <th colspan="6" style="
          border: 1px solid #4a7abf;
          padding: 6px;
          text-align: center;
          background: rgba(201,168,76,0.25);
        ">INTERNAL ASSESSMENT</th>

        <th colspan="3" style="
          border: 1px solid #4a7abf;
          padding: 6px;
          text-align: center;
        ">FINAL RESULT</th>
      </tr>

      <!-- HEADER ROW 2 -->
      <tr style="background: #2d5fa6; color: #e8f0ff; font-size: 11px;">
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Periodic Test<br><span style="color:#c9a84c;">(10)</span>
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Note Book<br><span style="color:#c9a84c;">(5)</span>
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Sub. Enrichment<br><span style="color:#c9a84c;">(5)</span>
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Practical<br><span style="color:#c9a84c;">(20)</span>
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Theory<br><span style="color:#c9a84c;">(80)</span>
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Total<br><span style="color:#c9a84c;">(100)</span>
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Obtained
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Grade
        </th>
        <th style="border: 1px solid #4a7abf; padding: 5px 4px; text-align: center;">
          Result
        </th>
      </tr>

      <!-- MARKS ROWS -->
      ${data.marks
        .map(
          (m: any, i: number) => `
      <tr style="background: ${i % 2 === 0 ? "#fff" : "#f0f4fc"};">
        <td style="
          border: 1px solid #b0c4de;
          padding: 6px 8px;
          font-weight: bold;
          color: #1a3a6b;
        ">${m.subjectName}</td>

        <td style="border: 1px solid #b0c4de; text-align: center; color: #333;">${m.periodic_test}</td>
        <td style="border: 1px solid #b0c4de; text-align: center; color: #333;">${m.note_book}</td>
        <td style="border: 1px solid #b0c4de; text-align: center; color: #333;">${m.subject_enrichment}</td>
        <td style="border: 1px solid #b0c4de; text-align: center; color: #333;">${m.practical_marks}</td>
        <td style="border: 1px solid #b0c4de; text-align: center; color: #333;">${m.theory_marks}</td>
        <td style="border: 1px solid #b0c4de; text-align: center; font-weight: bold; color: #1a3a6b;">100</td>

        <td style="border: 1px solid #b0c4de; text-align: center; font-weight: bold; color: #1a3a6b;">
          ${m.obtained_marks}
        </td>

        <td style="border: 1px solid #b0c4de; text-align: center;">
          <span style="
            background: ${getGradeBadgeColor(m.grade)};
            color: #fff;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 11px;
          ">${m.grade}</span>
        </td>

        <td style="
          border: 1px solid #b0c4de;
          text-align: center;
          font-weight: bold;
          color: ${m.obtained_marks >= 33 ? "#1a7a4a" : "#c0392b"};
        ">
          ${m.obtained_marks >= 33 ? "PASS" : "FAIL"}
        </td>
      </tr>
      `
        )
        .join("")}

    </table>

    <!-- CO-SCHOLASTIC + GRADE SYSTEM ROW -->
    <div style="display: flex; gap: 14px; margin-top: 14px;">

      <!-- CO-SCHOLASTIC ACTIVITY -->
      <div style="flex: 1;">
        <div style="
          font-size: 15px;
          font-weight: bold;
          color: #1a3a6b;
          border-left: 5px solid #c9a84c;
          padding-left: 10px;
          margin-bottom: 6px;
        ">Co-Scholastic Activities</div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background: linear-gradient(90deg, #1a3a6b, #2d5fa6); color: #fff;">
            <th style="border: 1px solid #4a7abf; padding: 6px 8px; text-align: left;">Activity</th>
            <th style="border: 1px solid #4a7abf; padding: 6px 8px; text-align: center; width: 80px;">Grade</th>
          </tr>
          ${data.activity
            ?.map(
              (item: any, i: number) => `
          <tr style="background: ${i % 2 === 0 ? "#fff" : "#f0f4fc"};">
            <td style="border: 1px solid #b0c4de; padding: 5px 8px; color: #333;">${item.subjectName}</td>
            <td style="border: 1px solid #b0c4de; text-align: center;">
              <span style="
                background: ${getGradeBadgeColor(item.grade)};
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-weight: bold;
                font-size: 11px;
              ">${item.grade}</span>
            </td>
          </tr>
          `
            )
            .join("")}
        </table>

        <!-- SKILLS -->
        <div style="
          font-size: 15px;
          font-weight: bold;
          color: #1a3a6b;
          border-left: 5px solid #c9a84c;
          padding-left: 10px;
          margin: 10px 0 6px;
        ">Co-Scholastic Areas [3-Point Scale]</div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background: linear-gradient(90deg, #1a3a6b, #2d5fa6); color: #fff;">
            <th style="border: 1px solid #4a7abf; padding: 6px 8px; text-align: left;">Skill</th>
            <th style="border: 1px solid #4a7abf; padding: 6px 8px; text-align: center; width: 80px;">Grade</th>
          </tr>
          ${data.skills
            ?.map(
              (item: any, i: number) => `
          <tr style="background: ${i % 2 === 0 ? "#fff" : "#f0f4fc"};">
            <td style="border: 1px solid #b0c4de; padding: 5px 8px; color: #333;">${item.subjectName}</td>
            <td style="border: 1px solid #b0c4de; text-align: center;">
              <span style="
                background: ${getGradeBadgeColor(item.grade)};
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-weight: bold;
                font-size: 11px;
              ">${item.grade}</span>
            </td>
          </tr>
          `
            )
            .join("")}
        </table>
      </div>

      <!-- GRADE SYSTEM TABLE -->
      <div style="width: 175px; flex-shrink: 0;">
        <div style="
          font-size: 15px;
          font-weight: bold;
          color: #1a3a6b;
          border-left: 5px solid #c9a84c;
          padding-left: 10px;
          margin-bottom: 6px;
        ">Grade Scale</div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background: linear-gradient(90deg, #1a3a6b, #2d5fa6); color: #fff;">
            <th style="border: 1px solid #4a7abf; padding: 5px; text-align: center;">Marks Range</th>
            <th style="border: 1px solid #4a7abf; padding: 5px; text-align: center;">Grade</th>
          </tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#d4edda;color:#155724;font-weight:bold;">91 – 100</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#d4edda;color:#155724;">A1</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#d4edda;color:#155724;">81 – 90</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#d4edda;color:#155724;">A2</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#cce5ff;color:#004085;">71 – 80</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#cce5ff;color:#004085;">B1</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#cce5ff;color:#004085;">61 – 70</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#cce5ff;color:#004085;">B2</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#fff3cd;color:#856404;">51 – 60</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#fff3cd;color:#856404;">C1</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#fff3cd;color:#856404;">41 – 50</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#fff3cd;color:#856404;">C2</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#ffe5d0;color:#7d3c00;">33 – 40</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#ffe5d0;color:#7d3c00;">D</td></tr>
          <tr><td style="border:1px solid #b0c4de;text-align:center;padding:4px;background:#f8d7da;color:#721c24;">32 &amp; Below</td><td style="border:1px solid #b0c4de;text-align:center;font-weight:bold;background:#f8d7da;color:#721c24;">E</td></tr>
        </table>
      </div>

    </div>

    <!-- RESULT SUMMARY BANNER -->
    <div style="
      margin-top: 16px;
      display: flex;
      border: 2px solid #1a3a6b;
      border-radius: 8px;
      overflow: hidden;
    ">
      <div style="
        flex: 1;
        text-align: center;
        padding: 10px 6px;
        background: #f0f4fc;
        border-right: 1px solid #1a3a6b;
      ">
        <div style="font-size: 11px; color: #777; font-weight: bold; letter-spacing: 1px;">TOTAL MARKS</div>
        <div style="font-size: 22px; font-weight: bold; color: #1a3a6b; margin-top: 3px;">
          ${data.totalMarks} <span style="font-size: 14px; color: #555;">/ ${data.allsubjecttotal}</span>
        </div>
      </div>
      <div style="
        flex: 1;
        text-align: center;
        padding: 10px 6px;
        background: #f0f4fc;
        border-right: 1px solid #1a3a6b;
      ">
        <div style="font-size: 11px; color: #777; font-weight: bold; letter-spacing: 1px;">PERCENTAGE</div>
        <div style="font-size: 22px; font-weight: bold; color: #1a3a6b; margin-top: 3px;">
          ${Number(data.percentage).toFixed(2)}%
        </div>
      </div>
      <div style="
        flex: 1;
        text-align: center;
        padding: 10px 6px;
        background: #f0f4fc;
        border-right: 1px solid #1a3a6b;
      ">
        <div style="font-size: 11px; color: #777; font-weight: bold; letter-spacing: 1px;">OVERALL GRADE</div>
        <div style="margin-top: 3px;">
          <span style="
            font-size: 22px;
            font-weight: bold;
            background: ${getGradeBadgeColor(data.overallGrade)};
            color: #fff;
            padding: 2px 16px;
            border-radius: 16px;
          ">${data.overallGrade}</span>
        </div>
      </div>
      <div style="
        flex: 1;
        text-align: center;
        padding: 10px 6px;
        background: ${data.status === "Pass" ? "#d4edda" : "#f8d7da"};
      ">
        <div style="font-size: 11px; color: #777; font-weight: bold; letter-spacing: 1px;">RESULT</div>
        <div style="
          font-size: 22px;
          font-weight: bold;
          color: ${getResultColor()};
          margin-top: 3px;
        ">${data.status.toUpperCase()}</div>
      </div>
    </div>

    <!-- REMARKS -->
    <div style="
      margin-top: 14px;
      background: linear-gradient(135deg, #f0f4fc, #e8eef8);
      border: 1px solid #c9a84c;
      border-radius: 8px;
      padding: 12px 20px;
      text-align: center;
    ">
      <div style="
        font-size: 15px;
        font-weight: bold;
        color: #1a3a6b;
        letter-spacing: 1px;
        margin-bottom: 5px;
      ">✦ Class Teacher Remarks ✦</div>
      <div style="
        font-size: 16px;
        font-style: italic;
        color: #333;
      ">${getRemark()}</div>
    </div>

    <!-- FOOTER -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 28px;
    ">

      <!-- LEFT: DATE + QR -->
      <div>
        <div style="font-size: 13px; color: #444; margin-bottom: 10px;">
          <strong>Date :</strong> ${data.date}
        </div>
        <img
          src="${data.qr}"
          crossorigin="anonymous"
          style="
            width: 80px;
            height: 80px;
            object-fit: contain;
            border: 1px solid #ccc;
            padding: 3px;
          "
        />
      </div>

      <!-- CENTER: CLASS TEACHER -->
      <div style="text-align: center;">
        <div style="height: 50px;"></div>
        <div style="
          border-top: 2px solid #1a3a6b;
          width: 160px;
          padding-top: 5px;
          font-size: 13px;
          font-weight: bold;
          color: #1a3a6b;
        ">Class Teacher</div>
      </div>

      <!-- RIGHT: PRINCIPAL SIGNATURE -->
      <div style="text-align: center;">
        <img
          src="${data.principalSignature}"
          crossorigin="anonymous"
          style="
            width: 200px;
            height: 60px;
            object-fit: contain;
            mix-blend-mode: multiply;
          "
        />
        <div style="
          border-top: 2px solid #1a3a6b;
          width: 200px;
          padding-top: 5px;
          font-size: 13px;
          font-weight: bold;
          color: #1a3a6b;
          margin-top: 4px;
        ">Principal</div>
      </div>

    </div>

  </div>

  <!-- BOTTOM DECORATIVE STRIPE -->
  <div style="
    height: 10px;
    background: linear-gradient(90deg, #1a3a6b 0%, #c9a84c 50%, #1a3a6b 100%);
    margin-top: 14px;
  "></div>

</div>

</body>
</html>`;
};


// =====================================================================
//  DESIGN 2 : Annual / Combined Term Marksheet (Term I + Term II)
//  Deep Green-Gold elegance with teal accent — school-premium look
// =====================================================================

export const generateAnnualMarksheet1 = (term1: any, term2: any) => {
  const getRemark = () => {
    const percentage =
      (Number(term1.percentage) + Number(term2.percentage)) / 2;
    if (percentage >= 90) return "Outstanding performance! Keep shining.";
    if (percentage >= 75) return "Excellent performance! Keep up the good work.";
    if (percentage >= 60) return "Good job! You are doing well.";
    if (percentage >= 40) return "Satisfactory performance. Keep improving.";
    return "Needs improvement. Focus more on studies.";
  };

  const getGradeBadgeColor = (grade: string) => {
    if (["A1", "A2"].includes(grade)) return "#1a6b3c";
    if (["B1", "B2"].includes(grade)) return "#1a4fa0";
    if (["C1", "C2"].includes(grade)) return "#7d6608";
    if (grade === "D") return "#8e4000";
    return "#8b0000";
  };

  const avgPercentage = (
    (Number(term1.percentage) + Number(term2.percentage)) / 2
  ).toFixed(2);

  return `<!DOCTYPE html>
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
  font-family: 'Times New Roman', serif;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

</style>
</head>
<body>

<!-- ROOT WRAPPER -->
<div style="
  width: 100%;
  border: 4px double #1a5c38;
  background: #fff;
  overflow: hidden;
">

  <!-- TOP BAR -->
  <div style="
    height: 8px;
    background: linear-gradient(90deg, #1a5c38 0%, #d4a017 33%, #1a5c38 66%, #d4a017 100%);
  "></div>

  <!-- HEADER -->
  <div style="
    background: linear-gradient(135deg, #1a5c38 0%, #2e8b57 55%, #1a5c38 100%);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
  ">

    <!-- LEFT LOGO -->
    <div style="
      width: 78px;
      height: 78px;
      background: #fff;
      border-radius: 8px;
      border: 3px solid #d4a017;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    ">
      <img
        src="${term1.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>

    <!-- CENTER -->
    <div style="flex: 1; text-align: center; color: #fff;">
      <div style="
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 1px;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.35);
        line-height: 1.2;
      ">${term1.instituteName}</div>

      <div style="
        width: 50%;
        height: 2px;
        background: #d4a017;
        margin: 5px auto;
      "></div>

      <div style="font-size: 12px; opacity: 0.9;">${term1.instituteAdress || ""}</div>
      <div style="font-size: 12px; opacity: 0.85; margin-top: 2px;">
        Ph. ${term1.institutePhone || ""}
      </div>

      <!-- TITLE BADGE -->
      <div style="
        margin-top: 8px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
      ">
        <div style="width: 40px; height: 1px; background: #d4a017;"></div>
        <div style="
          background: #d4a017;
          color: #1a5c38;
          font-size: 16px;
          font-weight: bold;
          padding: 3px 20px;
          border-radius: 20px;
          letter-spacing: 2px;
        ">ANNUAL REPORT CARD</div>
        <div style="width: 40px; height: 1px; background: #d4a017;"></div>
      </div>
    </div>

    <!-- RIGHT LOGO -->
    <div style="
      width: 78px;
      height: 78px;
      background: #fff;
      border-radius: 50%;
      border: 3px solid #d4a017;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    ">
      <img
        src="${term1.instituteLogo}"
        crossorigin="anonymous"
        style="width: 100%; height: 100%; object-fit: contain;"
      />
    </div>

  </div>

  <!-- SESSION INFO BAR -->
  <div style="
    background: #e8f5ee;
    border-top: 2px solid #d4a017;
    border-bottom: 2px solid #d4a017;
    display: flex;
    justify-content: center;
    gap: 40px;
    padding: 5px 0;
    font-size: 13px;
    font-weight: bold;
    color: #1a5c38;
  ">
    <span>Class : ${term1.batchName}</span>
    <span>|</span>
    <span>Section : ${term1.section || "A"}</span>
    <span>|</span>
    <span>Session : ${term1.session}</span>
  </div>

  <!-- CONTENT AREA -->
  <div style="padding: 10px 13px;">

    <!-- STUDENT PROFILE -->
    <div style="
      border: 2px solid #1a5c38;
      border-radius: 6px;
      overflow: hidden;
    ">

      <!-- Profile Title -->
      <div style="
        background: linear-gradient(90deg, #1a5c38, #2e8b57);
        color: #fff;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 5px;
        letter-spacing: 1px;
      ">▌ STUDENT PROFILE ▐</div>

      <div style="
        display: flex;
        background: linear-gradient(135deg, #f5fbf7, #e8f5ee);
      ">

        <!-- PHOTO -->
        <div style="
          padding: 10px 12px;
          border-right: 2px solid #d4a017;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <img
            src="${term1.photo}"
            crossorigin="anonymous"
            style="
              width: 90px;
              height: 105px;
              object-fit: cover;
              border: 3px solid #1a5c38;
              border-radius: 5px;
            "
          />
          <div style="
            margin-top: 5px;
            font-size: 10px;
            font-weight: bold;
            color: #1a5c38;
          ">Roll: ${term1.rollNumber}</div>
        </div>

        <!-- INFO TABLE -->
        <div style="flex: 1; padding: 8px 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <tr>
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38; width: 20%;">Student Name</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; font-weight: bold; color: #111; width: 28%;">${term1.studentName}</td>
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38; width: 20%;">Admission No.</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.enrolment || "-"}</td>
            </tr>
            <tr style="background: rgba(26,92,56,0.05);">
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38;">Father's Name</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.fName}</td>
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38;">Mother's Name</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.motherName || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38;">Date of Birth</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.dob}</td>
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38;">Mobile</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.parentNumber}</td>
            </tr>
            <tr style="background: rgba(26,92,56,0.05);">
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38;">Attendance</td>
              <td style="padding: 3px 2px; color: #555;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.attendance || "-"}</td>
              <td style="padding: 3px 6px; font-weight: bold; color: #1a5c38; vertical-align: top;">Address</td>
              <td style="padding: 3px 2px; color: #555; vertical-align: top;">:</td>
              <td style="padding: 3px 6px; color: #333;">${term1.address}</td>
            </tr>
          </table>
        </div>

      </div>
    </div>

    <!-- ACADEMIC PERFORMANCE HEADING -->
    <div style="
      font-size: 14px;
      font-weight: bold;
      color: #1a5c38;
      border-left: 5px solid #d4a017;
      padding-left: 9px;
      margin: 10px 0 6px;
    ">Academic Performance — Scholastic Areas</div>

    <!-- MARKS TABLE -->
    <table style="
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      border: 2px solid #1a5c38;
    ">

      <!-- HEADER -->
      <tr style="background: linear-gradient(90deg, #1a5c38, #2e8b57); color: #fff;">
        <th rowspan="2" style="
          border: 1px solid #4caf85;
          padding: 5px 6px;
          text-align: center;
          width: 16%;
          font-size: 11px;
        ">SUBJECTS</th>

        <th colspan="6" style="
          border: 1px solid #4caf85;
          padding: 4px;
          text-align: center;
          background: rgba(212,160,23,0.2);
        ">TERM — I</th>

        <th colspan="6" style="
          border: 1px solid #4caf85;
          padding: 4px;
          text-align: center;
          background: rgba(212,160,23,0.1);
        ">TERM — II</th>
      </tr>

      <tr style="background: #2e8b57; color: #e8f5ee; font-size: 9px;">
        <!-- Term 1 -->
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">PT</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">NB</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">SE</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">Theory</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;color:#d4a017;">Marks</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;color:#d4a017;">Grade</th>
        <!-- Term 2 -->
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">PT</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">NB</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">SE</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;">Theory</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;color:#d4a017;">Marks</th>
        <th style="border:1px solid #4caf85;padding:3px;text-align:center;color:#d4a017;">Grade</th>
      </tr>

      ${term1.marks
        .map((m1: any, i: number) => {
          const m2 = term2.marks.find(
            (x: any) => x.subjectName === m1.subjectName
          );
          return `
      <tr style="background: ${i % 2 === 0 ? "#fff" : "#f0faf4"};">
        <td style="border:1px solid #9ecfb3;padding:4px 6px;font-weight:bold;color:#1a5c38;">${m1.subjectName}</td>

        <!-- Term 1 -->
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m1.periodic_test}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m1.note_book}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m1.subject_enrichment}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m1.theory_marks}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;font-weight:bold;color:#1a5c38;">${m1.obtained_marks}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;">
          <span style="background:${getGradeBadgeColor(m1.grade)};color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">${m1.grade}</span>
        </td>

        <!-- Term 2 -->
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m2?.periodic_test || "-"}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m2?.note_book || "-"}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m2?.subject_enrichment || "-"}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;color:#333;">${m2?.theory_marks || "-"}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;font-weight:bold;color:#1a5c38;">${m2?.obtained_marks || "-"}</td>
        <td style="border:1px solid #9ecfb3;text-align:center;">
          ${m2?.grade
            ? `<span style="background:${getGradeBadgeColor(m2.grade)};color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">${m2.grade}</span>`
            : "-"
          }
        </td>
      </tr>
      `;
        })
        .join("")}

    </table>

    <!-- CO-SCHOLASTIC + SKILLS + GRADE TABLE SECTION -->
    <div style="display: flex; gap: 10px; margin-top: 10px;">

      <!-- LEFT: CO-SCHOLASTIC + SKILLS + DISCIPLINE -->
      <div style="flex: 1;">

        <!-- CO-SCHOLASTIC HEADING -->
        <div style="
          font-size: 13px;
          font-weight: bold;
          color: #1a5c38;
          border-left: 5px solid #d4a017;
          padding-left: 8px;
          margin-bottom: 5px;
        ">Co-Scholastic Activities</div>

        <!-- CO-SCHOLASTIC TABLE -->
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <tr style="background:linear-gradient(90deg,#1a5c38,#2e8b57);color:#fff;">
            <th style="border:1px solid #4caf85;padding:4px 6px;text-align:left;">Activity</th>
            <th style="border:1px solid #4caf85;padding:4px;text-align:center;width:80px;">Term I</th>
            <th style="border:1px solid #4caf85;padding:4px;text-align:center;width:80px;">Term II</th>
          </tr>
          ${term1.activity
            ?.map((a1: any, i: number) => {
              const a2 = term2.activity.find(
                (x: any) => x.subjectName === a1.subjectName
              );
              return `
          <tr style="background:${i % 2 === 0 ? "#fff" : "#f0faf4"};">
            <td style="border:1px solid #9ecfb3;padding:3px 6px;color:#333;">${a1.subjectName}</td>
            <td style="border:1px solid #9ecfb3;text-align:center;">
              <span style="background:${getGradeBadgeColor(a1.grade)};color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">${a1.grade}</span>
            </td>
            <td style="border:1px solid #9ecfb3;text-align:center;">
              ${a2?.grade
                ? `<span style="background:${getGradeBadgeColor(a2.grade)};color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">${a2.grade}</span>`
                : "-"
              }
            </td>
          </tr>
          `;
            })
            .join("")}
        </table>

        <!-- SKILLS HEADING -->
        <div style="
          font-size: 13px;
          font-weight: bold;
          color: #1a5c38;
          border-left: 5px solid #d4a017;
          padding-left: 8px;
          margin: 8px 0 5px;
        ">Co-Scholastic Areas [A–C Scale]</div>

        <!-- SKILLS TABLE -->
        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <tr style="background:linear-gradient(90deg,#1a5c38,#2e8b57);color:#fff;">
            <th style="border:1px solid #4caf85;padding:4px 6px;text-align:left;">Skill</th>
            <th style="border:1px solid #4caf85;padding:4px;text-align:center;width:80px;">Term I</th>
            <th style="border:1px solid #4caf85;padding:4px;text-align:center;width:80px;">Term II</th>
          </tr>
          ${term1.skills
            ?.map((s1: any, i: number) => {
              const s2 = term2.skills.find(
                (x: any) => x.subjectName === s1.subjectName
              );
              return `
          <tr style="background:${i % 2 === 0 ? "#fff" : "#f0faf4"};">
            <td style="border:1px solid #9ecfb3;padding:3px 6px;color:#333;">${s1.subjectName}</td>
            <td style="border:1px solid #9ecfb3;text-align:center;">
              <span style="background:${getGradeBadgeColor(s1.grade)};color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">${s1.grade}</span>
            </td>
            <td style="border:1px solid #9ecfb3;text-align:center;">
              ${s2?.grade
                ? `<span style="background:${getGradeBadgeColor(s2.grade)};color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">${s2.grade}</span>`
                : "-"
              }
            </td>
          </tr>
          `;
            })
            .join("")}
        </table>

        <!-- DISCIPLINE ROW -->
        <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:5px;">
          <tr>
            <td style="border:1px solid #9ecfb3;padding:4px 6px;font-weight:bold;color:#1a5c38;">Discipline</td>
            <td style="border:1px solid #9ecfb3;text-align:center;width:80px;">
              <span style="background:#1a6b3c;color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">A</span>
            </td>
            <td style="border:1px solid #9ecfb3;text-align:center;width:80px;">
              <span style="background:#1a6b3c;color:#fff;padding:1px 7px;border-radius:10px;font-weight:bold;font-size:9px;">A</span>
            </td>
          </tr>
        </table>

      </div>

      <!-- RIGHT: GRADE TABLE + RESULT CARD -->
      <div style="width: 178px; flex-shrink: 0;">

        <div style="
          font-size: 12px;
          font-weight: bold;
          color: #1a5c38;
          border-left: 5px solid #d4a017;
          padding-left: 8px;
          margin-bottom: 5px;
        ">Grade Scale</div>

        <table style="width:100%;border-collapse:collapse;font-size:10px;">
          <tr style="background:linear-gradient(90deg,#1a5c38,#2e8b57);color:#fff;">
            <th style="border:1px solid #4caf85;padding:4px;text-align:center;">Range</th>
            <th style="border:1px solid #4caf85;padding:4px;text-align:center;">Grade</th>
          </tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#d4edda;color:#155724;font-weight:bold;">91–100</td><td style="border:1px solid #9ecfb3;text-align:center;background:#d4edda;color:#155724;font-weight:bold;">A1</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#d4edda;color:#155724;">81–90</td><td style="border:1px solid #9ecfb3;text-align:center;background:#d4edda;color:#155724;font-weight:bold;">A2</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#cce5ff;color:#004085;">71–80</td><td style="border:1px solid #9ecfb3;text-align:center;background:#cce5ff;color:#004085;font-weight:bold;">B1</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#cce5ff;color:#004085;">61–70</td><td style="border:1px solid #9ecfb3;text-align:center;background:#cce5ff;color:#004085;font-weight:bold;">B2</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#fff3cd;color:#856404;">51–60</td><td style="border:1px solid #9ecfb3;text-align:center;background:#fff3cd;color:#856404;font-weight:bold;">C1</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#fff3cd;color:#856404;">41–50</td><td style="border:1px solid #9ecfb3;text-align:center;background:#fff3cd;color:#856404;font-weight:bold;">C2</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#ffe5d0;color:#7d3c00;">33–40</td><td style="border:1px solid #9ecfb3;text-align:center;background:#ffe5d0;color:#7d3c00;font-weight:bold;">D</td></tr>
          <tr><td style="border:1px solid #9ecfb3;text-align:center;padding:3px;background:#f8d7da;color:#721c24;">32 &amp; Below</td><td style="border:1px solid #9ecfb3;text-align:center;background:#f8d7da;color:#721c24;font-weight:bold;">E</td></tr>
        </table>

        <!-- COMBINED RESULT MINI-CARD -->
        <div style="
          margin-top: 10px;
          border: 2px solid #1a5c38;
          border-radius: 6px;
          overflow: hidden;
          text-align: center;
        ">
          <div style="
            background: linear-gradient(90deg, #1a5c38, #2e8b57);
            color: #fff;
            font-size: 10px;
            font-weight: bold;
            padding: 4px;
            letter-spacing: 1px;
          ">COMBINED RESULT</div>
          <div style="padding: 7px 4px; background: #f5fbf7;">
            <div style="font-size: 9px; color: #777; font-weight: bold; letter-spacing: 1px; margin-bottom: 2px;">
              AVG. PERCENTAGE
            </div>
            <div style="font-size: 20px; font-weight: bold; color: #1a5c38;">
              ${avgPercentage}%
            </div>
            <div style="
              margin-top: 5px;
              font-size: 9px;
              color: #777;
              font-weight: bold;
              letter-spacing: 1px;
            ">TERM I</div>
            <div style="font-size: 13px; font-weight: bold; color: #333;">
              ${Number(term1.percentage).toFixed(2)}%
            </div>
            <div style="
              margin-top: 3px;
              font-size: 9px;
              color: #777;
              font-weight: bold;
              letter-spacing: 1px;
            ">TERM II</div>
            <div style="font-size: 13px; font-weight: bold; color: #333;">
              ${Number(term2.percentage).toFixed(2)}%
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- REMARKS -->
    <div style="
      margin-top: 10px;
      background: linear-gradient(135deg, #f5fbf7, #e8f5ee);
      border: 1px solid #d4a017;
      border-radius: 6px;
      padding: 8px 16px;
      text-align: center;
    ">
      <div style="
        font-size: 13px;
        font-weight: bold;
        color: #1a5c38;
        letter-spacing: 1px;
        margin-bottom: 3px;
      ">✦ Class Teacher Remarks ✦</div>
      <div style="
        font-size: 13px;
        font-style: italic;
        color: #333;
      ">${getRemark()}</div>
    </div>

    <!-- FOOTER -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
    ">

      <!-- LEFT: DATE -->
      <div style="font-size: 11px; font-weight: bold; color: #444;">
        Dated : ${term2.date}
      </div>

      <!-- CLASS TEACHER -->
      <div style="text-align: center;">
        <div style="height: 40px; width: 130px;"></div>
        <div style="
          border-top: 2px solid #1a5c38;
          width: 130px;
          padding-top: 4px;
          font-size: 11px;
          font-weight: bold;
          color: #1a5c38;
        ">Class Teacher</div>
      </div>

      <!-- PRINCIPAL -->
      <div style="text-align: center;">
        <div style="height: 40px; width: 130px;"></div>
        <div style="
          border-top: 2px solid #1a5c38;
          width: 130px;
          padding-top: 4px;
          font-size: 11px;
          font-weight: bold;
          color: #1a5c38;
        ">Principal</div>
      </div>

    </div>

  </div>

  <!-- BOTTOM BAR -->
  <div style="
    height: 8px;
    background: linear-gradient(90deg, #1a5c38 0%, #d4a017 33%, #1a5c38 66%, #d4a017 100%);
    margin-top: 12px;
  "></div>

</div>

</body>
</html>`;
};
