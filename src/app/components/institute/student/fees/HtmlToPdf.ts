export function createReceiptPdf(
  studentName: string,
  date: Date,
  parentName: string,
  totalPrice: number,
  paymentRecords: {
    amountPaid: number;
    updatedAt: Date;
    name: string;
  }[],
  name: string,
  address: string,
  phoneNumber: string,
  receiptNo: string
) {
  const totalAmountInWords =
    numberToWords(totalPrice).toUpperCase() + " RUPEES ONLY";
  const month = date.toLocaleString("default", { month: "long" });

  const installmentsHtml = paymentRecords
    .map(
      (record) =>
        `<div class="row">
            <span>Tution Fee - ${record.name}, paid on: ${new Date(record.updatedAt)
              .toISOString()
              .slice(0, 10)}</span>
            <span>${record.amountPaid}</span>
          </div>`
    )
    .join("");

  return `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
            body { font-family: 'Nunito', sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; }
            .receipt { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header p { margin: 0; }
            .header .title { font-size: 24px; font-weight: 700; }
            .header .contact { font-size: 16px; font-weight: 600; }
            .line { height: 1px; background-color: #ddd; margin: 20px 0; }
            .details { font-size: 16px; margin-bottom: 10px; }
            .details .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .installments { margin-top: 20px; }
            .installments .header { font-size: 16px; font-weight: 600; margin-bottom: 10px; }
            .installments .row { display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding: 10px 0; font-size: 14px; }
            .total { font-size: 18px; font-weight: 700; text-align: right; margin-top: 20px; }
            .signature { text-align: right; margin-top: 40px; font-size: 16px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <p class="title">${name}</p>
              <p class="contact">${address}</p>
              <p class="contact">Phone No. - ${phoneNumber}</p>
            </div>
            <div class="line"></div>
            <p style="text-align: center; font-size: 20px; font-weight: 700;">FEE RECEIPT</p>
            <div class="details">
              <div class="row">
                <span>Receipt No:</span>
                <span>${receiptNo}</span>
              </div>
              <div class="row">
                <span>Month:</span>
                <span>${month}</span>
              </div>
              <div class="row">
                <span>Student Name:</span>
                <span>${studentName}</span>
              </div>
              <div class="row">
                <span>Parent Name:</span>
                <span>${parentName}</span>
              </div>
              <div class="row">
                <span>Batch:</span>
                <span>Class 12</span>
              </div>
              <div class="row">
                <span>Total Amount Paid (in words):</span>
                <span>${totalAmountInWords}</span>
              </div>
            </div>
            <div class="installments">
              <div class="header">INSTALLMENTS: RUPEES</div>
              ${installmentsHtml}
            </div>
            <p class="total">Total Amount Paid: ${totalPrice}</p>
            <div class="signature">Authorized Signature</div>
          </div>
        </body>
      </html>
    `;
}

function getMonthName(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[date.getMonth()];
}

function numberToWords(number: number) {
  const words = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function convertTwoDigitNumber(num: number) {
    if (num < 10) {
      return words[num];
    } else if (num >= 11 && num <= 19) {
      return teens[num - 10];
    } else {
      const digitOne = Math.floor(num / 10);
      const digitTwo = num % 10;
      return tens[digitOne] + (digitTwo !== 0 ? " " + words[digitTwo] : "");
    }
  }

  function convertThreeDigitNumber(num: number) {
    const digitHundred = Math.floor(num / 100);
    const remainingTwoDigits = num % 100;

    if (digitHundred !== 0) {
      return (
        words[digitHundred] +
        " hundred" +
        (remainingTwoDigits !== 0
          ? " and " + convertTwoDigitNumber(remainingTwoDigits)
          : "")
      );
    } else {
      return convertTwoDigitNumber(remainingTwoDigits);
    }
  }

  function convertNumberWithThousands(num: number) {
    const digitThousand = Math.floor(num / 1000);
    const remainingThreeDigits = num % 1000;

    if (digitThousand !== 0) {
      return (
        convertThreeDigitNumber(digitThousand) +
        " thousand" +
        (remainingThreeDigits !== 0
          ? " " + convertThreeDigitNumber(remainingThreeDigits)
          : "")
      );
    } else {
      return convertThreeDigitNumber(remainingThreeDigits);
    }
  }

  if (number < 0) {
    return "Please enter a non-negative number";
  } else if (number >= 100000) {
    return "Please enter a number less than 100000";
  } else {
    return convertNumberWithThousands(number);
  }
}
