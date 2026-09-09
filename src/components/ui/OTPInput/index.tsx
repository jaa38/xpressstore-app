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

  onChange?: (code: string) => void;

  onComplete?: (code: string) => void;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
}: OTPInputProps) {
  /**
   * --------------------------------------------------------------------------
   * STATE
   * --------------------------------------------------------------------------
   */

  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  /**
   * --------------------------------------------------------------------------
   * INPUT REFS
   * --------------------------------------------------------------------------
   */

  const refs = useRef<TextInput[]>([]);

  /**
   * --------------------------------------------------------------------------
   * SYNC EXTERNAL VALUE
   * --------------------------------------------------------------------------
   *
   * Allows the parent component to control and reset the OTP.
   *
   * Useful for:
   * - Clearing the OTP after resend
   * - React Hook Form reset()
   * - Programmatically setting an OTP
   */

  useEffect(() => {
    const digits = value.replace(/\D/g, "").slice(0, length).split("");

    const filled = [...digits, ...Array(length - digits.length).fill("")];

    setOtp(filled);
  }, [value, length]);

  /**
   * --------------------------------------------------------------------------
   * UPDATE OTP
   * --------------------------------------------------------------------------
   */

  function updateOtp(nextOtp: string[]) {
    setOtp(nextOtp);

    const code = nextOtp.join("");

    /**
     * Notify parent of every change.
     */

    onChange?.(code);

    /**
     * Notify parent when OTP is complete.
     */

    const isComplete = nextOtp.every((digit) => digit !== "");

    if (isComplete) {
      onComplete?.(code);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * HANDLE INPUT CHANGE
   * --------------------------------------------------------------------------
   */

  function handleChange(text: string, index: number) {
    /**
     * Remove non-numeric characters.
     */

    const sanitizedText = text.replace(/\D/g, "");

    /**
     * ------------------------------------------------------------------------
     * PASTE SUPPORT
     * ------------------------------------------------------------------------
     */

    if (sanitizedText.length > 1) {
      const digits = sanitizedText.slice(0, length).split("");

      const filled = Array(length).fill("");

      digits.forEach((digit, digitIndex) => {
        filled[digitIndex] = digit;
      });

      updateOtp(filled);

      /**
       * Move focus to the last field after pasting.
       */

      const lastFilledIndex = Math.min(digits.length, length) - 1;

      if (lastFilledIndex >= 0) {
        refs.current[lastFilledIndex]?.focus();
      }

      return;
    }

    /**
     * ------------------------------------------------------------------------
     * SINGLE DIGIT ENTRY
     * ------------------------------------------------------------------------
     */

    const nextOtp = [...otp];

    nextOtp[index] = sanitizedText;

    updateOtp(nextOtp);

    /**
     * Move to the next input.
     */

    if (sanitizedText && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  /**
   * --------------------------------------------------------------------------
   * HANDLE BACKSPACE
   * --------------------------------------------------------------------------
   */

  function handleKeyPress(
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) {
    const { key } = event.nativeEvent;

    if (key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  /**
   * --------------------------------------------------------------------------
   * RENDER
   * --------------------------------------------------------------------------
   */

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
          onKeyPress={(event) => handleKeyPress(event, index)}
        />
      ))}
    </View>
  );
}
