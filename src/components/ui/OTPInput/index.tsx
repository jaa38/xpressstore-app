import { useRef, useState } from "react";

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

  onComplete?: (code: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState(Array(length).fill(""));

  const refs = useRef<TextInput[]>([]);

  function handleChange(text: string, index: number) {
    const newOtp = [...otp];

    /**
     * PASTE SUPPORT
     */

    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, length).split("");

      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      setOtp(newOtp);

      const code = newOtp.join("");

      if (code.length === length) {
        onComplete?.(code);
      }

      return;
    }

    newOtp[index] = text;

    setOtp(newOtp);

    /**
     * NEXT INPUT
     */

    if (text && index < length - 1) {
      refs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");

    if (code.length === length) {
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
      {otp.map((value, index) => (
        <NumberInput
          key={index}
          ref={(ref) => {
            if (ref) {
              refs.current[index] = ref;
            }
          }}
          value={value}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
}
