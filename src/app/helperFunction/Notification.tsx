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
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

  export function containsOnlyDigits(inputString: string) {
    return /^\d+$/.test(inputString) || inputString === "";
  }