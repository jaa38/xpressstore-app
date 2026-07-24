import React from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme, radius } from "@/theme";

type FloatingActionButtonProps = {
  onPress?: () => void;

  bottom?: number;
  right?: number;

  disabled?: boolean;

  style?: StyleProp<ViewStyle>;
};

export function FloatingActionButton({
  onPress,
  bottom = 24,
  right = 20,
  disabled = false,
  style,
}: FloatingActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          position: "absolute",

          right,
          bottom,

          width: 64,
          height: 64,

          borderRadius: radius.full,

          justifyContent: "center",
          alignItems: "center",

          backgroundColor: disabled
            ? theme.action.primary.disabled
            : pressed
              ? theme.action.primary.pressed
              : theme.action.primary.background,

          elevation: 8,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,

          zIndex: 1000,
        },

        style,
      ]}
    >
      <Ionicons
        name="add"
        size={30}
        color={theme.action.primary.text}
      />
    </Pressable>
  );
}