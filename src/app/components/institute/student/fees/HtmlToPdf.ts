export function createReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  amountPaid: number, // The current payment amount
  paymentRecords: {
    amountPaid: number;
    updatedAt: Date;
    name: string;
    totalAmount: number;
  }[],
  name: string,
  instituteLogo: string,
  address: string,
  phoneNumber: string,
  receiptNo: string,
  batchName: string,
  signature: string // Added signature parametergit a
) {
  // Helper for currency formatting
  const formatCurrency = (num: number) => 
    "₹" + num.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const totalAmountInWords = numberToWords(amountPaid).toUpperCase() + " RUPEES ONLY";
  const totalFee = paymentRecords[0]?.totalAmount || 0;
  const totalPaid = paymentRecords.reduce((sum, record) => sum + record.amountPaid, 0);
  const remainingFee = totalFee - totalPaid;
  const formattedDate = new Date(date).toLocaleDateString("en-IN");

  const installmentsHtml = paymentRecords
    .map((record, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${record.name}</td>
        <td>${new Date(record.updatedAt).toLocaleDateString("en-IN")}</td>
        <td style="text-align: right; font-weight: 600;">${formatCurrency(record.amountPaid)}</td>
      </tr>
    `).join("");

  return `
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      
      @page {
        size: A5 landscape;
        margin: 0;
      }

      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 8mm;
        background: #fff;
        color: #333;
      }

      .receipt-card {
        border: 1px solid #000;
        max-height: 130mm; /* Fits A5 Landscape height */
        display: flex;
        flex-direction: column;
        padding: 5mm;
        box-sizing: border-box;
      }

      /* HEADER */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #333;
        padding-bottom: 8px;
        margin-bottom: 10px;
      }

      .brand { display: flex; align-items: center; gap: 10px; }
      .logo { height: 45px; width: 45px; object-fit: contain; }
      .inst-name { font-size: 16px; font-weight: 700; margin: 0; text-transform: uppercase; }
      .inst-info { font-size: 9px; color: #555; margin: 0; }

      .receipt-label { text-align: right; }
      .receipt-label h1 { margin: 0; font-size: 18px; color: #333; }
      .receipt-label p { margin: 0; font-size: 10px; font-weight: 600; }

      /* STUDENT INFO GRID */
      .student-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 20px;
        margin-bottom: 12px;
        font-size: 11px;
      }
      .info-row { display: flex; border-bottom: 1px dotted #ccc; padding-bottom: 2px; }
      .label { color: #666; width: 90px; font-size: 9px; text-transform: uppercase; }
      .value { font-weight: 600; color: #000; }

      /* TABLE */
      .table-container {
        flex-grow: 1;
        overflow: hidden;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 10px;
      }
      th {
        background: #f2f2f2;
        text-align: left;
        padding: 6px;
        border: 1px solid #333;
        text-transform: uppercase;
        font-size: 9px;
      }
      td {
        padding: 5px 6px;
        border: 1px solid #eee;
      }

      /* FOOTER SECTION */
      .footer {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .footer-left { width: 50%; }
      .amount-words { 
        font-size: 9px; 
        font-style: italic; 
        background: #f9f9f9; 
        padding: 5px; 
        border-radius: 4px;
        border-left: 3px solid #333;
      }

      .summary-table {
        width: 180px;
        font-size: 11px;
      }
      .summary-row { display: flex; justify-content: space-between; padding: 2px 0; }
      .total-row { 
        border-top: 1px solid #333; 
        margin-top: 4px; 
        padding-top: 4px; 
        font-weight: 700; 
        font-size: 12px;
      }

      .signature-area {
        text-align: center;
        width: 120px;
      }
      .sig-img { height: 30px; width: auto; mix-blend-mode: multiply; }
      .sig-line { border-top: 1px solid #000; padding-top: 2px; font-size: 10px; font-weight: 600; }

    </style>
  </head>
  <body>
    <div class="receipt-card">
      
      <!-- HEADER -->
      <div class="header">
        <div class="brand">
          ${instituteLogo ? `<img src="${instituteLogo}" class="logo" />` : ''}
          <div>
            <h2 class="inst-name">${name}</h2>
            <p class="inst-info">${address}</p>
            <p class="inst-info">Ph: ${phoneNumber}</p>
          </div>
        </div>
        <div class="receipt-label">
          <h1>FEES RECEIPT</h1>
          <p>No: ${receiptNo}</p>
          <p>Date: ${formattedDate}</p>
        </div>
      </div>

      <!-- STUDENT DETAILS -->
      <div class="student-info">
        <div class="info-row"><span class="label">Student:</span><span class="value">${studentName}</span></div>
        <div class="info-row"><span class="label">Batch:</span><span class="value">${batchName}</span></div>
        <div class="info-row"><span class="label">Parent:</span><span class="value">${parentName}</span></div>
        <div class="info-row"><span class="label">Status:</span><span class="value">PARTIAL PAID</span></div>
      </div>

      <!-- INSTALLMENTS TABLE -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Installment Name</th>
              <th>Paid Date</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${installmentsHtml}
          </tbody>
        </table>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-left">
          <div class="amount-words">
            <b>In Words:</b> ${totalAmountInWords}
          </div>
          <p style="font-size: 8px; color: #888; margin-top: 10px;">* This is an official receipt for the payment received.</p>
        </div>

        <div class="summary-table">
          <div class="summary-row"><span>Total Fees:</span><span>${formatCurrency(totalFee)}</span></div>
          <div class="summary-row"><span>Total Paid:</span><span>${formatCurrency(totalPaid)}</span></div>
          <div class="summary-row total-row" style="color: #d63031;"><span>Balance:</span><span>${formatCurrency(remainingFee)}</span></div>
        </div>

        <div class="signature-area">
          ${signature ? `<img src="${signature}" class="sig-img" />` : '<div style="height:30px"></div>'}
          <div class="sig-line">Authorized Signatory</div>
        </div>
      </div>

    </div>
  </body>
  </html>
  `;
}

// Ensure your numberToWords function remains in the same file

function numberToWords(number: number) {
  const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  function convertTwoDigitNumber(num: number) {
    if (num < 10) return words[num];
    if (num >= 11 && num <= 19) return teens[num - 10];
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + words[num % 10] : "");
  }

  function convertThreeDigitNumber(num: number) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    return hundred
      ? words[hundred] + " hundred" + (rest ? " and " + convertTwoDigitNumber(rest) : "")
      : convertTwoDigitNumber(rest);
  }

  function convertNumberWithThousands(num: number) {
    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    return thousand
      ? convertThreeDigitNumber(thousand) + " thousand" + (rest ? " " + convertThreeDigitNumber(rest) : "")
      : convertThreeDigitNumber(rest);
  }

  if (number < 0) return "Invalid number";
  if (number >= 100000) return "Limit exceeded";

  return convertNumberWithThousands(number);
}


export function createFullFeeOverviewPdf(
  studentName: string,
  parentName: string,
  paymentRecords: {
    amountPaid: number;
    updatedAt: Date;
    name: string;
    totalAmount: number;
  }[],
  name: string,
  instituteLogo: string,
  address: string,
  phoneNumber: string,
  batchName: string,
  gst: {
    sgst: number;
    cgst: number;
  },
  signature: string // Expecting a URL or Base64 string
) {
  const totalFeeWithGst = paymentRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalPaid = paymentRecords.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const remaining = totalFeeWithGst - totalPaid;

  const totalGstPercent = gst.cgst + gst.sgst;
  const baseTotalFee = totalFeeWithGst / (1 + totalGstPercent / 100);
  const totalTaxAmount = totalFeeWithGst - baseTotalFee;

  return `
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  @page { size: A5 landscape; margin: 0; }
  
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 8mm; /* Reduced padding to save space */
    background: #fff;
    color: #2c3e50;
    line-height: 1.2;
  }

  .statement-container {
    border: 1px solid #d1d8e0;
    max-height: 125mm; /* Fixed height for A5 Landscape */
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* HEADER SECTION */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f9f9f9;
    border-bottom: 2px solid #0fb9b1;
  }

  .brand-area { display: flex; align-items: center; gap: 12px; }
  .logo { height: 45px; width: 45px; object-fit: contain; }
  .inst-details h1 { margin: 0; font-size: 16px; color: #0d1010; text-transform: uppercase; }
  .inst-details p { margin: 0; font-size: 9px; color: #7f8c8d; }

  .doc-label { text-align: right; }
  .doc-label h2 { margin: 0; font-size: 14px; font-weight: 700; color: #2c3e50; }
  .doc-label p { margin: 0; font-size: 9px; color: #95a5a6; }

  /* STUDENT INFO SECTION */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 12px 15px;
    gap: 10px;
    background: #fff;
  }

  .info-item b { font-size: 8px; color: #95a5a6; text-transform: uppercase; display: block; margin-bottom: 2px; }
  .info-item span { font-size: 12px; font-weight: 600; color: #333; }

  /* FINANCIALS */
  .summary-box {
    margin: 0 15px;
    border-top: 1px solid #eee;
    padding-top: 8px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 11px;
  }

  .row.bold { font-weight: 700; font-size: 13px; border-top: 1px solid #eee; margin-top: 5px; padding-top: 8px; }
  .row.highlight { 
    background: #ebfcfb; 
    padding: 6px 8px; 
    border-radius: 4px; 
    color: #06753a; 
    margin-top: 4px;
  }
  .row.danger { 
    background: #fff5f5; 
    padding: 6px 8px; 
    border-radius: 4px; 
    color: #e74c3c; 
    margin-top: 4px;
    font-weight: 700;
  }

  /* FOOTER & SIGNATURE */
  .footer {
    margin-top: auto;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .note { font-size: 8px; color: #bdc3c7; font-style: italic; max-width: 50%; }
  
  .signature-section { text-align: center; width: 120px; }
  .sig-image { height: 35px; width: auto; margin-bottom: 2px; mix-blend-mode: multiply; }
  .sig-line { border-top: 1px solid #333; font-size: 10px; font-weight: 600; padding-top: 2px; }

</style>
</head>
<body>

<div class="statement-container">
  <div class="header">
    <div class="brand-area">
      ${instituteLogo ? `<img src="${instituteLogo}" class="logo" />` : ''}
      <div class="inst-details">
        <h1>${name}</h1>
        <p>${address}</p>
        <p>Ph: ${phoneNumber}</p>
      </div>
    </div>
    <div class="doc-label">
      <h2>FEE SUMMARY</h2>
      <p>Issued: ${new Date().toLocaleDateString("en-IN")}</p>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-item">
      <b>Student Details</b>
      <span>${studentName}</span>
      <div style="font-size: 10px; font-weight: 400; color: #7f8c8d;">Parent: ${parentName}</div>
    </div>
    <div class="info-item">
      <b>Course / Batch</b>
      <span>${batchName}</span>
    </div>
  </div>

  <div class="summary-box">
    <div class="row">
      <span>Course Fee (Base)</span>
      <span>₹${baseTotalFee.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
    </div>
    
    ${totalTaxAmount > 0 ? `
    <div class="row">
      <span>Taxes (GST ${totalGstPercent}%)</span>
      <span>₹${totalTaxAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
    </div>` : ''}

    <div class="row bold">
      <span>Total Payable Amount</span>
      <span>₹${totalFeeWithGst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
    </div>

    <div class="row highlight">
      <span>Total Amount Received </span>
      <span>₹${totalPaid.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
    </div>

    <div class="row danger">
      <span>Outstanding Balance</span>
      <span>₹${remaining.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
    </div>
  </div>

  <div class="footer">
    <div class="note">
      This is a consolidated fee summary. Individual receipts are issued for every transaction.
    </div>
    <div class="signature-section">
      ${signature ? `<img src="${signature}" class="sig-image" />` : '<div style="height:35px"></div>'}
      <div class="sig-line">Authorized Signatory</div>
    </div>
  </div>
</div>

</body>
</html>
`;
}