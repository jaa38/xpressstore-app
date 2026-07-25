import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface BottomSheetHeaderProps {
  title: string;
  onClose: () => void;
}

export function BottomSheetHeader({ title, onClose }: BottomSheetHeaderProps) {
  return (
    <View
      style={{
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText variant="h2">{title}</AppText>

        <Pressable hitSlop={10} onPress={onClose}>
          <Ionicons name="close" size={22} color={theme.text.primary} />
        </Pressable>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: theme.border.default,
          marginTop: spacing.lg,
        }}
      />
    </View>
  );
}
