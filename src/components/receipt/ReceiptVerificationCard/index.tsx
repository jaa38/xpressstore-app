import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface ReceiptVerificationCardProps {
  verificationCode: string;
  verificationUrl: string;
  verified?: boolean;
}

export function ReceiptVerificationCard({
  verificationCode,
  verificationUrl,
  verified = true,
}: ReceiptVerificationCardProps) {
  const status = (
    verified
      ? {
          label: "Verified",
          icon: "checkmark-circle",
          color: theme.text.success,
          background:
            theme.state.success.background,
          iconColor:
            theme.icon.success.icon,
        }
      : {
          label: "Not Verified",
          icon: "close-circle",
          color: theme.text.error,
          background:
            theme.state.error.background,
          iconColor:
            theme.icon.error.icon,
        }
  ) satisfies {
    label: string;
    icon: React.ComponentProps<
      typeof Ionicons
    >["name"];
    color: string;
    background: string;
    iconColor: string;
  };

  return (
    <Card
      style={{
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,

        paddingHorizontal: 0,
        paddingVertical: 0,

        overflow: "hidden",
      }}
    >
      {/* Header */}

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">
          Receipt Verification
        </AppText>
      </View>

      <Divider />

      {/* Content */}

      <View
        style={{
          padding: spacing.lg,
        }}
      >
        {/* Verification Status */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",

            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,

            borderRadius: 999,

            backgroundColor:
              status.background,
          }}
        >
          <Ionicons
            name={status.icon}
            size={18}
            color={status.iconColor}
          />

          <AppText
            variant="bodySmallBold"
            style={{
              marginLeft: spacing.xs,
              color: status.color,
            }}
          >
            {status.label}
          </AppText>
        </View>

        {/* Verification Code */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText
            variant="bodySmall"
            color="secondary"
          >
            Verification Code
          </AppText>

          <AppText
            variant="bodyBold"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {verificationCode}
          </AppText>
        </View>

        {/* Verification URL */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText
            variant="bodySmall"
            color="secondary"
          >
            Verification URL
          </AppText>

          <AppText
            variant="bodySmall"
            style={{
              marginTop: spacing.xs,
            }}
          >
            {verificationUrl}
          </AppText>
        </View>
      </View>
    </Card>
  );
}