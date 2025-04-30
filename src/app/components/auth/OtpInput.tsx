
import { Text } from "@mantine/core";
import React, { useState, useRef } from "react";

interface PinInputProps {
  onComplete: (pin: string) => void;
  studentEmail:string
}

export const PinInput: React.FC<PinInputProps> = ({studentEmail, onComplete }) => {
  const [pin, setPin] = useState<string>("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    const newPin = pin.substring(0, index) + value + pin.substring(index + 1);
    setPin(newPin);
    if (value !== "" && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newPin.length === 4) {
      onComplete(newPin);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && index > 0) {
      const newPin = pin.substring(0, index - 1) + "" + pin.substring(index);
      setPin(newPin);
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    value: string
  ) => {
    if (
      event.key !== "Backspace" &&
      value !== "" &&
      index < 3 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 4);
    const remainingSlots = 4 - pin.length;
    const newPin =
      pin.substring(0, inputRefs.current.length - remainingSlots) +
      pasteData +
      pin.substring(
        inputRefs.current.length - remainingSlots + pasteData.length
      );
    setPin(newPin);
    onComplete(newPin);
  };

  return (
    <div>
        <Text my={5} >Check inbox/spam : {studentEmail}</Text>
      {Array.from({ length: 4 }, (_, index) => (
        <input
          key={index}
          type="tel"
          maxLength={1}
          value={pin[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index, e.currentTarget.value)}
          onPaste={handlePaste}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={{
            width: "3rem",
            height: "3rem",
            fontSize: "2rem",
            textAlign: "center",
            margin: "0 0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
};

export default PinInput;
