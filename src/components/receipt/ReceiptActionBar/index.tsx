import { View } from "react-native";

import { spacing } from "@/theme";

interface ReceiptActionBarProps {
  children: React.ReactNode;
}

export function ReceiptActionBar({
  children,
}: ReceiptActionBarProps) {
  return (
    <View
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        borderTopWidth: 1,

        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
        }}
      >
        {children}
      </View>
    </View>
  );
}