import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

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
