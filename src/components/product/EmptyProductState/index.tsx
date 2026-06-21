import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

export function EmptyProductState() {
  return (
    <Card
      style={{
        alignItems: "center",
        paddingVertical: spacing.xl,
      }}
    >
      <Ionicons
        name="cube-outline"
        size={48}
        color={theme.icon.branding.icon}
      />

      <AppText
        variant="bodyLargeBold"
        style={{
          marginTop: spacing.sm,
        }}
      >
        No Products Yet
      </AppText>

      <AppText
        color="secondary"
        style={{
          textAlign: "center",
          marginTop: spacing.xs,
        }}
      >
        Add your first product to start selling.
      </AppText>

      <Button
        title="Add Product"
        variant="primary"
        style={{
          marginTop: spacing.md,
        }}
        onPress={() => router.push(ROUTES.ADD_PRODUCT_INFO)}
      />
    </Card>
  );
}
