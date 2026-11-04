// receiptSingle.pdf.ts
// Sirf 1 copy wali fee receipt (Accountant/Parent label nahi, divider nahi).
// Purani createReceiptPdf ko touch nahi karta. numberToWords isi file mein hai,
// isliye purani file mein koi change ya import nahi chahiye.
// Ye pure function hai (sirf HTML string return karti hai), isliye same file
// frontend aur backend dono mein copy karke chala sakte ho.

export function createSingleReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  amountPaid: number, // is baar ki payment
  totalPaidSoFar: number,
  paymentRecords: {
    amountPaid: number;
    updatedAt: Date;
    name: string;
    totalAmount: number;
    remainingAmount?: number;
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
  totalRemaining: number,
  gst: { sgst: number; cgst: number },
  vanfareRecords: { amountPaid: number; totalAmount: number; name: string }[] = []
) {
  const formatCurrency = (num: number) =>
    "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const gstPercent = (gst?.cgst || 0) + (gst?.sgst || 0);

  // GST breakdown (current payment)
  const currentTaxableValue = amountPaid / (1 + gstPercent / 100);
  const currentTotalTax = amountPaid - currentTaxableValue;
  const currentSplitGst = currentTotalTax / 2;

  // Academic fee totals
  const totalFeeWithGst = paymentRecords[0]?.totalAmount || 0;
  const remainingFee =
    paymentRecords[0]?.remainingAmount ??
    Math.max(totalFeeWithGst - (paymentRecords[0]?.amountPaid ?? 0), 0);

  // Vanfare
  const totalVanfare = vanfareRecords.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const vanfarePaidSoFar = vanfareRecords.reduce((s, r) => s + (r.amountPaid || 0), 0);
  const remainingVanfare = totalVanfare - vanfarePaidSoFar;

  const totalAmountInWords = numberToWords(amountPaid).toUpperCase() + " RUPEES ONLY";
  const formattedDate = new Date(date).toLocaleDateString("en-IN");

  const installmentsHtml = paymentRecords
    .map(
      (record, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><div style="font-weight:600;">${record.name}</div></td>
        <td>${new Date(record.dueDate).toLocaleDateString("en-IN")}</td>
        <td style="text-align: right;">
          <div style="font-weight: 600;">${formatCurrency(record.amountPaid)}</div>
          ${record.description ? `<div style="font-size:10px; color:#666; margin-top:2px;">${record.description}</div>` : ""}
        </td>
      </tr>`
    )
    .join("");

  return `
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      @page { size: A4 portrait; margin: 6mm; }
      body { font-family: 'Inter', sans-serif; margin: 0; padding: 3mm; background: #fff; color: #333; font-size: 10px; }
      .receipt-card { border: 1px solid #000; display: flex; flex-direction: column; padding: 3mm; box-sizing: border-box; }
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
      .vanfare-left-box { border: 1px solid #ccc; padding: 5px 8px; border-radius: 4px; background: #fafafa; margin-bottom: 4px; width: 90%; }
      .vanfare-title { font-weight: 700; font-size: 9px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 2px; margin-bottom: 4px; color: #333; }
      .vanfare-row { display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 2px; }
      .signature-area { text-align: center; width: 130px; margin-top: 10px; }
      .sig-img { height: 35px; mix-blend-mode: multiply; }
      .sig-line { border-top: 1px solid #000; font-weight: 700; font-size: 9px; padding-top: 2px; }
    </style>
  </head>

  <body>
    <div class="receipt-card">
      <div class="header">
        <div class="brand">
          ${instituteLogo ? `<img src="${instituteLogo}" crossorigin="anonymous" class="logo" />` : ""}
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
        <div class="grid-item">
          <span class="label">Payment Status</span>
          <span class="value">${remainingFee + remainingVanfare <= 0 ? "FULLY PAID" : "PARTIALLY PAID"}</span>
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
        <tbody>${installmentsHtml}</tbody>
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
          <div class="calc-row current-payment"><span>Current Amount Received</span><span>${formatCurrency(amountPaid)}</span></div>
          <div class="calc-row gst-detail"><span>Taxable Value</span><span>₹${currentTaxableValue.toFixed(2)}</span></div>
          <div class="calc-row gst-detail"><span>CGST (${gst.cgst}%)</span><span>₹${currentSplitGst.toFixed(2)}</span></div>
          <div class="calc-row gst-detail"><span>SGST (${gst.sgst}%)</span><span>₹${currentSplitGst.toFixed(2)}</span></div>
          <div class="calc-row" style="color: #e74c3c; font-weight:bold; border-top: 1px solid #000;"><span>Pending Installment Fee</span><span>${formatCurrency(remainingFee)}</span></div>
          <div class="calc-row" style="color: #e74c3c; font-weight:bold;"><span>Total Pending Fee</span><span>${formatCurrency(totalRemaining)}</span></div>
          <div class="calc-row" style="color: #e74c3c; font-weight:bold;"><span>Pending Vanfare</span><span>${formatCurrency(remainingVanfare)}</span></div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <div class="signature-area">
          ${signature ? `<img src="${signature}" crossorigin="anonymous" class="sig-img" />` : '<div style="height:35px"></div>'}
          <div class="sig-line">Authorized Signatory</div>
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

  return convertNumberWithThousands(Math.floor(number));
}