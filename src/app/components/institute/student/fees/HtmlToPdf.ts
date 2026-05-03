export function createReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  amountPaid: number, // The current payment amount (e.g., 1000 Rs)
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
  signature: string,
  gstPercent: number = 18 
) {
  const formatCurrency = (num: number) => 
    "₹" + num.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  // 1. Calculate GST breakdown specifically for the CURRENT amount paid (e.g., 1000 Rs)
  const currentTaxableValue = amountPaid / (1 + gstPercent / 100);
  const currentTotalTax = amountPaid - currentTaxableValue;
  const currentSplitGst = currentTotalTax / 2;

  // 2. Overall Totals
  const totalFeeWithGst = paymentRecords[0]?.totalAmount || 0;
  const totalPaidSoFar = paymentRecords.reduce((sum, record) => sum + record.amountPaid, 0);
  const remainingFee = totalFeeWithGst - totalPaidSoFar;
  
  const totalAmountInWords = numberToWords(amountPaid).toUpperCase() + " RUPEES ONLY";
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
      @page { size: A5 landscape; margin: 0; }

      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 6mm;
        background: #fff;
        color: #333;
        font-size: 10px;
      }

      .receipt-card {
        border: 1px solid #000;
        display: flex;
        flex-direction: column;
        padding: 4mm;
        box-sizing: border-box;
        min-height: 132mm;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #000;
        padding-bottom: 8px;
        margin-bottom: 10px;
      }
      .brand { display: flex; align-items: center; gap: 12px; }
      .logo { height: 50px; width: 50px; object-fit: contain; }
      .inst-name { font-size: 16px; font-weight: 700; margin: 0; color: #000; }
      .inst-info { font-size: 8.5px; color: #444; margin: 0; }

      .doc-info { text-align: right; }
      .doc-info h1 { margin: 0; font-size: 16px; font-weight: 700; text-decoration: underline; }

      .grid-container {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        border: 1px solid #ccc;
        margin-bottom: 10px;
      }
      .grid-item { border: 0.5px solid #eee; padding: 5px 8px; }
      .label { font-size: 8px; color: #666; text-transform: uppercase; font-weight: bold; display: block; }
      .value { font-size: 10px; font-weight: 600; color: #000; }

      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th { background: #f2f2f2; border: 1px solid #000; padding: 5px; font-size: 9px; text-transform: uppercase; }
      td { border: 1px solid #ccc; padding: 5px; }

      .footer-layout { display: flex; justify-content: space-between; }
      .footer-left { width: 50%; }
      
      .calculation-table { width: 240px; border: 1px solid #000; }
      .calc-row { display: flex; justify-content: space-between; padding: 3px 8px; border-bottom: 1px solid #eee; }
      .calc-row.current-payment { background: #f0fdf4; border-top: 1px solid #000; font-weight: 600; }
      .calc-row.gst-detail { font-size: 9px; color: #555; padding-left: 15px; }
      .calc-row.bold { font-weight: 700; background: #f9f9f9; border-top: 1px solid #000; }
      
      .amount-words-box { 
        background: #f4f4f4; 
        padding: 6px; 
        border-left: 4px solid #000; 
        font-style: italic;
        margin-bottom: 10px;
      }

      .signature-area { text-align: center; width: 130px; margin-top: 10px; }
      .sig-img { height: 35px; mix-blend-mode: multiply; }
      .sig-line { border-top: 1px solid #000; font-weight: 700; font-size: 9px; padding-top: 2px; }

    </style>
  </head>
  <body>
    <div class="receipt-card">
      
      <div class="header">
        <div class="brand">
          ${instituteLogo ? `<img src="${instituteLogo}" class="logo" />` : ''}
          <div>
            <h2 class="inst-name">${name}</h2>
            <p class="inst-info">${address}</p>
            <p class="inst-info"><b>Call:</b> ${phoneNumber}</p>
          </div>
        </div>
        <div class="doc-info">
          <h1>FEES RECEIPT</h1>
          <p><b>Receipt No:</b> ${receiptNo}</p>
          <p><b>Date:</b> ${formattedDate}</p>
        </div>
      </div>

      <div class="grid-container">
        <div class="grid-item"><span class="label">Student Name</span><span class="value">${studentName}</span></div>
        <div class="grid-item"><span class="label">Course/Batch</span><span class="value">${batchName}</span></div>
        <div class="grid-item"><span class="label">Parent Name</span><span class="value">${parentName}</span></div>
        <div class="grid-item"><span class="label">Payment Status</span><span class="value">${remainingFee <= 0 ? 'FULLY PAID' : 'PARTIALLY PAID'}</span></div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px;">Sr.</th>
            <th>Particulars</th>
            <th>Date</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${installmentsHtml}
        </tbody>
      </table>

      <div class="footer-layout">
        <div class="footer-left">
          <div class="amount-words-box">
            <b>In Words (Current Paid):</b><br/> ${totalAmountInWords}
          </div>
          <p style="font-size: 8px; color: #777;">
            * This receipt shows the GST breakdown for the current partial payment received.<br/>
            * Registration and Material Fees are non-refundable.
          </p>
        </div>

        <div class="calculation-table">
          <div class="calc-row current-payment"><span>Current Amount Received</span><span>${formatCurrency(amountPaid)}</span></div>
          <div class="calc-row gst-detail"><span>Taxable Value</span><span>₹${currentTaxableValue.toFixed(2)}</span></div>
          <div class="calc-row gst-detail"><span>CGST (${gstPercent / 2}%)</span><span>₹${currentSplitGst.toFixed(2)}</span></div>
          <div class="calc-row gst-detail"><span>SGST (${gstPercent / 2}%)</span><span>₹${currentSplitGst.toFixed(2)}</span></div>
          
          <div class="calc-row" style="color: #e74c3c; font-weight:bold; border-top: 1px solid #000;"><span>Balance Amount</span><span>${formatCurrency(remainingFee)}</span></div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: auto;">
        <div class="signature-area">
          ${signature ? `<img src="${signature}" class="sig-img" />` : '<div style="height:35px"></div>'}
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
  signature: string 
) {
  const totalFeeWithGst = paymentRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalPaid = paymentRecords.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const remaining = totalFeeWithGst - totalPaid;

  const totalGstPercent = gst.cgst + gst.sgst;
  
  // 1. Calculations for the Total Course Fee (Top Table)
  const baseTotalFee = totalFeeWithGst / (1 + totalGstPercent / 100);
  const totalTaxAmount = totalFeeWithGst - baseTotalFee;

  // 2. Calculations for the Amount Received (Individual GST breakdown as requested)
  // This calculates how much of the "Paid Amount" is Tax and how much is Base.
  const paidBaseAmount = totalPaid / (1 + totalGstPercent / 100);
  const paidTaxAmount = totalPaid - paidBaseAmount;
  const paidCgst = paidTaxAmount / 2;
  const paidSgst = paidTaxAmount / 2;

  return `
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  @page { size: A4 portrait; margin: 10mm; }
  
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    color: #333;
    line-height: 1.4;
    font-size: 11px;
  }

  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .logo { height: 60px; width: auto; }
  .inst-info { text-align: left; padding-left: 15px; }
  .inst-info h1 { margin: 0; font-size: 18px; color: #000; }
  
  .student-box {
    width: 100%;
    border: 1px solid #ccc;
    margin-bottom: 15px;
  }
  .student-box td {
    border: 0.5px solid #eee;
    padding: 6px 10px;
    width: 50%;
  }

  .fee-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  .fee-table th {
    background: #f4f4f4;
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
    font-weight: 600;
  }
  .fee-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }

  .calculation-area {
    display: flex;
    justify-content: flex-end;
    margin-top: -1px;
  }
  .calc-box {
    width: 45%;
    border: 1px solid #ccc;
    border-top: none;
  }
  .calc-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    border-bottom: 0.5px solid #eee;
  }
  .calc-row.highlight {
    background: #f0fdf4;
    font-weight: 700;
    color: #166534;
  }
  .calc-row.final {
    background: #f9f9f9;
    font-weight: 700;
  }
  .gst-breakdown {
    font-size: 9px;
    color: #666;
    padding-left: 15px;
    font-style: italic;
  }

  .footer-section { margin-top: 30px; display: flex; justify-content: space-between; }
  .terms { font-size: 9px; color: #666; width: 60%; }
  .sig-area { text-align: center; width: 150px; }
  .sig-img { height: 40px; margin-bottom: 5px; }
</style>
</head>
<body>

  <table class="header-table">
    <tr>
      <td style="width: 80px;">
        ${instituteLogo ? `<img src="${instituteLogo}" class="logo" />` : ''}
      </td>
      <td class="inst-info">
        <h1>${name}</h1>
        <div>${address}</div>
        <div>Contact: ${phoneNumber}</div>
      </td>
      <td style="text-align: right; vertical-align: top;">
        <h2 style="margin:0; color:#444;">FEE RECEIPT</h2>
        <div style="font-size: 10px; color: #777;">Date: ${new Date().toLocaleDateString("en-IN")}</div>
      </td>
    </tr>
  </table>

  <table class="student-box">
    <tr>
      <td><b>Full Name:</b> ${studentName}</td>
      <td><b>Course/Batch:</b> ${batchName}</td>
    </tr>
    <tr>
      <td><b>Father's Name:</b> ${parentName}</td>
      <td><b>Status:</b> ${remaining <= 0 ? 'PAID' : 'PARTIAL'}</td>
    </tr>
  </table>

  <table class="fee-table">
    <thead>
      <tr>
        <th>Sr.</th>
        <th>Particulars</th>
        <th>Course Fee</th>
        <th>Tax Rate</th>
        <th>Tax Included</th>
        <th>Total Payable</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Total Fees (${batchName})</td>
        <td>₹${baseTotalFee.toFixed(2)}</td>
        <td>${totalGstPercent}%</td>
        <td>₹${totalTaxAmount.toFixed(2)}</td>
        <td>₹${totalFeeWithGst.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div class="calculation-area">
    <div class="calc-box">
      <div class="calc-row final">
        <span>Total Payable Amount</span>
        <span>₹${totalFeeWithGst.toFixed(2)}</span>
      </div>
      
      <!-- Detailed breakdown of the Received Amount -->
      <div class="calc-row highlight">
        <span>Amount Received (Jama Kiya)</span>
        <span>₹${totalPaid.toFixed(2)}</span>
      </div>
      <div class="calc-row gst-breakdown">
        <span> - Taxable Val (Received)</span>
        <span>₹${paidBaseAmount.toFixed(2)}</span>
      </div>
      <div class="calc-row gst-breakdown">
        <span> - CGST on Received (${gst.cgst}%)</span>
        <span>₹${paidCgst.toFixed(2)}</span>
      </div>
      <div class="calc-row gst-breakdown">
        <span> - SGST on Received (${gst.sgst}%)</span>
        <span>₹${paidSgst.toFixed(2)}</span>
      </div>

      <div class="calc-row" style="color: #e74c3c; font-weight: 700; border-top: 1px solid #ccc;">
        <span>Outstanding Balance</span>
        <span>₹${remaining.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <div class="footer-section">
    <div class="terms">
      <b>Terms & Conditions:</b><br/>
      1. This is a computer-generated Fee Summary.<br/>
      2. Fees once paid are non-refundable as per institute policy.<br/>
      3. GST calculations shown above are based on the actual amount received today.
    </div>
    <div class="sig-area">
      ${signature ? `<img src="${signature}" class="sig-img" />` : '<div style="height:40px"></div>'}
      <div style="border-top: 1px solid #000; padding-top: 5px; font-weight: 600;">Authorized Signatory</div>
    </div>
  </div>

</body>
</html>
`;
}