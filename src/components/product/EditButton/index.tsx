import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme } from "@/theme";

interface EditButtonProps {
  onPress: () => void;
}

export function EditButton({ onPress }: EditButtonProps) {
  return (
    <Pressable onPress={onPress} hitSlop={12}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
        }}
      >
        <Ionicons
          name="create-outline"
          color={theme.icon.branding.icon}
          size={20}
        />

        <AppText variant="bodyBold" color="success">
          Edit
        </AppText>
      </View>
    </Pressable>
  );
}
