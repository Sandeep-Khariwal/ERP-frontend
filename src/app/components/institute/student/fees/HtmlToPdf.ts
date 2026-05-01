export function createReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  amountPaid: number,
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
) {
  const totalAmountInWords =
    numberToWords(amountPaid).toUpperCase() + " RUPEES ONLY";

  const totalFee = paymentRecords[0]?.totalAmount || 0;

  const totalPaid = paymentRecords.reduce(
    (sum, record) => sum + record.amountPaid,
    0
  );

  const remainingFee = totalFee - totalPaid;

  const formattedDate = new Date(date).toLocaleDateString("en-IN");

  const installmentsHtml = paymentRecords
    .map(
      (record) => `
      <div class="table-row">
        <span>${record.name} (Paid on ${new Date(record.updatedAt).toLocaleDateString("en-IN")})</span>
        <span>₹${record.amountPaid}</span>
      </div>
    `
    )
    .join("");

  return `
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
      body {
        font-family: 'Poppins', sans-serif;
        background: #f4f6f8;
        padding: 20px;
      }

      .receipt {
        max-width: 750px;
        margin: auto;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e0e0e0;
      }

      /* HEADER */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #6c63ff, #8f94fb);
        padding: 20px;
        color: white;
      }

      .logo {
        height: 60px;
        width: 60px;
        object-fit: contain;
        background: white;
        padding: 5px;
        border-radius: 8px;
      }

      .institute-details {
        text-align: right;
      }

      .institute-name {
        font-size: 22px;
        font-weight: 700;
      }

      .contact {
        font-size: 13px;
      }

      /* TITLE */
      .title {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        margin: 20px 0;
      }

      .badge {
        background: #6c63ff;
        color: white;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        margin-left: 10px;
      }

      /* DETAILS */
      .section {
        padding: 0 25px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
      }

      .label {
        color: #666;
      }

      .value {
        font-weight: 500;
      }

      /* TABLE */
      .table {
        margin: 20px 25px;
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        background: #f1f3ff;
        padding: 10px;
        font-weight: 600;
      }

      .table-row {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-top: 1px solid #eee;
        font-size: 13px;
      }

      /* TOTAL */
      .total {
        text-align: right;
        padding: 0 25px;
        font-size: 18px;
        font-weight: 700;
        margin-top: 10px;
      }

      /* FOOTER */
      .footer {
        display: flex;
        justify-content: space-between;
        padding: 30px 25px;
      }

      .amount-words {
        font-size: 13px;
        max-width: 60%;
      }

      .signature {
        text-align: right;
      }

      .signature-line {
        margin-top: 40px;
        border-top: 1px solid #000;
        width: 150px;
        margin-left: auto;
      }

    </style>
  </head>

  <body>
    <div class="receipt">

      <!-- HEADER -->
      <div class="header">
        ${instituteLogo
      ? `<img src="${instituteLogo}" class="logo" />`
      : ""
    }

        <div class="institute-details">
          <div class="institute-name">${name}</div>
          <div class="contact">${address}</div>
          <div class="contact">${phoneNumber}</div>
        </div>
      </div>

      <!-- TITLE -->
      <div class="title">
        FEE RECEIPT <span class="badge">PAID</span>
      </div>

      <!-- DETAILS -->
      <div class="section">
        <div class="row">
          <span class="label">Receipt No:</span>
          <span class="value">${receiptNo}</span>
        </div>
        <div class="row">
          <span class="label">Date:</span>
          <span class="value">${formattedDate}</span>
        </div>
        <div class="row">
          <span class="label">Student Name:</span>
          <span class="value">${studentName}</span>
        </div>
        <div class="row">
          <span class="label">Parent Name:</span>
          <span class="value">${parentName}</span>
        </div>
        <div class="row">
          <span class="label">Batch:</span>
          <span class="value">${batchName}</span>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table">
        <div class="table-header">
          <span>Description</span>
          <span>Amount</span>
        </div>
        ${installmentsHtml}
      </div>

      <!-- TOTAL -->
<div class="total">
  Total Fee: ₹${totalFee} <br/>
  Paid: ₹${totalPaid} <br/>
  <span style="color:red;">Remaining: ₹${remainingFee}</span>
</div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="amount-words">
          <strong>In Words:</strong><br/>
          ${totalAmountInWords}
        </div>

        <div class="signature">
          Authorized Signature
          <div class="signature-line"></div>
        </div>
      </div>

    </div>
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
  }
) {
  // Calculate Base Total
  const baseTotalFee = paymentRecords.reduce(
    (sum, r) => sum + (r.totalAmount || 0),
    0
  );

  // Calculate GST amounts based on percentage
  const cgstAmount = gst.cgst > 0 ? (baseTotalFee * gst.cgst) / 100 : 0;
  const sgstAmount = gst.sgst > 0 ? (baseTotalFee * gst.sgst) / 100 : 0;
  
  // Final Total including GST
  const totalFeeWithGst = baseTotalFee + cgstAmount + sgstAmount;

  const totalPaid = paymentRecords.reduce(
    (sum, r) => sum + (r.amountPaid || 0),
    0
  );

  const remaining = totalFeeWithGst - totalPaid;

  return `
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background: #f4f6f8;
    padding: 20px;
  }

  @media print {
    body { background: white !important; padding: 0 !important; }
    .container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
    table { page-break-inside: avoid; }
    tr { page-break-inside: avoid; }
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .container {
    max-width: 800px;
    margin: auto;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0fb9b1;
    padding: 20px;
    color: white;
  }

  .header h2 { margin: 0; font-size: 20px; }
  .header p { margin: 0; font-size: 12px; }

  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0;
    color: #333;
  }

  .details {
    background: #f8f9fa;
    margin: 0 20px;
    padding: 15px;
    border-radius: 10px;
    font-size: 14px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  table {
    width: 90%;
    margin: 20px auto;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: 10px;
  }

  th {
    background: #0fb9b1;
    color: white;
    padding: 10px;
    font-size: 13px;
  }

  td {
    padding: 10px;
    text-align: center;
    font-size: 13px;
    border-bottom: 1px solid #eee;
  }

  tr:nth-child(even) { background: #f9f9f9; }

  .paid { color: #0fb9b1; font-weight: 600; }
  .partial { color: orange; font-weight: 600; }
  .due { color: red; font-weight: 600; }

  .summary-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 20px;
  }

  .card {
    flex: 1;
    min-width: 120px;
    margin: 5px;
    padding: 15px;
    border-radius: 10px;
    background: #f1f3ff;
    text-align: center;
  }

  .card h4 { margin: 0; font-size: 12px; color: #666; }
  .card p { margin: 5px 0 0; font-size: 16px; font-weight: 600; }
  .remaining { color: red; }

</style>
</head>

<body>

<div class="container">

  <div class="header">
    <div>
      <h2>${name}</h2>
      <p>${address}</p>
    </div>
  </div>

  <div class="title">FEE OVERVIEW</div>

  <div class="details">
    <div class="row"><span>Student:</span><span>${studentName}</span></div>
    <div class="row"><span>Parent:</span><span>${parentName}</span></div>
    <div class="row"><span>Batch:</span><span>${batchName}</span></div>
  </div>

  <table>
    <tr>
      <th>#</th>
      <th>Installment</th>
      <th>Status</th>
      <th>Total</th>
      <th>Paid</th>
      <th>Due</th>
    </tr>

    ${paymentRecords.map((r, i) => {
      let status = "Not Paid";
      let cls = "due";

      if (r.amountPaid === r.totalAmount) {
        status = "Paid";
        cls = "paid";
      } else if (r.amountPaid > 0) {
        status = "Partial";
        cls = "partial";
      }

      return `
        <tr>
          <td>${i + 1}</td>
          <td>${r.name}</td>
          <td class="${cls}">${status}</td>
          <td>₹${r.totalAmount}</td>
          <td>₹${r.amountPaid}</td>
          <td>₹${r.totalAmount - r.amountPaid}</td>
        </tr>
      `;
    }).join("")}

  </table>

  <div class="summary-container">
    <div class="card">
      <h4>Base Fee</h4>
      <p>₹${baseTotalFee}</p>
    </div>

    ${gst.cgst > 0 ? `
    <div class="card">
      <h4>CGST (${gst.cgst}%)</h4>
      <p>₹${cgstAmount.toFixed(2)}</p>
    </div>` : ''}

    ${gst.sgst > 0 ? `
    <div class="card">
      <h4>SGST (${gst.sgst}%)</h4>
      <p>₹${sgstAmount.toFixed(2)}</p>
    </div>` : ''}

    <div class="card">
      <h4>Total Fee</h4>
      <p>₹${totalFeeWithGst.toFixed(2)}</p>
    </div>

    <div class="card">
      <h4>Total Paid</h4>
      <p>₹${totalPaid}</p>
    </div>

    <div class="card">
      <h4>Remaining</h4>
      <p class="remaining">₹${remaining.toFixed(2)}</p>
    </div>
  </div>

</div>

</body>
</html>
`;
}