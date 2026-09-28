import * as XLSX from "xlsx";

// Moved out of helperFunctions.ts: that file is imported by several
// components (dashboard cards, marksheet, fee modal, etc.) that never
// touch Excel parsing, and a module-level `import * as XLSX from "xlsx"`
// there meant all of them dragged in the ~230 KB xlsx library regardless.
// This is only used by UploadExcelAdmission, so it now lives next to it.
export const parseExcelDate = (value: any) => {
  try {
    if (!value) return undefined;

    // DD/MM/YYYY
    if (typeof value === "string") {
      const parts = value.trim().split("/");

      if (parts.length !== 3) return undefined;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      if (isNaN(date.getTime())) {
        return undefined;
      }

      return date;
    }

    // Excel serial date
    if (typeof value === "number") {
      const parsed = XLSX.SSF.parse_date_code(value);

      if (!parsed) return undefined;

      return new Date(parsed.y, parsed.m - 1, parsed.d);
    }

    return undefined;
  } catch {
    return undefined;
  }
};
