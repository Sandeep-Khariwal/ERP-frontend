// components/CreateExpenseSlipPdf.ts

export interface ExpenseSlipPdfData {
  instituteName: string;
  instituteAddress?: string;
  institutePhone?: string;
  instituteEmail?: string;
  instituteLogo?: string;
  instituteSignature?: string;
  gstNo?: string;

  expenseId: string;
  title: string;
  category: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string;
  createdAt?: string;
  note?: string;
}

// Amount to Words Converter (Indian Currency System)
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

export const createExpenseSlipPdf = (data: ExpenseSlipPdfData): string => {
  const amount = Number(data.amount || 0);
  const amountInWords = numberToWords(amount);

  const formattedExpenseDate = data.expenseDate
    ? new Date(data.expenseDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "N/A";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Expense Voucher - ${data.expenseId || data.title}</title>
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
    padding: 14px 20px;
    border-radius: 6px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* TOP HEADER TABLE */
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
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
    width: 230px;
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

  /* EXPENSE DETAILS CONTAINER */
  .details-container {
    border: 1.5px solid #800000;
    border-radius: 6px;
    padding: 8px 14px;
    margin-bottom: 12px;
    background: #fff;
  }

  .details-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .details-table td {
    padding: 4px 6px;
    vertical-align: middle;
  }

  .details-icon {
    width: 22px;
    text-align: center;
    font-size: 13px;
  }

  .details-lbl {
    font-weight: 700;
    color: #222;
    width: 130px;
  }

  .details-val-line {
    border-bottom: 1px solid #777;
    padding-left: 6px;
    font-weight: 600;
    color: #111;
  }

  /* EXPENSE TABLE */
  .expense-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 12px;
  }

  .expense-table th {
    background: #800000;
    color: #ffffff;
    font-weight: bold;
    padding: 8px 10px;
    border: 1px solid #800000;
    text-align: center;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
  }

  .expense-table td {
    border: 1px solid #800000;
    padding: 8px 10px;
    vertical-align: middle;
  }

  .row-light {
    background: #ffffff;
  }

  .total-row td {
    background: #FFF8DC;
    font-weight: bold;
    font-size: 13px;
    color: #000;
    border: 1px solid #800000;
  }

  /* WORDS CONTAINER */
  .words-container {
    border: 1.5px solid #800000;
    border-radius: 6px;
    padding: 6px 12px;
    margin-bottom: 14px;
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
    margin-top: 14px;
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
    height: 40px;
    max-width: 200px;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  .sig-dashed-line {
    border-top: 1.5px dashed #800000;
    margin-top: 4px;
    padding-top: 4px;
    font-size: 11px;
    font-weight: bold;
    color: #222;
  }

  .stamp-seal-circle {
    width: 80px;
    height: 80px;
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
    margin-top: 10px;
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
        <div class="inst-subtitle">EXPENSE PAYMENT VOUCHER</div>
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
          EXPENSE RECEIPT
        </div>

        <div class="meta-info">
          <div><b>Voucher No :</b> ${data.expenseId || "N/A"}</div>
          <div><b>Date :</b> ${formattedExpenseDate}</div>
        </div>
      </td>
    </tr>
  </table>

  <!-- EXPENSE SUMMARY DETAILS -->
  <div class="details-container">
    <table class="details-table">
      <tr>
        <td class="details-icon">🧾</td>
        <td class="details-lbl">Voucher / ID</td>
        <td style="width:10px;">:</td>
        <td class="details-val-line">${data.expenseId}</td>

        <td style="width:30px;"></td>

        <td class="details-icon">📅</td>
        <td class="details-lbl">Expense Date</td>
        <td style="width:10px;">:</td>
        <td class="details-val-line">${formattedExpenseDate}</td>
      </tr>

      <tr>
        <td class="details-icon">🏷️</td>
        <td class="details-lbl">Category</td>
        <td>:</td>
        <td class="details-val-line">${data.category}</td>

        <td></td>

        <td class="details-icon">💳</td>
        <td class="details-lbl">Payment Mode</td>
        <td>:</td>
        <td class="details-val-line">${data.paymentMethod}</td>
      </tr>

      ${data.note ? `
      <tr>
        <td class="details-icon">📝</td>
        <td class="details-lbl">Remarks / Note</td>
        <td>:</td>
        <td class="details-val-line" colspan="6">${data.note}</td>
      </tr>
      ` : ""}
    </table>
  </div>

  <!-- PARTICULARS TABLE -->
  <table class="expense-table">
    <thead>
      <tr>
        <th style="width:10%;">S.NO</th>
        <th style="width:45%;">EXPENSE PARTICULARS / TITLE</th>
        <th style="width:20%;">CATEGORY</th>
        <th style="width:25%;">AMOUNT (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr class="row-light">
        <td style="text-align:center;">1</td>
        <td><b>${data.title}</b></td>
        <td style="text-align:center;">${data.category}</td>
        <td style="text-align:right; font-weight:bold;">₹ ${amount.toLocaleString("en-IN")}</td>
      </tr>

      <!-- TOTAL ROW -->
      <tr class="total-row">
        <td colspan="3" style="text-align:right;"><b>TOTAL AMOUNT PAID</b></td>
        <td style="text-align:right; font-size: 14px;"><b>₹ ${amount.toLocaleString("en-IN")}</b></td>
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
          ` : `<div style="height:40px;"></div>`}
          <div class="sig-dashed-line">
            Authorized Signature<br/>
            <span style="font-size:10px; font-weight:normal;">(${data.instituteName})</span>
          </div>
        </div>
      </td>

      <!-- CENTER STAMP SEAL -->
      <td style="width:30%;">
        <div class="stamp-seal-circle">
          ★ ${(data.instituteName || "INSTITUTE").slice(0, 18)} ★<br/>
          OFFICIAL STAMP<br/>
          VERIFIED
        </div>
      </td>

      <!-- RECEIVER / ACCOUNTANT SIGNATURE -->
      <td style="width:35%;">
        <div class="sig-box">
          <div style="height:40px;"></div>
          <div class="sig-dashed-line">
            Accountant / Receiver Signature
          </div>
        </div>
      </td>
    </tr>
  </table>

  <!-- BOTTOM BANNER -->
  <div class="bottom-banner">
    This is a computer generated expense voucher. Valid for official records and audit.
  </div>

</div>

</body>
</html>
  `;
};