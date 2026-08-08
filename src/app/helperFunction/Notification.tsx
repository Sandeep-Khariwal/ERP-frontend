import { notifications } from "@mantine/notifications";

export function SuccessNotification(message: string) {
  notifications.show({
    color: "green",
    position: "top-center",
    title: "Success",
    message: message,
  });
}

export function ErrorNotification(message: string) {
  notifications.show({
    color: "red",
    position: "top-center",
    title: "Error",
    message: message,
  });
}

export function hasCommonUniqueElement(arr1: string[], arr2: string[]) {
  const set1 = [...new Set(arr1)];
  const set2 = [...new Set(arr2)];

  return set1.some((element) => set2.includes(element));
}

export function getOneYearPast(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  date.setFullYear(date.getFullYear() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function containsOnlyDigits(inputString: string) {
  return /^\d+$/.test(inputString) || inputString === "";
}

export const GetMonthYear = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${year}`;
};

export const getBase64Image = async (url: string) => {
  const response = await fetch(url);

  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
};

export function getExamStartDate(date: any) {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export function getExamStartTime(date: any) {
  const d = new Date(date);

  d.setMinutes(d.getMinutes() - 330); // 5h 30m = 330 minutes

  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateDDMMYY(date: string) {
  if (!date) return "";

  const [day, month, year] = date.split("/");

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}