import { View } from "react-native";

import { spacing, theme } from "@/theme";

interface BottomSheetFooterProps {
  children: React.ReactNode;
}

export function BottomSheetFooter({
  children,
}: BottomSheetFooterProps) {
  return (
    <View
      style={{
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.border.default,
        backgroundColor: theme.background.surface,
      }}
    >
      {children}
    </View>
  );
}