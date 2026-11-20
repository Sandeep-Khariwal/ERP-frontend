
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



// =====================================================================
//  ACADEMY DESIGN : Annual Marksheet (Combined Term 1 + Term 2)
//  Matching createAcadmyMarksheetPdf's Elegant Blue-Border Theme
// =====================================================================

export const createAcadmyAnnualMarksheetPdf = (term1: any, term2: any) => {
  // Average Percentage calculation
  const p1 = Number(term1.percentage) || 0;
  const p2 = Number(term2.percentage) || 0;
  const avgPercentage = ((p1 + p2) / 2).toFixed(2);

  const getRemark = () => {
    if (term2.status === "Fail" || term1.status === "Fail") {
      return "Needs improvement. Work harder and try again.";
    }

    const percentage = Number(avgPercentage);
    if (percentage >= 90) return "Outstanding performance throughout the year! Keep shining.";
    if (percentage >= 75) return "Excellent performance! Keep up the good work.";
    if (percentage >= 60) return "Good job! You are doing well.";
    if (percentage >= 40) return "Satisfactory performance. Keep improving.";
    return "Needs improvement. Focus more on studies.";
  };

  const getGradeBadgeColor = (grade: string) => {
    if (["A+", "A1", "A2", "A"].includes(grade)) return "#1a6b3c";
    if (["B+", "B1", "B2", "B"].includes(grade)) return "#1f4e8c";
    if (["C+", "C1", "C2", "C"].includes(grade)) return "#856404";
    if (["D"].includes(grade)) return "#a04000";
    return "#8b0000";
  };

  // Grand totals
  const t1Total = Number(term1.totalMarks) || 0;
  const t2Total = Number(term2.totalMarks) || 0;
  const grandTotalMarks = t1Total + t2Total;

  const t1Max = Number(term1.allsubjecttotal) || (term1.marks?.length || 0) * 100;
  const t2Max = Number(term2.allsubjecttotal) || (term2.marks?.length || 0) * 100;
  const grandMaxTotal = t1Max + t2Max;

  // Check for Co-Scholastic / Activities
  const hasActivities =
    (term1.activity && term1.activity.length > 0) ||
    (term2.activity && term2.activity.length > 0);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Annual Marksheet - ${term1.studentName || term2.studentName}</title>
<style>
  @page {
    size: A4;
    margin: 6mm;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: #dfe7f1;
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

  <div style="width: 100%; max-width: 900px; margin: 10px auto; background: #f7fbff; border: 6px double #b5c7d8; padding: 16px;">

    <!-- TOP HEADER SECTION -->
    <div style="background: linear-gradient(#eaf3fb, #d6e6f5); padding: 12px 16px; border: 2px solid #c3d3e2;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        
        <!-- Logo & School Details -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <img
            src="${term1.instituteLogo || term2.instituteLogo}"
            crossorigin="anonymous"
            style="width: 75px; height: 75px; object-fit: contain;"
          />
          <div>
            <h1 style="margin: 0; color: #1f4e8c; font-size: 28px; border-bottom: 2px solid #f4934d96; display: inline-block; text-transform: uppercase;">
              ${term1.instituteName || term2.instituteName}
            </h1>
            <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 2px;">
              <div style="color: #2e3f57; font-size: 12px; font-weight: 500;">
                <span>${term1.instituteAdress || term2.instituteAdress || "N/A"}</span>
              </div>
              <div style="color: #1f4e8c; font-size: 12px; font-weight: 600;">
                <span>☎ ${term1.institutePhone || term2.institutePhone || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Title Right -->
        <div style="text-align: right;">
          <div style="color: #1f4e8c; font-size: 22px; font-weight: bold; border-bottom: 2px solid #1f4e8c; letter-spacing: 1px;">
            ANNUAL MARKSHEET
          </div>
          <div style="font-size: 13px; margin-top: 6px; color: #1f4e8c; font-weight: bold;">
            ${term2.examName || "ANNUAL EVALUATION REPORT"}
          </div>
          <div style="font-size: 11px; color: #2e3f57; font-weight: 600; margin-top: 3px;">
            Academic Session : ${term1.session || term2.session}
          </div>
        </div>

      </div>
    </div>

    <!-- STUDENT PROFILE SECTION -->
    <div style="background: linear-gradient(#eaf3fb, #d6e6f5); margin-top: 10px; padding: 12px 16px; border: 2px solid #c3d3e2; display: flex; align-items: center;">
      <img
        src="${term1.photo || term2.photo}"
        crossorigin="anonymous"
        style="width: 105px; height: 120px; object-fit: cover; border: 3px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2); flex-shrink: 0;"
      />

      <div style="flex: 1; padding-left: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 25px;">

          <!-- LEFT COLUMN -->
          <div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Student Name:</b>
              <span style="font-weight: bold; color: #111;"> ${term1.studentName}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Father's Name:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.fName}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Roll No:</b>
              <span style="font-weight: bold; color: #111;"> ${term1.rollNumber}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Class / Batch:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.batchName}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Date of Birth:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.dob}</span>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Enrollment No:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.enrolment || "-"}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Session:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.session}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Parent Mobile:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.parentNumber}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Section:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.section || term2.section || "A"}</span>
            </div>
            <div style="margin: 3px 0; border-bottom: 1px solid #c3d3e2; padding-bottom: 3px; font-size: 12px;">
              <b style="color: #1f4e8c;">Address:</b>
              <span style="font-weight: bold; color: #333;"> ${term1.address || "N/A"}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- DOUBLE LINE DIVIDER -->
    <p style="border-bottom: 5px double #9db9d4; margin: 10px 0;"></p>

    <!-- SECTION TITLE -->
    <div style="text-align: center; margin: 6px 0;">
      <span style="background: #1f4e8c; color: #fff; padding: 6px 22px; font-weight: bold; letter-spacing: 1px; font-size: 12px; display: inline-block;">
        ACADEMIC PERFORMANCE (TERM I &amp; TERM II)
      </span>
    </div>

    <p style="border-bottom: 5px double #9db9d4; margin: 10px 0;"></p>

    <!-- SCHOLASTIC MARKS TABLE -->
    <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 11px;">
      <thead>
        <tr style="background: #1f4e8c; color: #fff;">
          <th rowspan="2" style="padding: 6px 8px; border: 1px solid #c3d3e2; text-align: left; width: 22%;">SUBJECT</th>
          <th rowspan="2" style="padding: 6px 4px; border: 1px solid #c3d3e2; width: 8%;">MAX</th>
          <th colspan="3" style="padding: 5px; border: 1px solid #c3d3e2; background: #183e70;">TERM — I</th>
          <th colspan="3" style="padding: 5px; border: 1px solid #c3d3e2; background: #153560;">TERM — II (ANNUAL)</th>
          <th rowspan="2" style="padding: 6px 4px; border: 1px solid #c3d3e2; width: 10%;">GRAND TOTAL</th>
          <th rowspan="2" style="padding: 6px 4px; border: 1px solid #c3d3e2; width: 8%;">GRADE</th>
        </tr>
        <tr style="background: #285e9e; color: #fff; font-size: 10px;">
          <th style="padding: 4px; border: 1px solid #c3d3e2; width: 8%;">Prac</th>
          <th style="padding: 4px; border: 1px solid #c3d3e2; width: 8%;">Theory</th>
          <th style="padding: 4px; border: 1px solid #c3d3e2; width: 9%;">Total</th>
          <th style="padding: 4px; border: 1px solid #c3d3e2; width: 8%;">Prac</th>
          <th style="padding: 4px; border: 1px solid #c3d3e2; width: 8%;">Theory</th>
          <th style="padding: 4px; border: 1px solid #c3d3e2; width: 9%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${(term1.marks || [])
          .map((m1: any, i: number) => {
            const m2 = (term2.marks || []).find(
              (x: any) =>
                x.subjectName?.trim().toLowerCase() ===
                m1.subjectName?.trim().toLowerCase()
            ) || {};

            const t1Prac = m1.practical_marks ?? "-";
            const t1Theo = m1.theory_marks ?? "-";
            const t1Obt =
              m1.obtained_marks ??
              (t1Prac !== "-" && t1Theo !== "-"
                ? Number(t1Prac) + Number(t1Theo)
                : "-");

            const t2Prac = m2.practical_marks ?? "-";
            const t2Theo = m2.theory_marks ?? "-";
            const t2Obt =
              m2.obtained_marks ??
              (t2Prac !== "-" && t2Theo !== "-"
                ? Number(t2Prac) + Number(t2Theo)
                : "-");

            const grand =
              (t1Obt !== "-" && !isNaN(Number(t1Obt)) ? Number(t1Obt) : 0) +
              (t2Obt !== "-" && !isNaN(Number(t2Obt)) ? Number(t2Obt) : 0);

            const grade = m2.grade || m1.grade || "-";
            const max = (Number(m1.maxMarks || 100) + Number(m2.maxMarks || 100)) / 2;

            return `
            <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#eaf3fb"};">
              <td style="padding: 6px 8px; border: 1px solid #c3d3e2; text-align: left; font-weight: bold; color: #1f4e8c;">
                ${m1.subjectName}
              </td>
              <td style="border: 1px solid #c3d3e2; color: #444;">${max}</td>
              <td style="border: 1px solid #c3d3e2; color: #333;">${t1Prac}</td>
              <td style="border: 1px solid #c3d3e2; color: #333;">${t1Theo}</td>
              <td style="border: 1px solid #c3d3e2; font-weight: 600; color: #1f4e8c;">${t1Obt}</td>

              <td style="border: 1px solid #c3d3e2; color: #333;">${t2Prac}</td>
              <td style="border: 1px solid #c3d3e2; color: #333;">${t2Theo}</td>
              <td style="border: 1px solid #c3d3e2; font-weight: 600; color: #1f4e8c;">${t2Obt}</td>

              <td style="border: 1px solid #c3d3e2; font-weight: bold; color: #1f4e8c; font-size: 12px;">
                ${grand}
              </td>
              <td style="border: 1px solid #c3d3e2;">
                <span style="
                  background: ${getGradeBadgeColor(grade)};
                  color: #fff;
                  padding: 2px 7px;
                  border-radius: 10px;
                  font-weight: bold;
                  font-size: 10px;
                ">${grade}</span>
              </td>
            </tr>
          `;
          })
          .join("")}
      </tbody>
    </table>

    ${
      hasActivities
        ? `
    <!-- CO-SCHOLASTIC ACTIVITIES (Optional) -->
    <div style="margin-top: 10px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">
        <tr style="background: #1f4e8c; color: #fff;">
          <th style="padding: 5px 8px; border: 1px solid #c3d3e2; text-align: left; width: 40%;">CO-SCHOLASTIC ACTIVITIES</th>
          <th style="padding: 5px; border: 1px solid #c3d3e2; width: 30%;">TERM I GRADE</th>
          <th style="padding: 5px; border: 1px solid #c3d3e2; width: 30%;">TERM II GRADE</th>
        </tr>
        ${(term1.activity || [])
          .map((a1: any, i: number) => {
            const a2 = (term2.activity || []).find(
              (x: any) => x.subjectName === a1.subjectName
            );
            return `
          <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#eaf3fb"};">
            <td style="border: 1px solid #c3d3e2; padding: 4px 8px; text-align: left; color: #333;">${a1.subjectName}</td>
            <td style="border: 1px solid #c3d3e2; font-weight: bold; color: #1f4e8c;">${a1.grade || "-"}</td>
            <td style="border: 1px solid #c3d3e2; font-weight: bold; color: #1f4e8c;">${a2?.grade || "-"}</td>
          </tr>
        `;
          })
          .join("")}
      </table>
    </div>
    `
        : ""
    }

    <!-- RESULT SUMMARY BANNER -->
    <div style="margin-top: 12px; background: #1f4e8c; color: #fff; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
      <div>
        <span style="opacity: 0.85;">TERM I :</span>
        <b> ${t1Total} / ${t1Max}</b> (${Number(term1.percentage).toFixed(1)}%)
      </div>
      <div>
        <span style="opacity: 0.85;">TERM II :</span>
        <b> ${t2Total} / ${t2Max}</b> (${Number(term2.percentage).toFixed(1)}%)
      </div>
      <div>
        <b>GRAND TOTAL:</b>
        <span style="font-weight: bold; font-size: 13px;"> ${grandTotalMarks}</span> / ${grandMaxTotal}
      </div>
      <div>
        <b>AVG %:</b>
        <span style="font-weight: bold; font-size: 13px;"> ${avgPercentage}%</span>
      </div>
      <div>
        <b>GRADE:</b>
        <span style="font-weight: bold; font-size: 13px;"> ${term2.overallGrade || term1.overallGrade || "A"}</span>
      </div>
      <div>
        <b>RESULT:</b>
        <span style="
          font-weight: bold;
          font-size: 12px;
          background: ${term2.status === "Pass" ? "#1a7a4a" : "#c0392b"};
          padding: 2px 8px;
          border-radius: 4px;
        ">${(term2.status || term1.status || "PASS").toUpperCase()}</span>
      </div>
    </div>

    <!-- REMARKS STRIP -->
    <div style="margin-top: 10px; background: linear-gradient(#eaf3fb, #d6e6f5); border: 2px solid #c3d3e2; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
      <div>
        <b style="color: #1f4e8c;">Remarks:</b>
        <span style="font-style: italic; color: #2e3f57; font-weight: 600; margin-left: 6px;">
          "${getRemark()}"
        </span>
      </div>
      <div>
        <b style="color: #1f4e8c;">Date:</b>
        <span style="color: #2e3f57; font-weight: bold; margin-left: 4px;">
          ${term2.date || term1.date}
        </span>
      </div>
    </div>

    <p style="border-bottom: 5px double #9db9d4; margin: 12px 0;"></p>

    <!-- FOOTER SIGNATURES & QR CODE -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 25px; padding: 0 10px;">
      
      <!-- QR Code -->
      <div style="width: 25%; display: flex; justify-content: flex-start;">
        ${
          term2.qr || term1.qr
            ? `<img
                src="${term2.qr || term1.qr}"
                crossorigin="anonymous"
                alt="QR Code"
                style="height: 80px; width: 80px; object-fit: contain; border: 1px solid #c3d3e2; padding: 3px; background: #fff;"
              />`
            : `<div style="height: 80px;"></div>`
        }
      </div>

      <!-- Class Teacher Signature -->
      <div style="text-align: center; width: 30%;">
        <div style="height: 45px;"></div>
        <div style="border-top: 2px solid #9db9d4; width: 100%; font-size: 14px; font-style: italic;">
          <span style="color: #1f4e8c; font-weight: bold;">Class Teacher</span>
        </div>
      </div>

      <!-- Director / Principal Signature -->
      <div style="text-align: center; width: 35%; display: flex; flex-direction: column; align-items: center;">
        ${
          term2.principalSignature || term1.principalSignature
            ? `<img
                src="${term2.principalSignature || term1.principalSignature}"
                crossorigin="anonymous"
                alt="Principal Sign"
                style="height: 55px; width: 220px; object-fit: contain; margin-bottom: -5px; mix-blend-mode: multiply;"
              />`
            : `<div style="height: 55px;"></div>`
        }
        <div style="border-top: 2px solid #9db9d4; width: 100%; margin-top: 5px; font-style: italic; font-size: 16px;">
          <span style="color: #1f4e8c; font-weight: bold;">Director / Principal</span>
        </div>
      </div>

    </div>

  </div>

</body>
</html>`;
};