import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

interface AddProductFooterProps {
  onSaveDraft?: () => void;

  onNext: () => void;

  nextLabel?: string;
}

export function AddProductFooter({
  onSaveDraft,
  onNext,
  nextLabel = "Next",
}: AddProductFooterProps) {
  return (
    <>
      <Divider />

      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,

          backgroundColor: theme.background.surface,

          flexDirection: "row",

          gap: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Button
            title="Save as Draft"
            variant="tertiary"
            onPress={onSaveDraft}
          />
        </View>

        <View
          style={{
            flex: 1,
          }}
        >
          <Button title={nextLabel} onPress={onNext} />
        </View>
      </View>
    </>
  );
}
