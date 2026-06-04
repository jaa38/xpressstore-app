import { useEffect, useRef, useState } from "react";

import {
  TextInput,
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

import { NumberInput } from "@/components/ui/NumberInput";

import { spacing } from "@/theme";

interface OTPInputProps {
  length?: number;

  value?: string;

  onComplete?: (code: string) => void;
}

export function OTPInput({
  length = 6,
  value = "",
  onComplete,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  const refs = useRef<TextInput[]>([]);

  /**
   * Sync external value
   * Useful for React Hook Form reset()
   */
  useEffect(() => {
    if (!value) {
      setOtp(Array(length).fill(""));

      return;
    }

    const digits = value.slice(0, length).split("");

    const filled = [...digits, ...Array(length - digits.length).fill("")];

    setOtp(filled);
  }, [value, length]);

  function handleChange(text: string, index: number) {
    const newOtp = [...otp];

    /**
     * Paste Support
     */

    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, length).split("");

      const filled = Array(length).fill("");

      digits.forEach((digit, i) => {
        filled[i] = digit;
      });

      setOtp(filled);

      const code = filled.join("");

      const isComplete = filled.every((digit) => digit !== "");

      if (isComplete) {
        onComplete?.(code);
      }

      return;
    }

    /**
     * Single Digit Entry
     */

    newOtp[index] = text;

    setOtp(newOtp);

    /**
     * Move Forward
     */

    if (text && index < length - 1) {
      refs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");

    const isComplete = newOtp.every((digit) => digit !== "");

    if (isComplete) {
      onComplete?.(code);
    }
  }

  function handleKeyPress(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",

        justifyContent: "center",

        gap: spacing.sm,
      }}
    >
      {otp.map((digit, index) => (
        <NumberInput
          key={index}
          ref={(ref) => {
            if (ref) {
              refs.current[index] = ref;
            }
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
}
