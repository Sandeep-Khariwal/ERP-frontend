export function createReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  amountPaid: number,
  paymentRecords: {
    amountPaid: number;
    updatedAt: Date;
    name: string;
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
        ${
          instituteLogo
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
        Total: ₹${amountPaid}
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
  const words = ["","one","two","three","four","five","six","seven","eight","nine"];
  const teens = ["","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

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