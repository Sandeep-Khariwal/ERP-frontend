import { GetStudentDetail } from "@/axios/institute/InstituteGetApi";
import { useEffect, useState } from "react";

export const createMarksheetPdf = (data: any) => {
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
                <img src="${window.location.origin}/logo%203.jpg"  style="width:80px;">
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

    <img src="${window.location.origin}/pic.jpg" style="width:130px; border:3px solid #fff; box-shadow:0 0 5px rgba(0,0,0,0.2); ">

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
          ${data.marks.map((m: any, i: number) => `
    <tr style="background:${(i+1)%2 === 0?"#ffffff":"#eaf3fb"}; -webkit-print-color-adjust: exact;">
        <td style="padding:10px; border:1px solid #c3d3e2;">${m.subjectName}</td>
        <td style="border:1px solid #c3d3e2;">100</td>
        <td style="border:1px solid #c3d3e2;">${m.practical_marks}</td>
        <td style="border:1px solid #c3d3e2;">${m.theory_marks}</td>
        <td style="border:1px solid #c3d3e2;">${m.obtained_marks}</td>

    </tr>

      `).join("")}


</table>
 <p style=" border-bottom:2px solid #c3d3e2; padding-bottom:10px; "></p>
   
    <div style="margin-top:20px; background:#1f4e8c; color:#fff; padding:10px; display:flex; justify-content:space-between;  -webkit-print-color-adjust: exact;">
        <div><b>TOTAL MARKS:</b><span style="font-weight: bolder; font-size: larger;"> ${data.totalMarks} </span> / ${data.allsubjecttotal}</div>
        <div><b>PERCENTAGE:</b><span  style="font-weight: bolder; font-size: larger;" > ${Number(data.percentage).toFixed(2)}</span>%</div>
        <div><b>GRADE:</b> <span style="font-weight: bolder; font-size: larger;" >  ${data.overallGrade}</span></div>
        <div><b>RESULT:</b> <span style="font-weight: bolder; font-size: larger;" > ${data.status}</span></div>
    </div>
    <p  style="border-bottom: 6px double #9db9d4;"></p>

    
    <div style="margin-top:30px;">

   
    <div style="display:flex; align-items:center;">

      
        <div style="flex:1;">
            <div style="border-top:2px solid #9db9d4; margin:2px 0;"></div>
            <div style="border-top:2px solid #9db9d4; margin:2px 0;"></div>
            <div style="border-top:2px solid #9db9d4; margin:2px 0;"></div>
        </div>

        <div style="background:#1f4e8c; color:#fff; padding:5px 20px; font-weight:bold; font-size: 24px; margin:0 10px; -webkit-print-color-adjust: exact;">
            REMARKS
        </div>

   
        <div style="flex:1;">
            <div style="border-top:2px solid #9db9d4; margin:2px 0;"></div>
            <div style="border-top:2px solid #9db9d4; margin:2px 0;"></div>
            <div style="border-top:2px solid #9db9d4; margin:2px 0;"></div>
        </div>

    </div>

   
    <p style="margin-top:25px; border-bottom:2px solid #c3d3e2; padding-bottom:10px; font-style:italic; color:#1f4e8c; font-size: 20px; margin-left: 20px;">
         ${getRemark()}
    </p>

</div>
<p  style="border-bottom: 6px dashed #9db9d4; margin-top: 60px; " ></p>

  
    <div style="margin-top:20px;">
        <p style="color:#1f4e8c;"> Date: <span style="color: #2e3f57; font-weight: bolder; "> ${data.date}</span></p>

        <div style="display:flex; justify-content:space-between; margin-top:50px;">
            <div style="text-align:center; width:40%;">
               
                <div style="border-top:2px solid  #9db9d4; margin-top:5px; font-style: italic; font-size: 20px;"> <span style="color: #1f4e8c;"> Class Teacher</span></div>
            </div>

            <div style="text-align:center; width:40%;">
              
                <div style="border-top:2px solid #9db9d4; margin-top:5px; font-style: italic; font-size: 20px;"> <span style="color: #1f4e8c;"> Principal</span></div>
            </div>
        </div>
    </div>

   
   

</div>

</body>
</html>
`;
};