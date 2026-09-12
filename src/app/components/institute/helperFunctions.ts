export const months = [
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

export function getThisAndNextYearMonths(): { value: string; label: string }[] {
  const today = new Date();
  let currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const yearMonths = [];

  for (let year = currentYear; year <= currentYear + 1; year++) {
    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(year, month, 1);

      yearMonths.push({
        value: firstDayOfMonth.toISOString().split("T")[0],
        label: `${months[month]} ${year}`,
      });
    }
  }

  return yearMonths;
}

export function getNextYearMonths() {
  const today = new Date();
  let currentMonth = today.getMonth();
  currentMonth = currentMonth >= 0 && currentMonth <= 11 ? currentMonth : 0;
  const currentYear = today.getFullYear();

  const nextYearMonths = [];

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    const firstDayOfMonth = new Date(year, monthIndex, 2);

    nextYearMonths.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });
  }

  return nextYearMonths;
}
export function getMonthsFromDate(startDate: Date) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

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

  const monthsArray = [];

  let currentDate = startDate;

  while (currentDate <= today) {
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 2);

    monthsArray.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });

    // Move to the next month
    currentDate.setMonth(monthIndex + 1);
  }

  // Add another 12 months
  for (let i = 1; i < 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    const firstDayOfMonth = new Date(year, monthIndex, 2);

    monthsArray.push({
      value: firstDayOfMonth.toUTCString(),
      label: `${months[monthIndex]} ${year}`,
    });
  }

  return monthsArray;
}

export function getPreviousMonths(startDate: Date) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthsArray = [];

  let currentDate = startDate;

  while (currentDate <= today) {
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 2);

    monthsArray.push({
      value: firstDayOfMonth,
      label: `${months[monthIndex]} ${year}`,
    });

    currentDate.setMonth(monthIndex + 1);
  }
  return monthsArray;
}

export enum FeeOptions {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  QUARTERLY = "quarterly",
}

interface FeeOption {
  label: string;
  value: FeeOptions;
}

export const feeOptions: FeeOption[] = [
  { label: "Monthly", value: FeeOptions.MONTHLY },
  { label: "Yearly", value: FeeOptions.YEARLY },
  { label: "Quarterly", value: FeeOptions.QUARTERLY },
];

export function formatNumberInK(value: number): number | string {
  if (value < 1000) {
    return value;
  } else {
    return `${value / 1000}k`;
  }
}

 export const GetGrade = (marks: number) => {
  if (marks > 90) return "A1";
  if (marks > 80) return "A2";
  if (marks > 70) return "B1";
  if (marks > 60) return "B2";
  if (marks > 50) return "C1";
  if (marks > 40) return "C2";
  if (marks >= 33) return "D";
  return "E";
};

export const parseExcelDate = async (value: any) => {
  try {
    if (!value) return undefined;

    // Handle string dates (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, YYYY/MM/DD)
    if (typeof value === "string") {
      const trimmed = value.trim();

      // Try "/" separator first (DD/MM/YYYY or YYYY/MM/DD)
      if (trimmed.includes("/")) {
        const parts = trimmed.split("/");

        if (parts.length !== 3) return undefined;

        // Check if it's DD/MM/YYYY or YYYY/MM/DD
        if (parts[0].length === 4) {
          // YYYY/MM/DD format
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);

          const date = new Date(year, month, day);
          if (isNaN(date.getTime())) return undefined;
          return date;
        } else {
          // DD/MM/YYYY format
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);

          const date = new Date(year, month, day);
          if (isNaN(date.getTime())) return undefined;
          return date;
        }
      }

      // Try "-" separator (DD-MM-YYYY or YYYY-MM-DD)
      if (trimmed.includes("-")) {
        const parts = trimmed.split("-");

        if (parts.length !== 3) return undefined;

        // Check if it's DD-MM-YYYY or YYYY-MM-DD
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);

          const date = new Date(year, month, day);
          if (isNaN(date.getTime())) return undefined;
          return date;
        } else {
          // DD-MM-YYYY format
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);

          const date = new Date(year, month, day);
          if (isNaN(date.getTime())) return undefined;
          return date;
        }
      }

      return undefined;
    }

    // Excel serial date - dynamically load XLSX only when needed
    if (typeof value === "number") {
      const XLSX = await import("xlsx");
      const parsed = XLSX.SSF.parse_date_code(value);

      if (!parsed) return undefined;

      return new Date(parsed.y, parsed.m - 1, parsed.d);
    }

    return undefined;
  } catch {
    return undefined;
  }
};