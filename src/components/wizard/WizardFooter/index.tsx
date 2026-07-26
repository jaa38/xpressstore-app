import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

interface WizardFooterProps {
  onPrimary: () => void;

  onSecondary?: () => void;

  primaryLabel?: string;

  secondaryLabel?: string;

  hideSecondary?: boolean;

  loading?: boolean;
}

export function WizardFooter({
  onPrimary,
  onSecondary,

  primaryLabel = "Next",
  secondaryLabel = "Save as Draft",

  hideSecondary = false,

  loading = false,
}: WizardFooterProps) {
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
        {!hideSecondary && (
          <View
            style={{
              flex: 1,
            }}
          >
            <Button
              title={secondaryLabel}
              variant="tertiary"
              onPress={onSecondary}
            />
          </View>
        )}

        <View
          style={{
            flex: 1,
          }}
        >
          <Button title={primaryLabel} loading={loading} onPress={onPrimary} />
        </View>
      </View>
    </>
  );
}
