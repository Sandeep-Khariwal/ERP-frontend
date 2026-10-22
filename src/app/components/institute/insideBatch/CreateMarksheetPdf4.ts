// =====================================================================
//  DESIGN 2 : Mid-Term Marksheet (Single Term)
//  Classic Monochrome / School Progress Report Format (Photo Replica)
// =====================================================================

export const generateMidTermMarksheet4 = (data: any) => {
  const getRemark = () => {
    if (data.remarks) return data.remarks;
    if (data.status === "Fail") return "Needs improvement. Work harder and try again.";
    const percentage = Number(data.percentage);
    if (percentage >= 90) return "OUTSTANDING PERFORMANCE! KEEP SHINING.";
    if (percentage >= 75) return "EXCELLENT PERFORMANCE! KEEP UP THE GOOD WORK.";
    if (percentage >= 60) return "KEEP ASKING QUESTIONS AND STAY CURIOUS!";
    if (percentage >= 40) return "SATISFACTORY PERFORMANCE. WORK HARDER.";
    return "NEEDS IMPROVEMENT. FOCUS MORE ON STUDIES.";
  };

  const isCoScholastic = (type?: string) =>
    type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ?? false;

  const scholasticMarks = (data.marks ?? []).filter(
    (m: any) => !isCoScholastic(m.subjectType)
  );

  const coScholasticMarks = (data.marks ?? []).filter(
    (m: any) => isCoScholastic(m.subjectType)
  );

  // Combine activities and co-scholastic marks into a single horizontal list
  const coScholasticList = [
    ...(data.activity ?? []),
    ...coScholasticMarks.map((m: any) => ({
      subjectName: m.subjectName,
      grade: m.grade,
    })),
    ...(data.skills ?? []),
  ];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {
  size: A4 portrait;
  margin: 6mm;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman', Times, serif;
  background: #fff;
  color: #000;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
}

.report-wrapper {
  width: 100%;
  border: 2px solid #000;
  padding: 8px 12px;
  background: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #000;
  padding: 4px 5px;
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.font-bold { font-weight: bold; }
.uppercase { text-transform: uppercase; }

</style>
</head>
<body>

<div class="report-wrapper">

  <!-- HEADER SECTION -->
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid transparent; padding-bottom: 4px;">
    
    <!-- LEFT LOGO -->
    <div style="width: 75px; height: 75px; text-align: center; flex-shrink: 0;">
      ${
        data.instituteLogo
          ? `<img src="${data.instituteLogo}" crossorigin="anonymous" style="width: 75px; height: 75px; object-fit: contain;" />`
          : `<div style="width: 70px; height: 70px; border: 1px dashed #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">LOGO</div>`
      }
    </div>

    <!-- CENTER SCHOOL INFO -->
    <div style="flex: 1; text-align: center; padding: 0 10px;">
      <div style="font-size: 22px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.15;">
        ${data.instituteName || "School Name"}
      </div>
      <div style="font-size: 11px; margin-top: 3px;">
        ${data.affiliationText ? `Affiliated No. - ${data.affiliationText} &nbsp; ` : ""}${data.instituteAdress || ""}
      </div>
      ${
        data.institutePhone
          ? `<div style="font-size: 11px;">Ph. No. ${data.institutePhone}</div>`
          : ""
      }
      <div style="font-size: 11px;">
        ${data.instituteWebsite ? `${data.instituteWebsite} | ` : ""}${data.instituteEmail || ""}
      </div>
    </div>

    <!-- RIGHT LOGO -->
    <div style="width: 75px; height: 75px; text-align: center; flex-shrink: 0;">
      ${
        data.photoRight || data.photo
          ? `<img src="${data.photoRight || data.photo}" crossorigin="anonymous" style="width: 75px; height: 75px; object-fit: contain;" />`
          : `<div style="width: 70px; height: 70px; border: 1px dashed #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;">LOGO</div>`
      }
    </div>

  </div>

  <!-- REPORT TITLE & SESSION BAR -->
  <div style="position: relative; text-align: center; margin: 4px 0 6px 0;">
    <div style="font-size: 14px; font-weight: bold; text-decoration: underline; letter-spacing: 0.5px;">
      ${data.examName ? `${data.examName.toUpperCase()} PROGRESS REPORT` : "TERM-I PROGRESS REPORT"}
    </div>
    <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">
      Session : ${data.session || "2026-2027"}
    </div>

    
   
  </div>

  <!-- PERSONAL DETAIL HEADING -->
  <div style="font-size: 12px; font-weight: bold; text-decoration: underline; margin-bottom: 4px;">
    Personal Detail:
  </div>

  <!-- PERSONAL DETAIL TABLE -->
  <table class="table-bordered" style="font-size: 11px; margin-bottom: 8px;">
    <tr>
      <td style="width: 18%; font-weight: bold;">Student's Name:</td>
      <td style="width: 42%; font-weight: bold; text-transform: uppercase;">${data.studentName || ""}</td>
      <td style="width: 18%; font-weight: bold;">Class / Sec.:</td>
      <td style="width: 22%;">${data.batchName || ""} ${data.section ? `${data.section}` : ""}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Father's Name:</td>
      <td style="text-transform: uppercase;">${data.fName || ""}</td>
      <td style="font-weight: bold;">Roll No.:</td>
      <td>${data.rollNumber || ""}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Mother's Name:</td>
      <td style="text-transform: uppercase;">${data.mName || "-"}</td>
      <td style="font-weight: bold;">DOB:</td>
      <td>${data.dob || "-"}</td>
    </tr>
  </table>

  <!-- SCHOLASTIC MARKS TABLE -->
  <table class="table-bordered text-center" style="font-size: 11px; margin-bottom: 8px;">
    <thead>
      <tr>
        <th rowspan="2" style="width: 24%; text-align: center; vertical-align: middle;">SUBJECTS</th>
        <th colspan="7" style="text-align: center; padding: 3px;">
          ${data.examName || "Term-1"}
        </th>
      </tr>
      <tr style="font-size: 10px;">
        <th style="width: 10%;">PT-1<br>(10)</th>
        <th style="width: 10%;">SEA.<br>(5)</th>
        <th style="width: 11%;">PORTFOLIO<br>(5)</th>
        <th style="width: 11%;">TOTAL<br>(20)</th>
        <th style="width: 12%;">TERM - 1<br>(80)</th>
        <th style="width: 11%;">TOTAL<br>(100)</th>
        <th style="width: 11%;">GRADE</th>
      </tr>
    </thead>
    <tbody>
      ${scholasticMarks
        .map((m: any) => {
          const pt = Number(m.periodic_test ?? m.pt ?? 0);
          const sea = Number(m.subject_enrichment ?? m.sea ?? 0);
          const port = Number(m.note_book ?? m.portfolio ?? 0);
          const internalTotal = (pt + sea + port).toFixed(1).replace(/\.0$/, "");
          const theory = m.theory_marks ?? m.term_marks ?? "";
          const totalObtained = m.obtained_marks ?? "";

          return `
          <tr>
            <td class="text-left font-bold" style="padding-left: 8px;">${m.subjectName}</td>
            <td>${m.periodic_test ?? m.pt ?? "-"}</td>
            <td>${m.subject_enrichment ?? m.sea ?? "-"}</td>
            <td>${m.note_book ?? m.portfolio ?? "-"}</td>
            <td class="font-bold">${internalTotal}</td>
            <td>${theory}</td>
            <td class="font-bold">${totalObtained}</td>
            <td class="font-bold">${m.grade || "-"}</td>
          </tr>
          `;
        })
        .join("")}

      <!-- GRAND TOTAL & PERCENTAGE ROW -->
      <tr style="font-weight: bold; font-size: 11px;">
        <td colspan="3" class="text-left" style="padding: 5px 8px;">
          Grand Total: &nbsp; ${data.totalMarks || 0}/${data.allsubjecttotal || 0}
        </td>
        <td colspan="3" class="text-left" style="padding: 5px 8px;">
          Percentage: &nbsp; ${Number(data.percentage || 0).toFixed(2)}%
        </td>
        <td colspan="2" class="text-left" style="padding: 5px 8px;">
          Overall Grade: &nbsp; ${data.overallGrade || "-"}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- CO-SCHOLASTIC GRADING AREA -->
  <div style="font-size: 11.5px; font-weight: bold; text-decoration: underline; margin-top: 6px;">
    Co-Scholastic Grading Area:
  </div>
  <div style="font-size: 10px; margin: 2px 0;">
    (Evaluation based on continuous Comprehensive Observation based on 5 point scaling)
  </div>
  <div style="font-size: 10px; margin-bottom: 4px; word-spacing: 3px;">
    A=Excellent &nbsp;&nbsp; B=Very Good &nbsp;&nbsp; C=Good &nbsp;&nbsp; D=Satisfactory &nbsp;&nbsp; E=Needs Improvement
  </div>

  <!-- HORIZONTAL CO-SCHOLASTIC TABLE (Exactly like photo) -->
  <table class="table-bordered text-center" style="font-size: 10.5px; margin-bottom: 8px;">
    <tr style="font-weight: bold;">
      ${
        coScholasticList.length > 0
          ? coScholasticList
              .map(
                (item: any) => `
                <th style="padding: 4px 6px; text-transform: uppercase;">
                  ${item.subjectName || item.activityName || item.name || "-"}
                </th>`
              )
              .join("")
          : `<th>COMPUTER</th><th>G.K.</th><th>REASONING</th><th>ART &amp; CRAFT</th><th>FRENCH</th><th>ABACUS</th>`
      }
    </tr>
    <tr>
      ${
        coScholasticList.length > 0
          ? coScholasticList
              .map(
                (item: any) => `
                <td style="padding: 4px 6px; font-weight: bold;">
                  ${item.grade || "-"}
                </td>`
              )
              .join("")
          : `<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>`
      }
    </tr>
  </table>

  <!-- 8-POINT SCHOLASTIC GRADING SCALE TABLE -->
  <div style="font-size: 10.5px; font-weight: bold; margin-bottom: 3px;">
    Grading Scale for scholastic area: Grades are awarded on a 8 - point grading scale as follows:-
  </div>

  <table class="table-bordered text-center" style="font-size: 10px; margin-bottom: 8px;">
    <tr style="font-weight: bold;">
      <td style="width: 14%; text-align: left; padding-left: 6px;">Marks Range</td>
      <td>91-100</td>
      <td>81-90</td>
      <td>71-80</td>
      <td>61-70</td>
      <td>51-60</td>
      <td>41-50</td>
      <td>33-40</td>
      <td>32 &amp; Below</td>
    </tr>
    <tr>
      <td style="font-weight: bold; text-align: left; padding-left: 6px;">Grade</td>
      <td>A1</td>
      <td>A2</td>
      <td>B1</td>
      <td>B2</td>
      <td>C1</td>
      <td>C2</td>
      <td>D</td>
      <td>E (Needs Improvement)</td>
    </tr>
  </table>

  <!-- REMARKS BOX -->
  <div style="border: 1px solid #000; padding: 5px 8px; margin-bottom: 18px; font-size: 11px;">
    <strong>Remarks:</strong> ${getRemark().toUpperCase()}
  </div>

  <!-- SIGNATURES FOOTER -->
  <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 10px 10px 4px 10px; font-size: 11px; font-weight: bold;">
    
    <!-- CLASS TEACHER -->
    <div style="text-align: center; width: 160px;">
      <div style="height: 35px;"></div>
      <div>Class Teacher's Sign.</div>
    </div>

    <!-- PARENT -->
    <div style="text-align: center; width: 160px;">
      <div style="height: 35px;"></div>
      <div>Parent's Sign.</div>
    </div>

    <!-- PRINCIPAL -->
    <div style="text-align: center; width: 180px;">
      <div style="height: 35px; display: flex; align-items: flex-end; justify-content: center;">
        ${
          data.principalSignature
            ? `<img src="${data.principalSignature}" crossorigin="anonymous" style="max-height: 35px; max-width: 140px; object-fit: contain;" />`
            : ""
        }
      </div>
      <div>Principal's Sign.</div>
    </div>

  </div>

</div>

</body>
</html>`;
};


// =====================================================================
//  DESIGN 2 : Annual / Combined Term Marksheet (Term I + Term II)
//  Classic Monochrome / School Progress Report Format (Photo Replica)
// =====================================================================

export const generateAnnualMarksheet4 = (term1: any, term2: any) => {
  const isCoScholastic = (type?: string) =>
    type?.toLowerCase().replace(/[^a-z]/g, "").startsWith("coschol") ?? false;

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

  const combinedCoScholastic = [
    ...(term1.activity ?? []),
    ...term1CoScholasticMarks.map((m: any) => ({
      subjectName: m.subjectName,
      grade: m.grade,
    })),
    ...(term1.skills ?? []),
  ];

  const getCombinedRemark = () => {
    if (term2.remarks) return term2.remarks;
    const avg = (Number(term1.percentage || 0) + Number(term2.percentage || 0)) / 2;
    if (avg >= 90) return "OUTSTANDING PERFORMANCE THROUGHOUT THE YEAR! PROMOTED.";
    if (avg >= 75) return "EXCELLENT PERFORMANCE! PROMOTED TO NEXT CLASS.";
    if (avg >= 60) return "GOOD JOB! PROMOTED TO NEXT CLASS.";
    if (avg >= 40) return "SATISFACTORY PERFORMANCE. PROMOTED TO NEXT CLASS.";
    return "NEEDS IMPROVEMENT. WORK HARDER IN NEXT SESSION.";
  };

  // const grandTotalMarks = Number(term1.totalMarks || 0) + Number(term2.totalMarks || 0);
  // const grandMaxMarks = Number(term1.allsubjecttotal || 0) + Number(term2.allsubjecttotal || 0);
  // const overallPercentage = ((Number(term1.percentage || 0) + Number(term2.percentage || 0)) / 2).toFixed(2);
  
const grandTotalMarks =
  (Number(term1.totalMarks || 0) +
    Number(term2.totalMarks || 0)) / 2;

const grandMaxMarks =
  (Number(term1.allsubjecttotal || 0) +
    Number(term2.allsubjecttotal || 0)) / 2;

const overallPercentage = (
  (Number(term1.percentage || 0) +
    Number(term2.percentage || 0)) /
  2
).toFixed(2);


  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {
  size: A4 portrait;
  margin: 5mm;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman', Times, serif;
  background: #fff;
  color: #000;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

* {
  box-sizing: border-box;
}

.report-wrapper {
  width: 100%;
  border: 2px solid #000;
  padding: 7px 10px;
  background: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #000;
  padding: 3px 4px;
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.font-bold { font-weight: bold; }
.uppercase { text-transform: uppercase; }

</style>
</head>
<body>

<div class="report-wrapper">

  <!-- HEADER SECTION -->
  <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 2px;">
    
    <!-- LEFT LOGO -->
    <div style="width: 70px; height: 70px; text-align: center; flex-shrink: 0;">
      ${
        term1.instituteLogo
          ? `<img src="${term1.instituteLogo}" crossorigin="anonymous" style="width: 70px; height: 70px; object-fit: contain;" />`
          : `<div style="width: 65px; height: 65px; border: 1px dashed #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px;">LOGO</div>`
      }
    </div>

    <!-- CENTER SCHOOL INFO -->
    <div style="flex: 1; text-align: center; padding: 0 8px;">
      <div style="font-size: 21px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.15;">
        ${term1.instituteName || "School Name"}
      </div>
      <div style="font-size: 10.5px; margin-top: 2px;">
        ${term1.affiliationText ? `Affiliated No. - ${term1.affiliationText} &nbsp; ` : ""}${term1.instituteAdress || ""}
      </div>
      ${
        term1.institutePhone
          ? `<div style="font-size: 10.5px;">Ph. No. ${term1.institutePhone}</div>`
          : ""
      }
      <div style="font-size: 10.5px;">
        ${term1.instituteWebsite ? `${term1.instituteWebsite} | ` : ""}${term1.instituteEmail || ""}
      </div>
    </div>

    <!-- RIGHT LOGO -->
    <div style="width: 70px; height: 70px; text-align: center; flex-shrink: 0;">
      ${
        term1.photoRight || term1.photo
          ? `<img src="${term1.photoRight || term1.photo}" crossorigin="anonymous" style="width: 70px; height: 70px; object-fit: contain;" />`
          : `<div style="width: 65px; height: 65px; border: 1px dashed #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px;">LOGO</div>`
      }
    </div>

  </div>

  <!-- TITLE & SESSION -->
  <div style="position: relative; text-align: center; margin: 3px 0 5px 0;">
    <div style="font-size: 13.5px; font-weight: bold; text-decoration: underline; letter-spacing: 0.5px;">
      ANNUAL PROGRESS REPORT (SESSION : ${term1.session || term2.session || "2026-2027"})
    </div>

    <!-- PHOTO BOX -->
   
  </div>

  <!-- PERSONAL DETAIL HEADING -->
  <div style="font-size: 11.5px; font-weight: bold; text-decoration: underline; margin-bottom: 3px;">
    Personal Detail:
  </div>

  <!-- PERSONAL DETAIL TABLE -->
  <table class="table-bordered" style="font-size: 10.5px; margin-bottom: 6px;">
    <tr>
      <td style="width: 18%; font-weight: bold;">Student's Name:</td>
      <td style="width: 42%; font-weight: bold; text-transform: uppercase;">${term1.studentName || ""}</td>
      <td style="width: 18%; font-weight: bold;">Class / Sec.:</td>
      <td style="width: 22%;">${term1.batchName || ""} ${term1.section ? `${term1.section}` : ""}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Father's Name:</td>
      <td style="text-transform: uppercase;">${term1.fName || ""}</td>
      <td style="font-weight: bold;">Roll No.:</td>
      <td>${term1.rollNumber || ""}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Mother's Name:</td>
      <td style="text-transform: uppercase;">${term1.mName || "-"}</td>
      <td style="font-weight: bold;">DOB:</td>
      <td>${term1.dob || "-"}</td>
    </tr>
  </table>

  <!-- ANNUAL SCHOLASTIC MARKS TABLE (TERM 1 + TERM 2) -->
  <table class="table-bordered text-center" style="font-size: 9.5px; margin-bottom: 6px;">
    <thead>
      <tr>
        <th rowspan="2" style="width: 20%; vertical-align: middle;">SUBJECTS</th>
        <th colspan="5" style="padding: 2px;">TERM — I (100)</th>
        <th colspan="5" style="padding: 2px;">TERM — II (100)</th>
         
      
  <th colspan="5" style="padding: 2px;">
      OVERALL (T-1+T-2)
    </th>
      
      </tr>
      <tr style="font-size: 9px;">
        <!-- Term 1 -->
        <th style="width: 6%;">PT (10)</th>
        <th style="width: 6%;">SEA (5)</th>
        <th style="width: 6%;">PORT (5)</th>
        <th style="width: 7%;">EXAM (80)</th>
        <th style="width: 7%;">TOTAL</th>
        <!-- Term 2 -->
        <th style="width: 6%;">PT (10)</th>
        <th style="width: 6%;">SEA (5)</th>
        <th style="width: 6%;">PORT (5)</th>
        <th style="width: 7%;">EXAM (80)</th>
        <th style="width: 7%;">TOTAL</th>
         <th style="width: 6%;">T1<br />(50)</th>
    <th style="width: 6%;">T2<br />(50)</th>
     <th style="width: 6%;">TOTAL<br>(100)</th>
      <th style="width: 6%;">FINAL<br>GRADE</th>
      </tr>
    </thead>
    <tbody>
      ${term1ScholasticMarks
        .map((m1: any) => {
          const m2 = term2ScholasticMarks.find(
            (x: any) => x.subjectName === m1.subjectName
          );

          const t1Total = Number(m1.obtained_marks || 0);
          const t2Total = Number(m2?.obtained_marks || 0);
          // const combinedSubjectTotal =  (t1Total + t2Total) / 2;

          const t1Half = t1Total / 2;
const t2Half = t2Total / 2;

const combinedSubjectTotal = t1Half + t2Half;
          return `
          <tr>
            <td class="text-left font-bold" style="padding-left: 5px;">${m1.subjectName}</td>

            <!-- Term 1 -->
            <td>${m1.periodic_test ?? m1.pt ?? "-"}</td>
            <td>${m1.subject_enrichment ?? m1.sea ?? "-"}</td>
            <td>${m1.note_book ?? m1.portfolio ?? "-"}</td>
            <td>${m1.theory_marks ?? m1.term_marks ?? "-"}</td>
            <td class="font-bold">${m1.obtained_marks ?? "-"}</td>

            <!-- Term 2 -->
            <td>${m2?.periodic_test ?? m2?.pt ?? "-"}</td>
            <td>${m2?.subject_enrichment ?? m2?.sea ?? "-"}</td>
            <td>${m2?.note_book ?? m2?.portfolio ?? "-"}</td>
            <td>${m2?.theory_marks ?? m2?.term_marks ?? "-"}</td>
            <td class="font-bold">${m2?.obtained_marks ?? "-"}</td>

            <!-- Combined -->
            <td class="font-bold">${t1Half}</td>
<td class="font-bold">${t2Half}</td>
            <td class="font-bold">${combinedSubjectTotal || "-"}</td>
            <td class="font-bold">${m2?.grade || m1.grade || "-"}</td>
          </tr>
          `;
        })
        .join("")}

      <!-- GRAND TOTAL ROW -->
      <tr style="font-weight: bold; font-size: 10px;">
        <td class="text-left" style="padding: 4px 6px;">Grand Total</td>
        <td colspan="5" class="text-center">Term I: ${term1.totalMarks || 0} (${Number(term1.percentage || 0).toFixed(2)}%)</td>
        <td colspan="5" class="text-center">Term II: ${term2.totalMarks || 0} (${Number(term2.percentage || 0).toFixed(2)}%)</td>
        <td colspan="5" class="text-center">
          ${grandTotalMarks}/${grandMaxMarks} (${overallPercentage}%)
        </td>
      </tr>
    </tbody>
  </table>

  <!-- CO-SCHOLASTIC GRADING AREA -->
  <div style="font-size: 11px; font-weight: bold; text-decoration: underline; margin-top: 4px;">
    Co-Scholastic Grading Area:
  </div>
  <div style="font-size: 9.5px; margin: 1px 0;">
    (Evaluation based on continuous Comprehensive Observation based on 5 point scaling)
  </div>
  <div style="font-size: 9.5px; margin-bottom: 3px; word-spacing: 2px;">
    A=Excellent &nbsp;&nbsp; B=Very Good &nbsp;&nbsp; C=Good &nbsp;&nbsp; D=Satisfactory &nbsp;&nbsp; E=Needs Improvement
  </div>

  <!-- HORIZONTAL CO-SCHOLASTIC TABLE (TERM 1 & TERM 2 ROWS) -->
  <table class="table-bordered text-center" style="font-size: 9.5px; margin-bottom: 6px;">
    <tr style="font-weight: bold;">
      <th style="width: 14%; text-align: left; padding-left: 6px;">Activity / Term</th>
      ${
        combinedCoScholastic.length > 0
          ? combinedCoScholastic
              .map(
                (item: any) => `
                <th style="padding: 3px 4px; text-transform: uppercase;">
                  ${item.subjectName || item.activityName || item.name || "-"}
                </th>`
              )
              .join("")
          : `<th>COMPUTER</th><th>G.K.</th><th>REASONING</th><th>ART &amp; CRAFT</th><th>FRENCH</th><th>ABACUS</th>`
      }
    </tr>
    <tr>
      <td style="font-weight: bold; text-align: left; padding-left: 6px;">Term — I</td>
      ${
        combinedCoScholastic.length > 0
          ? combinedCoScholastic
              .map(
                (item: any) => `
                <td style="font-weight: bold;">${item.grade || "-"}</td>`
              )
              .join("")
          : `<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>`
      }
    </tr>
    <tr>
      <td style="font-weight: bold; text-align: left; padding-left: 6px;">Term — II</td>
      ${
        combinedCoScholastic.length > 0
          ? combinedCoScholastic
              .map((item: any) => {
                const match2 =
                  (term2.activity ?? []).find(
                    (x: any) => x.subjectName === item.subjectName
                  ) ??
                  term2CoScholasticMarks.find(
                    (x: any) => x.subjectName === item.subjectName
                  ) ??
                  (term2.skills ?? []).find(
                    (x: any) => x.subjectName === item.subjectName
                  );
                return `<td style="font-weight: bold;">${match2?.grade || item.grade || "-"}</td>`;
              })
              .join("")
          : `<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>`
      }
    </tr>
  </table>

  <!-- 8-POINT SCHOLASTIC GRADING SCALE TABLE -->
  <div style="font-size: 10px; font-weight: bold; margin-bottom: 2px;">
    Grading Scale for scholastic area: Grades are awarded on a 8 - point grading scale as follows:-
  </div>

  <table class="table-bordered text-center" style="font-size: 9.5px; margin-bottom: 6px;">
    <tr style="font-weight: bold;">
      <td style="width: 14%; text-align: left; padding-left: 6px;">Marks Range</td>
      <td>91-100</td>
      <td>81-90</td>
      <td>71-80</td>
      <td>61-70</td>
      <td>51-60</td>
      <td>41-50</td>
      <td>33-40</td>
      <td>32 &amp; Below</td>
    </tr>
    <tr>
      <td style="font-weight: bold; text-align: left; padding-left: 6px;">Grade</td>
      <td>A1</td>
      <td>A2</td>
      <td>B1</td>
      <td>B2</td>
      <td>C1</td>
      <td>C2</td>
      <td>D</td>
      <td>E (Needs Improvement)</td>
    </tr>
  </table>

  <!-- REMARKS BOX -->
  <div style="border: 1px solid #000; padding: 4px 6px; margin-bottom: 12px; font-size: 10.5px;">
    <strong>Remarks:</strong> ${getCombinedRemark().toUpperCase()}
  </div>

  <!-- SIGNATURES FOOTER -->
  <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 6px 10px 2px 10px; font-size: 10.5px; font-weight: bold;">
    
    <!-- CLASS TEACHER -->
    <div style="text-align: center; width: 160px;">
      <div style="height: 30px;"></div>
      <div>Class Teacher's Sign.</div>
    </div>

    <!-- PARENT -->
    <div style="text-align: center; width: 160px;">
      <div style="height: 30px;"></div>
      <div>Parent's Sign.</div>
    </div>

    <!-- PRINCIPAL -->
    <div style="text-align: center; width: 180px;">
      <div style="height: 30px; display: flex; align-items: flex-end; justify-content: center;">
        ${
          term2.principalSignature || term1.principalSignature
            ? `<img src="${term2.principalSignature || term1.principalSignature}" crossorigin="anonymous" style="max-height: 30px; max-width: 140px; object-fit: contain;" />`
            : ""
        }
      </div>
      <div>Principal's Sign.</div>
    </div>

  </div>

</div>

</body>
</html>`;
};