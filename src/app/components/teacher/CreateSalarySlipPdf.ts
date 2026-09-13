// // components/CreateSalarySlipPdf.ts

// export interface SalarySlipPdfData {
//   instituteName: string;
//   instituteAddress?: string;
//   institutePhone?: string;
//   instituteEmail?: string;
//   instituteLogo?: string;
//   instituteSignature?: string;
//   gstNo?: string;

//   teacherName?: string;
//   teacherId?: string;
//   designation?: string;
//   bankAccountNo?: string;
//   payableDays?: number | string;

//   salaryMonth: string;
//   salaryDate: string;

//   baseSalary: number;
//   allowances?: number;
//   netSalary: number;
//   amountPaid: number;

//   pfDeduction?: number;
//   esiDeduction?: number;
//   otherDeduction?: number;
//   totalDeductions?: number;

//   salleryStatus?: string;
//   salleryMode?: string;
//   transactionReference?: string;
// }

// // Amount to Words Converter (Indian Currency)
// export const numberToWords = (num: number): string => {
//   if (!num || num === 0) return "Zero Rupees Only";
//   const a = [
//     "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
//     "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
//   ];
//   const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

//   const inWords = (n: number): string => {
//     if (n < 20) return a[n];
//     if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
//     if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
//     if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
//     if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
//     return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
//   };

//   return inWords(Math.floor(num)) + " Rupees Only";
// };

// export const createSalarySlipPdf = (data: SalarySlipPdfData): string => {
//   const baseSalary = Number(data.baseSalary || 0);
//   const netSalary = Number(data.netSalary || 0);
//   const pf = Number(data.pfDeduction || 0);
//   const esi = Number(data.esiDeduction || 0);
//   const otherDeduction = Number(data.otherDeduction || 0);
  
//   // Calculate total deductions
//   const totalDeductions = data.totalDeductions !== undefined
//     ? Number(data.totalDeductions)
//     : (baseSalary - netSalary > 0 ? (baseSalary - netSalary) : (pf + esi + otherDeduction));

//   const totalEarnings = baseSalary + Number(data.allowances || 0);
//   const amountInWords = numberToWords(netSalary);

//   const formattedDate = data.salaryDate
//     ? new Date(data.salaryDate).toLocaleDateString("en-GB")
//     : new Date().toLocaleDateString("en-GB");

//   return `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <title>Salary Slip - ${data.teacherName || data.teacherId || "Employee"}</title>
// <style>
//   @page {
//     size: A4 portrait;
//     margin: 8mm;
//   }
  
//   * {
//     box-sizing: border-box;
//     -webkit-print-color-adjust: exact !important;
//     print-color-adjust: exact !important;
//   }

//   body {
//     margin: 0;
//     padding: 0;
//     background: #ffffff;
//     font-family: 'Helvetica Neue', Arial, sans-serif;
//     color: #222;
//   }

//   .slip-box {
//     width: 100%;
//     max-width: 850px;
//     margin: 0 auto;
//     background: #ffffff;
//     border: 3px solid #800000;
//     padding: 16px;
//     border-radius: 6px;
//   }

//   /* TOP HEADER TABLE */
//   .header-table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-bottom: 12px;
//   }

//   .logo-cell {
//     width: 100px;
//     vertical-align: middle;
//     text-align: center;
//   }

//   .logo-cell img {
//     max-width: 90px;
//     max-height: 90px;
//     object-fit: contain;
//   }

//   .v-divider {
//     width: 2px;
//     background-color: #800000;
//     padding: 0;
//   }

//   .info-cell {
//     text-align: center;
//     padding: 0 12px;
//     vertical-align: middle;
//   }

//   .inst-title {
//     font-size: 28px;
//     font-weight: 900;
//     color: #800000;
//     margin: 0;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//   }

//   .inst-subtitle {
//     font-size: 12px;
//     font-weight: 700;
//     color: #800000;
//     margin-top: 4px;
//     text-transform: uppercase;
//     border-bottom: 2px solid #800000;
//     display: inline-block;
//     padding-bottom: 2px;
//   }

//   .inst-address {
//     font-size: 11px;
//     color: #333;
//     margin-top: 6px;
//     line-height: 1.3;
//   }

//   .inst-links {
//     font-size: 11px;
//     color: #333;
//     margin-top: 4px;
//     font-weight: 600;
//   }

//   .right-header-cell {
//     width: 220px;
//     vertical-align: top;
//     text-align: right;
//   }

//   .gst-badge {
//     border: 1.5px solid #800000;
//     border-radius: 6px;
//     overflow: hidden;
//     margin-bottom: 8px;
//     width: 100%;
//     text-align: center;
//   }

//   .gst-title {
//     background: #800000;
//     color: #ffffff;
//     font-size: 11px;
//     font-weight: bold;
//     padding: 2px 4px;
//     text-transform: uppercase;
//   }

//   .gst-value {
//     font-size: 11px;
//     font-weight: bold;
//     color: #111;
//     padding: 3px 4px;
//     background: #fff;
//   }

//   .slip-title-badge {
//     background: #800000;
//     color: #ffffff;
//     font-size: 13px;
//     font-weight: 800;
//     padding: 6px 8px;
//     border-radius: 6px;
//     text-align: center;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     margin-bottom: 10px;
//   }

//   .meta-info {
//     font-size: 12px;
//     font-weight: 700;
//     color: #222;
//     line-height: 1.6;
//     text-align: left;
//     padding-left: 10px;
//   }

//   /* EMPLOYEE DETAILS CONTAINER */
//   .emp-container {
//     border: 1.5px solid #800000;
//     border-radius: 8px;
//     padding: 10px 14px;
//     margin-bottom: 14px;
//     background: #fff;
//   }

//   .emp-table {
//     width: 100%;
//     border-collapse: collapse;
//     font-size: 12px;
//   }

//   .emp-table td {
//     padding: 5px 6px;
//     vertical-align: middle;
//   }

//   .emp-icon {
//     width: 20px;
//     text-align: center;
//     font-size: 13px;
//   }

//   .emp-lbl {
//     font-weight: 700;
//     color: #222;
//     width: 120px;
//   }

//   .emp-val-line {
//     border-bottom: 1px solid #777;
//     padding-left: 6px;
//     font-weight: 600;
//     color: #111;
//   }

//   /* SALARY TABLE */
//   .salary-table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-bottom: 12px;
//     font-size: 12px;
//   }

//   .salary-table th {
//     background: #800000;
//     color: #ffffff;
//     font-weight: bold;
//     padding: 8px 10px;
//     border: 1px solid #800000;
//     text-align: center;
//     text-transform: uppercase;
//     font-size: 11px;
//     letter-spacing: 0.5px;
//   }

//   .salary-table td {
//     border: 1px solid #800000;
//     padding: 8px 10px;
//     vertical-align: middle;
//   }

//   .row-light {
//     background: #ffffff;
//   }

//   .total-row td {
//     background: #FFF8DC;
//     font-weight: bold;
//     font-size: 12px;
//     color: #000;
//     border: 1px solid #800000;
//   }

//   .net-payable-row td {
//     background: #800000;
//     color: #ffffff;
//     font-weight: 900;
//     font-size: 14px;
//     padding: 8px 12px;
//     text-transform: uppercase;
//   }

//   /* WORDS CONTAINER */
//   .words-container {
//     border: 1.5px solid #800000;
//     border-radius: 8px;
//     padding: 8px 12px;
//     margin-bottom: 25px;
//     background: #ffffff;
//     display: flex;
//     align-items: center;
//     font-size: 12px;
//     font-weight: bold;
//   }

//   .rupee-icon {
//     width: 24px;
//     height: 24px;
//     background: #800000;
//     color: #ffffff;
//     border-radius: 50%;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     font-weight: bold;
//     font-size: 14px;
//     margin-right: 10px;
//     flex-shrink: 0;
//   }

//   /* FOOTER SECTION */
//   .footer-table {
//     width: 100%;
//     margin-top: 30px;
//     margin-bottom: 10px;
//   }

//   .footer-table td {
//     vertical-align: bottom;
//     text-align: center;
//   }

//   .sig-box {
//     width: 220px;
//     margin: 0 auto;
//   }

//   .sig-img {
//     height: 45px;
//     max-width: 200px;
//     object-fit: contain;
//     mix-blend-mode: multiply;
//   }

//   .sig-dashed-line {
//     border-top: 1.5px dashed #800000;
//     margin-top: 5px;
//     padding-top: 4px;
//     font-size: 12px;
//     font-weight: bold;
//     color: #222;
//   }

//   .stamp-seal-circle {
//     width: 90px;
//     height: 90px;
//     border: 2px dashed #800000;
//     border-radius: 50%;
//     margin: 0 auto;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     font-size: 9px;
//     font-weight: bold;
//     color: #800000;
//     text-transform: uppercase;
//     padding: 6px;
//     text-align: center;
//     line-height: 1.2;
//     box-sizing: border-box;
//   }

//   /* BOTTOM BANNER */
//   .bottom-banner {
//     background: #800000;
//     color: #ffffff;
//     text-align: center;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 6px;
//     margin-top: 15px;
//     border-radius: 2px;
//     letter-spacing: 0.3px;
//   }
// </style>
// </head>
// <body>

// <div class="slip-box">

//   <!-- TOP HEADER -->
//   <table class="header-table">
//     <tr>
//       <!-- LEFT LOGO -->
//       <td class="logo-cell">
//         ${data.instituteLogo ? `
//           <img src="${data.instituteLogo}" crossorigin="anonymous" alt="Logo" />
//         ` : `
//           <div style="width:70px; height:70px; border-radius:50%; border:2px solid #800000; display:flex; align-items:center; justify-content:center; color:#800000; font-weight:bold; font-size:24px; margin:0 auto;">
//             ${(data.instituteName || "INST")[0]}
//           </div>
//         `}
//       </td>

//       <!-- VERTICAL DIVIDER -->
//       <td class="v-divider"></td>

//       <!-- CENTER DETAILS -->
//       <td class="info-cell">
//         <h1 class="inst-title">${data.instituteName}</h1>
//         <div class="inst-subtitle">COMPUTER AND VOCATIONAL TRAINING INSTITUTE</div>
//         <div class="inst-address">
//           📍 ${data.instituteAddress || "Institute Address"}
//         </div>
//         <div class="inst-links">
//           ${data.instituteEmail ? `🌐 ${data.instituteEmail} &nbsp;|&nbsp; ` : ""} 📞 ${data.institutePhone || "N/A"}
//         </div>
//       </td>

//       <!-- RIGHT GST & BADGE -->
//       <td class="right-header-cell">
//         <div class="gst-badge">
//           <div class="gst-title">GSTIN</div>
//           <div class="gst-value">${data.gstNo || "N/A"}</div>
//         </div>

//         <div class="slip-title-badge">
//           EMPLOYEE SALARY SLIP
//         </div>

//         <div class="meta-info">
//           <div><b>Month :</b> ${data.salaryMonth}</div>
//           <div><b>Date :</b> ${formattedDate}</div>
//         </div>
//       </td>
//     </tr>
//   </table>

//   <!-- EMPLOYEE DETAILS CARD -->
//   <div class="emp-container">
//     <table class="emp-table">
//       <tr>
//         <!-- LEFT COLUMN -->
//         <td class="emp-icon">👤</td>
//         <td class="emp-lbl">Employee Name</td>
//         <td style="width:10px;">:</td>
//         <td class="emp-val-line">${data.teacherName || data.teacherId || "N/A"}</td>

//         <td style="width:30px;"></td>

//         <!-- RIGHT COLUMN -->
//         <td class="emp-icon">📅</td>
//         <td class="emp-lbl">Salary Month</td>
//         <td style="width:10px;">:</td>
//         <td class="emp-val-line">${data.salaryMonth}</td>
//       </tr>

//       <tr>
//         <td class="emp-icon">🪪</td>
//         <td class="emp-lbl">Employee ID</td>
//         <td>:</td>
//         <td class="emp-val-line">${data.teacherId || "N/A"}</td>

//         <td></td>

//         <td class="emp-icon">📅</td>
//         <td class="emp-lbl">Payable Days</td>
//         <td>:</td>
//         <td class="emp-val-line">${data.payableDays || 30}</td>
//       </tr>

//       <tr>
//         <td class="emp-icon">👤</td>
//         <td class="emp-lbl">Designation</td>
//         <td>:</td>
//         <td class="emp-val-line">${data.designation || "Teacher"}</td>

//         <td></td>

//         <td class="emp-icon">🏦</td>
//         <td class="emp-lbl">Bank A/C No.</td>
//         <td>:</td>
//         <td class="emp-val-line">${data.bankAccountNo || "N/A"}</td>
//       </tr>
//     </table>
//   </div>

//   <!-- EARNINGS & DEDUCTIONS TABLE -->
//   <table class="salary-table">
//     <thead>
//       <tr>
//         <th style="width:35%;">EARNINGS</th>
//         <th style="width:15%;">AMOUNT (₹)</th>
//         <th style="width:35%;">DEDUCTIONS</th>
//         <th style="width:15%;">AMOUNT (₹)</th>
//       </tr>
//     </thead>
//     <tbody>
//       <!-- ROW 1 -->
//       <tr class="row-light">
//         <td><b>1. BASE SALARY</b></td>
//         <td style="text-align:right;">₹ ${baseSalary.toLocaleString("en-IN")}</td>
//         <td>
//           <b>1. PF DEDUCTION</b><br/>
//           <span style="font-size:10px; color:#555;">(Employee's Contribution)</span>
//         </td>
//         <td style="text-align:right;">(-) ₹ ${pf.toLocaleString("en-IN")}</td>
//       </tr>

//       <!-- ROW 2 -->
//       <tr class="row-light">
//         <td><b>2. ALLOWANCES</b></td>
//         <td style="text-align:right;">${data.allowances ? `₹ ${Number(data.allowances).toLocaleString("en-IN")}` : "-"}</td>
//         <td><b>2. ESI DEDUCTION</b></td>
//         <td style="text-align:right;">(-) ₹ ${esi.toLocaleString("en-IN")}</td>
//       </tr>

//       <!-- ROW 3 -->
//       <tr class="row-light">
//         <td></td>
//         <td></td>
//         <td>
//           <b>3. OTHER DEDUCTION</b><br/>
//           <span style="font-size:10px; color:#555;">(Tax / Advance / Loan / Penalty)</span>
//         </td>
//         <td style="text-align:right;">(-) ₹ ${otherDeduction.toLocaleString("en-IN")}</td>
//       </tr>

//       <!-- TOTAL ROW -->
//       <tr class="total-row">
//         <td>TOTAL EARNINGS</td>
//         <td style="text-align:right;">₹ ${totalEarnings.toLocaleString("en-IN")}</td>
//         <td>TOTAL DEDUCTIONS</td>
//         <td style="text-align:right;">(-) ₹ ${totalDeductions.toLocaleString("en-IN")}</td>
//       </tr>

//       <!-- NET PAYABLE ROW -->
//       <tr class="net-payable-row">
//         <td colspan="2" style="border-right:none;">NET SALARY PAYABLE</td>
//         <td colspan="2" style="text-align:right; border-left:none;">
//           ₹ ${netSalary.toLocaleString("en-IN")}
//         </td>
//       </tr>
//     </tbody>
//   </table>

//   <!-- AMOUNT IN WORDS -->
//   <div class="words-container">
//     <div class="rupee-icon">₹</div>
//     <div>
//       <span style="color:#800000; font-weight:800;">Amount in Words :</span>
//       <span style="margin-left:6px; color:#111;">${amountInWords}</span>
//     </div>
//   </div>

//   <!-- FOOTER SIGNATURES & STAMP -->
//   <table class="footer-table">
//     <tr>
//       <!-- AUTHORIZED SIGNATURE -->
//       <td style="width:35%;">
//         <div class="sig-box">
//           ${data.instituteSignature ? `
//             <img src="${data.instituteSignature}" crossorigin="anonymous" class="sig-img" alt="Authorized Signature" />
//           ` : `<div style="height:45px;"></div>`}
//           <div class="sig-dashed-line">
//             Authorized Signature<br/>
//             <span style="font-size:10px; font-weight:normal;">(${data.instituteName})</span>
//           </div>
//         </div>
//       </td>

//       <!-- CENTER STAMP SEAL -->
//       <td style="width:30%;">
//         <div class="stamp-seal-circle">
//           ★ ${data.instituteName.slice(0, 18)} ★<br/>
//           OFFICIAL STAMP<br/>
//           PVT. LTD.
//         </div>
//       </td>

//       <!-- EMPLOYEE SIGNATURE -->
//       <td style="width:35%;">
//         <div class="sig-box">
//           <div style="height:45px;"></div>
//           <div class="sig-dashed-line">
//             Employee Signature
//           </div>
//         </div>
//       </td>
//     </tr>
//   </table>

//   <!-- BOTTOM BANNER -->
//   <div class="bottom-banner">
//     This is a computer generated slip. No signature is required.
//   </div>

// </div>

// </body>
// </html>
//   `;
// };


// components/CreateSalarySlipPdf.ts
// components/CreateSalarySlipPdf.ts

export interface SalarySlipPdfData {
  instituteName: string;
  instituteAddress?: string;
  institutePhone?: string;
  instituteEmail?: string;
  instituteLogo?: string;
  instituteSignature?: string;
  gstNo?: string;

  teacherName?: string;
  teacherId?: string;
  designation?: string;
  bankAccountNo?: string;
  payableDays?: number | string;

  salaryMonth: string;
  salaryDate: string;

  baseSalary: number;
  allowances?: number;
  netSalary: number;
  amountPaid: number;

  pfDeduction?: number;
  esiDeduction?: number;
  otherDeduction?: number;
  totalDeductions?: number;

  salleryStatus?: string;
  salleryMode?: string;
  transactionReference?: string;
}

// Amount to Words Converter (Indian Currency)
export const numberToWords = (num: number): string => {
  if (!num || num === 0) return "Zero Rupees Only";
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
  };

  return inWords(Math.floor(num)) + " Rupees Only";
};

export const createSalarySlipPdf = (data: SalarySlipPdfData): string => {
  const baseSalary = Number(data.baseSalary || 0);
  const netSalary = Number(data.netSalary || 0);
  const pf = Number(data.pfDeduction || 0);
  const esi = Number(data.esiDeduction || 0);
  const otherDeduction = Number(data.otherDeduction || 0);
  
  // Calculate total deductions
  const totalDeductions = data.totalDeductions !== undefined
    ? Number(data.totalDeductions)
    : (baseSalary - netSalary > 0 ? (baseSalary - netSalary) : (pf + esi + otherDeduction));

  const totalEarnings = baseSalary + Number(data.allowances || 0);
  const amountInWords = numberToWords(netSalary);

  const formattedDate = data.salaryDate
    ? new Date(data.salaryDate).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Salary Slip - ${data.teacherName || data.teacherId || "Employee"}</title>
<style>
  @page {
    size: A4 landscape;
    margin: 4mm;
  }
  
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #222;
  }

  .slip-box {
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
    background: #ffffff;
    border: 3px solid #800000;
    padding: 12px 18px;
    border-radius: 6px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* TOP HEADER TABLE */
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
  }

  .logo-cell {
    width: 100px;
    vertical-align: middle;
    text-align: center;
  }

  .logo-cell img {
    max-width: 85px;
    max-height: 85px;
    object-fit: contain;
  }

  .v-divider {
    width: 2px;
    background-color: #800000;
    padding: 0;
  }

  .info-cell {
    text-align: center;
    padding: 0 12px;
    vertical-align: middle;
  }

  .inst-title {
    font-size: 30px;
    font-weight: 900;
    color: #800000;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }

  .inst-subtitle {
    font-size: 12px;
    font-weight: 700;
    color: #800000;
    margin-top: 3px;
    text-transform: uppercase;
    border-bottom: 2px solid #800000;
    display: inline-block;
    padding-bottom: 1px;
  }

  .inst-address {
    font-size: 11px;
    color: #333;
    margin-top: 4px;
    line-height: 1.2;
  }

  .inst-links {
    font-size: 11px;
    color: #333;
    margin-top: 3px;
    font-weight: 600;
  }

  .right-header-cell {
    width: 220px;
    vertical-align: top;
    text-align: right;
  }

  .gst-badge {
    border: 1.5px solid #800000;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 6px;
    width: 100%;
    text-align: center;
  }

  .gst-title {
    background: #800000;
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 4px;
    text-transform: uppercase;
  }

  .gst-value {
    font-size: 11px;
    font-weight: bold;
    color: #111;
    padding: 2px 4px;
    background: #fff;
  }

  .slip-title-badge {
    background: #800000;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    padding: 5px 8px;
    border-radius: 4px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .meta-info {
    font-size: 11px;
    font-weight: 700;
    color: #222;
    line-height: 1.5;
    text-align: left;
    padding-left: 8px;
  }

  /* EMPLOYEE DETAILS CONTAINER */
  .emp-container {
    border: 1.5px solid #800000;
    border-radius: 6px;
    padding: 6px 12px;
    margin-bottom: 10px;
    background: #fff;
  }

  .emp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .emp-table td {
    padding: 3px 4px;
    vertical-align: middle;
  }

  .emp-icon {
    width: 20px;
    text-align: center;
    font-size: 13px;
  }

  .emp-lbl {
    font-weight: 700;
    color: #222;
    width: 120px;
  }

  .emp-val-line {
    border-bottom: 1px solid #777;
    padding-left: 6px;
    font-weight: 600;
    color: #111;
  }

  /* SALARY TABLE */
  .salary-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 12px;
  }

  .salary-table th {
    background: #800000;
    color: #ffffff;
    font-weight: bold;
    padding: 6px 10px;
    border: 1px solid #800000;
    text-align: center;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
  }

  .salary-table td {
    border: 1px solid #800000;
    padding: 5px 10px;
    vertical-align: middle;
  }

  .row-light {
    background: #ffffff;
  }

  .total-row td {
    background: #FFF8DC;
    font-weight: bold;
    font-size: 12px;
    color: #000;
    border: 1px solid #800000;
  }

  .net-payable-row td {
    background: #800000;
    color: #ffffff;
    font-weight: 900;
    font-size: 13px;
    padding: 6px 10px;
    text-transform: uppercase;
  }

  /* WORDS CONTAINER */
  .words-container {
    border: 1.5px solid #800000;
    border-radius: 6px;
    padding: 6px 12px;
    margin-bottom: 12px;
    background: #ffffff;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
  }

  .rupee-icon {
    width: 22px;
    height: 22px;
    background: #800000;
    color: #ffffff;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 13px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  /* FOOTER SECTION */
  .footer-table {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 6px;
  }

  .footer-table td {
    vertical-align: bottom;
    text-align: center;
  }

  .sig-box {
    width: 230px;
    margin: 0 auto;
  }

  .sig-img {
    height: 38px;
    max-width: 200px;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  .sig-dashed-line {
    border-top: 1.5px dashed #800000;
    margin-top: 3px;
    padding-top: 3px;
    font-size: 11px;
    font-weight: bold;
    color: #222;
  }

  .stamp-seal-circle {
    width: 75px;
    height: 75px;
    border: 1.5px dashed #800000;
    border-radius: 50%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: bold;
    color: #800000;
    text-transform: uppercase;
    padding: 4px;
    text-align: center;
    line-height: 1.1;
    box-sizing: border-box;
  }

  /* BOTTOM BANNER */
  .bottom-banner {
    background: #800000;
    color: #ffffff;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    padding: 5px;
    margin-top: 8px;
    border-radius: 2px;
    letter-spacing: 0.3px;
  }
</style>
</head>
<body>

<div class="slip-box">

  <!-- TOP HEADER -->
  <table class="header-table">
    <tr>
      <!-- LEFT LOGO -->
      <td class="logo-cell">
        ${data.instituteLogo ? `
          <img src="${data.instituteLogo}" crossorigin="anonymous" alt="Logo" />
        ` : `
          <div style="width:70px; height:70px; border-radius:50%; border:2px solid #800000; display:flex; align-items:center; justify-content:center; color:#800000; font-weight:bold; font-size:24px; margin:0 auto;">
            ${(data.instituteName || "INST")[0]}
          </div>
        `}
      </td>

      <!-- VERTICAL DIVIDER -->
      <td class="v-divider"></td>

      <!-- CENTER DETAILS -->
      <td class="info-cell">
        <h1 class="inst-title">${data.instituteName}</h1>
       
        <div class="inst-address">
          📍 ${data.instituteAddress || "Institute Address"}
        </div>
        <div class="inst-links">
          ${data.instituteEmail ? `🌐 ${data.instituteEmail} &nbsp;|&nbsp; ` : ""} 📞 ${data.institutePhone || "N/A"}
        </div>
      </td>

      <!-- RIGHT GST & BADGE -->
      <td class="right-header-cell">
        <div class="gst-badge">
          <div class="gst-title">GSTIN</div>
          <div class="gst-value">${data.gstNo || "N/A"}</div>
        </div>

        <div class="slip-title-badge">
          EMPLOYEE SALARY SLIP
        </div>

        <div class="meta-info">
          <div><b>Month :</b> ${data.salaryMonth}</div>
          <div><b>Date :</b> ${formattedDate}</div>
        </div>
      </td>
    </tr>
  </table>

  <!-- EMPLOYEE DETAILS CARD -->
  <div class="emp-container">
    <table class="emp-table">
      <tr>
        <!-- LEFT COLUMN -->
        <td class="emp-icon">👤</td>
        <td class="emp-lbl">Employee Name</td>
        <td style="width:10px;">:</td>
        <td class="emp-val-line">${data.teacherName || data.teacherId || "N/A"}</td>

        <td style="width:30px;"></td>

        <!-- RIGHT COLUMN -->
        <td class="emp-icon">📅</td>
        <td class="emp-lbl">Salary Month</td>
        <td style="width:10px;">:</td>
        <td class="emp-val-line">${data.salaryMonth}</td>
      </tr>

      <tr>
        <td class="emp-icon">🪪</td>
        <td class="emp-lbl">Employee ID</td>
        <td>:</td>
        <td class="emp-val-line">${data.teacherId || "N/A"}</td>

        <td></td>

        <td class="emp-icon">📅</td>
        <td class="emp-lbl">Payable Days</td>
        <td>:</td>
        <td class="emp-val-line">${data.payableDays || 30}</td>
      </tr>

      <tr>
        <td class="emp-icon">👤</td>
        <td class="emp-lbl">Designation</td>
        <td>:</td>
        <td class="emp-val-line">${data.designation || "Teacher"}</td>

        <td></td>

        <td class="emp-icon">🏦</td>
        <td class="emp-lbl">Bank A/C No.</td>
        <td>:</td>
        <td class="emp-val-line">${data.bankAccountNo || "N/A"}</td>
      </tr>
    </table>
  </div>

  <!-- EARNINGS & DEDUCTIONS TABLE -->
  <table class="salary-table">
    <thead>
      <tr>
        <th style="width:35%;">EARNINGS</th>
        <th style="width:15%;">AMOUNT (₹)</th>
        <th style="width:35%;">DEDUCTIONS</th>
        <th style="width:15%;">AMOUNT (₹)</th>
      </tr>
    </thead>
    <tbody>
      <!-- ROW 1 -->
      <tr class="row-light">
        <td><b>1. BASE SALARY</b></td>
        <td style="text-align:right;">₹ ${baseSalary.toLocaleString("en-IN")}</td>
        <td>
          <b>1. PF DEDUCTION</b><br/>
          <span style="font-size:10px; color:#555;">(Employee's Contribution)</span>
        </td>
        <td style="text-align:right;">(-) ₹ ${pf.toLocaleString("en-IN")}</td>
      </tr>

      <!-- ROW 2 -->
      <tr class="row-light">
        <td><b>2. ALLOWANCES</b></td>
        <td style="text-align:right;">${data.allowances ? `₹ ${Number(data.allowances).toLocaleString("en-IN")}` : "-"}</td>
        <td><b>2. ESI DEDUCTION</b></td>
        <td style="text-align:right;">(-) ₹ ${esi.toLocaleString("en-IN")}</td>
      </tr>

      <!-- ROW 3 -->
      <tr class="row-light">
        <td></td>
        <td></td>
        <td>
          <b>3. OTHER DEDUCTION</b><br/>
          <span style="font-size:10px; color:#555;">(Tax / Advance / Loan / Penalty)</span>
        </td>
        <td style="text-align:right;">(-) ₹ ${otherDeduction.toLocaleString("en-IN")}</td>
      </tr>

      <!-- TOTAL ROW -->
      <tr class="total-row">
        <td>TOTAL EARNINGS</td>
        <td style="text-align:right;">₹ ${totalEarnings.toLocaleString("en-IN")}</td>
        <td>TOTAL DEDUCTIONS</td>
        <td style="text-align:right;">(-) ₹ ${totalDeductions.toLocaleString("en-IN")}</td>
      </tr>

      <!-- NET PAYABLE ROW -->
      <tr class="net-payable-row">
        <td colspan="2" style="border-right:none;">NET SALARY PAYABLE</td>
        <td colspan="2" style="text-align:right; border-left:none;">
          ₹ ${netSalary.toLocaleString("en-IN")}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- AMOUNT IN WORDS -->
  <div class="words-container">
    <div class="rupee-icon">₹</div>
    <div>
      <span style="color:#800000; font-weight:800;">Amount in Words :</span>
      <span style="margin-left:6px; color:#111;">${amountInWords}</span>
    </div>
  </div>

  <!-- FOOTER SIGNATURES & STAMP -->
  <table class="footer-table">
    <tr>
      <!-- AUTHORIZED SIGNATURE -->
      <td style="width:35%;">
        <div class="sig-box">
          ${data.instituteSignature ? `
            <img src="${data.instituteSignature}" crossorigin="anonymous" class="sig-img" alt="Authorized Signature" />
          ` : `<div style="height:38px;"></div>`}
          <div class="sig-dashed-line">
            Authorized Signature<br/>
            <span style="font-size:10px; font-weight:normal;">(${data.instituteName})</span>
          </div>
        </div>
      </td>

      <!-- CENTER STAMP SEAL -->
      <td style="width:30%;">
        <div class="stamp-seal-circle">
          ★ ${data.instituteName.slice(0, 18)} ★<br/>
          OFFICIAL STAMP<br/>
          PVT. LTD.
        </div>
      </td>

      <!-- EMPLOYEE SIGNATURE -->
      <td style="width:35%;">
        <div class="sig-box">
          <div style="height:38px;"></div>
          <div class="sig-dashed-line">
            Employee Signature
          </div>
        </div>
      </td>
    </tr>
  </table>

  <!-- BOTTOM BANNER -->
  <div class="bottom-banner">
    This is a computer generated slip. No signature is required.
  </div>

</div>

</body>
</html>
  `;
};