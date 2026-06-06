import React from "react";

import {
  View,
  ViewStyle,
  DimensionValue,
} from "react-native";

import { theme } from "@/theme";

type DividerOrientation =
  | "horizontal"
  | "vertical";

type DividerVariant =
  | "default"
  | "subtle"
  | "strong"
  | "dashed";

interface DividerProps {
  orientation?: DividerOrientation;

  variant?: DividerVariant;

  length?: DimensionValue;

  thickness?: number;

  style?: ViewStyle;
}

export function Divider({
  orientation = "horizontal",

  variant = "default",

  length,

  thickness = 1,

  style,
}: DividerProps) {
  return (
    <View
      style={[
        getDividerStyle({
          orientation,
          variant,
          length,
          thickness,
        }),

        style,
      ]}
    />
  );
}

function getDividerStyle({
  orientation,
  variant,
  length,
  thickness,
}: {
  orientation: DividerOrientation;

  variant: DividerVariant;

  length?: DimensionValue;

  thickness: number;
}): ViewStyle {
  const borderStyle =
    variant === "dashed"
      ? "dashed"
      : "solid";

  const color =
    variant === "strong"
      ? theme.divider.strong
      : variant === "subtle"
      ? theme.divider.subtle
      : theme.divider.default;

  if (
    orientation === "vertical"
  ) {
    return {
      width: thickness,

      height:
        length ?? "100%",

      backgroundColor:
        variant === "dashed"
          ? "transparent"
          : color,

      borderLeftWidth:
        variant === "dashed"
          ? thickness
          : 0,

      borderLeftColor: color,

      borderStyle,
    };
  }

  return {
    height: thickness,

    width:
      length ?? "100%",

    backgroundColor:
      variant === "dashed"
        ? "transparent"
        : color,

    borderTopWidth:
      variant === "dashed"
        ? thickness
        : 0,

    borderTopColor: color,

    borderStyle,
  };
}