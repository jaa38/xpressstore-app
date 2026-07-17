import { View } from "react-native";

import { AppText } from "@/components/ui/AppText";

import { spacing } from "@/theme";

interface BottomSheetSectionProps {
  title: string;
  children: React.ReactNode;
}

export function BottomSheetSection({
  title,
  children,
}: BottomSheetSectionProps) {
  return (
    <View
      style={{
        marginBottom: spacing.xl,
      }}
    >
      <AppText
        variant="bodyLargeBold"
        style={{
          marginBottom: spacing.md,
        }}
      >
        {title}
      </AppText>

      {children}
    </View>
  );
}