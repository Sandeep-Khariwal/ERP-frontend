export function createReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  amountPaid: number, // Current payment amount
  paymentRecords: {
    amountPaid: number;
    updatedAt: Date;
    name: string;
    totalAmount: number;
    description?: string;
    dueDate: Date;
  }[],
  name: string,
  instituteLogo: string,
  address: string,
  phoneNumber: string,
  receiptNo: string,
  batchName: string,
  signature: string,
  gstPercent: number = 0,
  vanfareRecords: {
    amountPaid: number;
    totalAmount: number;
    name: string;
  }[] = []
) {
  const formatCurrency = (num: number) =>
    "₹" + num.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  // 1. Calculate GST breakdown for CURRENT amount paid
  const currentTaxableValue = amountPaid / (1 + gstPercent / 100);
  const currentTotalTax = amountPaid - currentTaxableValue;
  const currentSplitGst = currentTotalTax / 2;

  // 2. Academic Fee Totals
  const totalFeeWithGst = paymentRecords[0]?.totalAmount || 0;
  const totalPaidSoFar = paymentRecords.reduce((sum, record) => sum + (record.amountPaid || 0), 0);
  const remainingFee = totalFeeWithGst - totalPaidSoFar;

  // 3. Vanfare calculations
  const totalVanfare = vanfareRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const vanfarePaidSoFar = vanfareRecords.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const remainingVanfare = totalVanfare - vanfarePaidSoFar;

  const totalAmountInWords = numberToWords(amountPaid).toUpperCase() + " RUPEES ONLY";
  const formattedDate = new Date(date).toLocaleDateString("en-IN");

  const installmentsHtml = paymentRecords
    .map((record, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><div style="font-weight:600;">${record.name}</div></td>
        <td>${new Date(record.dueDate).toLocaleDateString("en-IN")}</td>
        <td style="text-align: right;">
          <div style="font-weight: 600;">${formatCurrency(record.amountPaid)}</div>
          ${record.description ? `<div style="font-size:10px; color:#666; margin-top:2px;">${record.description}</div>` : ""}
        </td>
      </tr>
    `).join("");

  const renderReceiptCard = (copyTitle: string) => `
  <div class="receipt-card">
    <div class="receipt-copy-title">${copyTitle}</div>

    <div class="header">
      <div class="brand">
        ${instituteLogo ? `<img src="${instituteLogo}" crossorigin="anonymous" class="logo" />` : ''}
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
      <div class="grid-item">
        <span class="label">Student Name</span>
        <span class="value">${studentName}</span>
      </div>
      <div class="grid-item">
        <span class="label">Course/Batch</span>
        <span class="value">${batchName}</span>
      </div>
      <div class="grid-item">
        <span class="label">Parent Name</span>
        <span class="value">${parentName}</span>
      </div>
      <div class="grid-item">
        <span class="label">Payment Status</span>
        <span class="value">
          ${(remainingFee + remainingVanfare) <= 0 ? 'FULLY PAID' : 'PARTIALLY PAID'}
        </span>
      </div>
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
          <b>In Words (Current Paid):</b><br/>
          ${totalAmountInWords}
        </div>
        
        <div class="vanfare-left-box">
          <div class="vanfare-title">Vanfare (Transport Dues)</div>
          <div class="vanfare-row"><span>Total Assigned:</span> <b>${formatCurrency(totalVanfare)}</b></div>
          <div class="vanfare-row" style="color: #27ae60;"><span>Total Paid:</span> <b>${formatCurrency(vanfarePaidSoFar)}</b></div>
          <div class="vanfare-row" style="color: #c0392b; border-top: 0.5px dashed #ccc; padding-top: 2px;"><span>Remaining:</span> <b>${formatCurrency(remainingVanfare)}</b></div>
        </div>

        <p style="font-size: 7.5px; color: #777; margin-top: 5px;">
          * Registration, Material Fees, and Vanfare installments are non-refundable.
        </p>
      </div>

      <div class="calculation-table">
        <div class="calc-row current-payment">
          <span>Current Amount Received</span>
          <span>${formatCurrency(amountPaid)}</span>
        </div>
        <div class="calc-row gst-detail">
          <span>Taxable Value</span>
          <span>₹${currentTaxableValue.toFixed(2)}</span>
        </div>
        <div class="calc-row gst-detail">
          <span>CGST (${gstPercent / 2}%)</span>
          <span>₹${currentSplitGst.toFixed(2)}</span>
        </div>
        <div class="calc-row gst-detail">
          <span>SGST (${gstPercent / 2}%)</span>
          <span>₹${currentSplitGst.toFixed(2)}</span>
        </div>
        <div class="calc-row" style="color: #e74c3c; font-weight:bold; border-top: 1px solid #000;">
          <span>Pending Course Fee</span>
          <span>${formatCurrency(remainingFee)}</span>
        </div>
        <div class="calc-row" style="color: #e74c3c; font-weight:bold;">
          <span>Pending Vanfare</span>
          <span>${formatCurrency(remainingVanfare)}</span>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: auto;">
      <div class="signature-area">
        ${signature ? `<img src="${signature}" crossorigin="anonymous" class="sig-img" />` : '<div style="height:35px"></div>'}
        <div class="sig-line">Authorized Signatory</div>
      </div>
    </div>
  </div>
  `;

  return `
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      @page { size: A4 portrait; margin: 6mm; }
      body { font-family: 'Inter', sans-serif; margin: 0; padding: 3mm; background: #fff; color: #333; font-size: 10px; }
      .receipt-card { border: 1px solid #000; display: flex; flex-direction: column; padding: 3mm; box-sizing: border-box; min-height: 47%; margin-bottom: 8px; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
      .brand { display: flex; align-items: center; gap: 12px; }
      .logo { height: 50px; width: 50px; object-fit: contain; }
      .inst-name { font-size: 16px; font-weight: 700; margin: 0; color: #000; }
      .inst-info { font-size: 8.5px; color: #444; margin: 0; }
      .doc-info { text-align: right; }
      .doc-info h1 { margin: 0; font-size: 16px; font-weight: 700; text-decoration: underline; }
      .grid-container { display: grid; grid-template-columns: 1.5fr 1fr; border: 1px solid #ccc; margin-bottom: 10px; }
      .grid-item { border: 0.5px solid #eee; padding: 5px 8px; }
      .label { font-size: 8px; color: #666; text-transform: uppercase; font-weight: bold; display: block; }
      .value { font-size: 10px; font-weight: 600; color: #000; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      th { background: #f2f2f2; border: 1px solid #000; padding: 5px; font-size: 9px; text-transform: uppercase; }
      td { border: 1px solid #ccc; padding: 5px; }
      .footer-layout { display: flex; justify-content: space-between; align-items: flex-start; }
      .footer-left { width: 50%; }
      .calculation-table { width: 240px; border: 1px solid #000; }
      .calc-row { display: flex; justify-content: space-between; padding: 3px 8px; border-bottom: 1px solid #eee; }
      .calc-row.current-payment { background: #f0fdf4; border-top: 1px solid #000; font-weight: 600; }
      .calc-row.gst-detail { font-size: 9px; color: #555; padding-left: 15px; }
      .amount-words-box { background: #f4f4f4; padding: 6px; border-left: 4px solid #000; font-style: italic; margin-bottom: 6px; }
      
      /* New layout box for Vanfare to use the vacant space */
      .vanfare-left-box { border: 1px solid #ccc; padding: 5px 8px; border-radius: 4px; background: #fafafa; margin-bottom: 4px; width: 90%; }
      .vanfare-title { font-weight: 700; font-size: 9px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 2px; margin-bottom: 4px; color: #333; }
      .vanfare-row { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 2px; }

      .receipt-copy-title{ text-align:center; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; background:#f4f4f4; border:1px solid #000; padding:4px 10px; width:fit-content; margin:0 auto 10px auto; border-radius:4px; }
      .receipt-divider{ border-top:1px dashed #000; margin:6px 0; }
      .signature-area { text-align: center; width: 130px; margin-top: 10px; }
      .sig-img { height: 35px; mix-blend-mode: multiply; }
      .sig-line { border-top: 1px solid #000; font-weight: 700; font-size: 9px; padding-top: 2px; }
    </style>
  </head>
  <body>
    ${renderReceiptCard('Accountant Copy')}
    <div class="receipt-divider"></div>
    ${renderReceiptCard('Parent Copy')}
  </body>
  </html>
  `;
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
  signature: string,
  vanfareRecords: {
    amountPaid: number;
    totalAmount: number;
    name: string;
  }[] = []
) {
  const totalFeeWithGst = paymentRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalPaid = paymentRecords.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const remaining = totalFeeWithGst - totalPaid;

  const totalGstPercent = gst.cgst + gst.sgst;

  // Course Fee Calculations
  const baseTotalFee = totalFeeWithGst / (1 + totalGstPercent / 100);
  const totalTaxAmount = totalFeeWithGst - baseTotalFee;

  const paidBaseAmount = totalPaid / (1 + totalGstPercent / 100);
  const paidTaxAmount = totalPaid - paidBaseAmount;
  const paidCgst = paidTaxAmount / 2;
  const paidSgst = paidTaxAmount / 2;

  // Vanfare Calculations
  const totalVanfare = vanfareRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const vanfarePaid = vanfareRecords.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
  const vanfareRemaining = totalVanfare - vanfarePaid;

  const renderOverviewCard = (copyTitle: string) => `
  <div class="receipt-card">
    <div class="receipt-copy-title">${copyTitle}</div>

    <table class="header-table">
      <tr>
        <td style="width: 80px;">
          ${instituteLogo ? `<img src="${instituteLogo}" crossorigin="anonymous" class="logo" />` : ''}
        </td>
        <td class="inst-info">
          <h1>${name}</h1>
          <div>${address}</div>
          <div>Contact: ${phoneNumber}</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <h2 style="margin:0; color:#444;">FEE STATEMENT</h2>
          <div style="font-size: 10px; color: #777;">
            Date: ${new Date().toLocaleDateString("en-IN")}
          </div>
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
        <td><b>Overall Status:</b> ${(remaining + vanfareRemaining) <= 0 ? 'PAID' : 'PARTIAL'}</td>
      </tr>
    </table>

    <table class="fee-table">
      <thead>
        <tr>
          <th>Sr.</th>
          <th>Particulars</th>
          <th>Base Amount</th>
          <th>Tax Rate</th>
          <th>Tax Component</th>
          <th>Total Payable</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Course Academic Fees</td>
          <td>₹${baseTotalFee.toFixed(2)}</td>
          <td>${totalGstPercent}%</td>
          <td>₹${totalTaxAmount.toFixed(2)}</td>
          <td>₹${totalFeeWithGst.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="calculation-area">
      <div style="width: 55%; text-align: left; padding-right: 15px; box-sizing: border-box;">
        <div style="border: 1px solid #ccc; padding: 6px 10px; background: #fafafa; border-radius: 4px; margin-top: 5px;">
          <div style="font-weight: 700; text-transform: uppercase; font-size: 9px; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 5px;">Vanfare Transport Log</div>
          <table style="width:100%; border:none; margin:0;">
            <tr style="font-size:9px;"><td style="border:none; padding:2px 0;">Total Transportation Fee:</td><td style="border:none; padding:2px 0; text-align:right;"><b>₹${totalVanfare.toFixed(2)}</b></td></tr>
            <tr style="font-size:9px; color:#27ae60;"><td style="border:none; padding:2px 0;">Total Transport Paid:</td><td style="border:none; padding:2px 0; text-align:right;"><b>₹${vanfarePaid.toFixed(2)}</b></td></tr>
            <tr style="font-size:9px; color:#b91c1c; font-weight:600;"><td style="border:none; padding:2px 0; border-top:0.5px dashed #ccc;">Remaining Transport Due:</td><td style="border:none; padding:2px 0; text-align:right; border-top:0.5px dashed #ccc;"><b>₹${vanfareRemaining.toFixed(2)}</b></td></tr>
          </table>
        </div>
      </div>

      <div class="calc-box">
        <div class="calc-row final">
          <span>Gross Course Fee</span>
          <span>₹${totalFeeWithGst.toFixed(2)}</span>
        </div>
        <div class="calc-row highlight">
          <span>Course Fee Received</span>
          <span>₹${totalPaid.toFixed(2)}</span>
        </div>
        <div class="calc-row gst-breakdown">
          <span> - Taxable Val (Received)</span>
          <span>₹${paidBaseAmount.toFixed(2)}</span>
        </div>
        <div class="calc-row gst-breakdown">
          <span> - CGST on Course (${gst.cgst}%)</span>
          <span>₹${paidCgst.toFixed(2)}</span>
        </div>
        <div class="calc-row gst-breakdown">
          <span> - SGST on Course (${gst.sgst}%)</span>
          <span>₹${paidSgst.toFixed(2)}</span>
        </div>
        <div class="calc-row" style="color: #e74c3c; font-weight: 700; border-top: 1px solid #ccc;">
          <span>Outstanding Course Balance</span>
          <span>₹${remaining.toFixed(2)}</span>
        </div>
        <div class="calc-row" style="color: #e74c3c; font-weight: 700;">
          <span>Outstanding Vanfare Balance</span>
          <span>₹${vanfareRemaining.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div class="footer-section">
      <div class="terms">
        <b>Terms & Conditions:</b><br/>
        1. This is an integrated automated computer-generated Fee Statement summary.<br/>
        2. Academic Fees and transport Vanfare schedules are non-refundable.<br/>
        3. GST calculations shown are reflective of course elements only.
      </div>
      <div class="sig-area">
        ${signature ? `<img src="${signature}" crossorigin="anonymous" class="sig-img" />` : '<div style="height:40px"></div>'}
        <div style="border-top: 1px solid #000; padding-top: 5px; font-weight: 600;">
          Authorized Signatory
        </div>
      </div>
    </div>
  </div>
  `;

  return `
  <html>
  <head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @page { size: A4 portrait; margin: 6mm; }
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 3mm; color: #333; line-height: 1.3; font-size: 10px; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .logo { height: 60px; width: auto; }
    .inst-info { text-align: left; padding-left: 15px; }
    .inst-info h1 { margin: 0; font-size: 18px; color: #000; }
    .student-box { width: 100%; border: 1px solid #ccc; margin-bottom: 8px; }
    .student-box td { border: 0.5px solid #eee; padding: 6px 10px; width: 50%; }
    .fee-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    .fee-table th { background: #f4f4f4; border: 1px solid #ccc; padding: 8px; text-align: center; font-weight: 600; }
    .fee-table td { border: 1px solid #ccc; padding: 8px; text-align: center; }
    .calculation-area { display: flex; justify-content: space-between; align-items: flex-start; margin-top: -1px; }
    .calc-box { width: 45%; border: 1px solid #ccc; border-top: none; }
    .calc-row { display: flex; justify-content: space-between; padding: 5px 10px; border-bottom: 0.5px solid #eee; }
    .calc-row.highlight { background: #f0fdf4; font-weight: 700; color: #166534; }
    .calc-row.final { background: #f9f9f9; font-weight: 700; }
    .gst-breakdown { font-size: 9px; color: #666; padding-left: 15px; font-style: italic; }
    .footer-section { margin-top: 10px; display: flex; justify-content: space-between; }
    .terms { font-size: 9px; color: #666; width: 60%; }
    .sig-area { text-align: center; width: 150px; }
    .sig-img { height: 40px; margin-bottom: 5px; }
    .receipt-card{ border:1px solid #000; padding:6px; margin-bottom:5px; }
    .receipt-copy-title{ text-align:center; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; background:#f4f4f4; border:1px solid #000; padding:4px 10px; width:fit-content; margin:0 auto 10px auto; border-radius:4px; }
    .receipt-divider{ border-top:1px dashed #000; margin:3px 0; }
  </style>
  </head>
  <body>
    ${renderOverviewCard('Accountant Copy')}
    <div class="receipt-divider"></div>
    ${renderOverviewCard('Parent Copy')}
  </body>
  </html>
  `;
}

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