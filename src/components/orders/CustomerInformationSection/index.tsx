import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";
import { Divider } from "@/components/ui/Divider";

import { spacing, theme } from "@/theme";

import { Order } from "@/types/order";

interface Props {
  order: Order;
}

export function CustomerInformationSection({ order }: Props) {
  const rows: {
    label: string;
    value: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
    {
      label: "Customer",
      value: order.customerName,
      icon: "person-outline",
    },
    {
      label: "Phone Number",
      value: order.customerPhone,
      icon: "call-outline",
    },
  ];

  if (order.customerEmail) {
    rows.push({
      label: "Email Address",
      value: order.customerEmail,
      icon: "mail-outline",
    });
  }

  return (
    <Card
      style={{
        marginTop: spacing.lg,
        paddingHorizontal: 0,
        paddingVertical: 0,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          padding: spacing.lg,
        }}
      >
        <AppText variant="h3">Customer Information</AppText>
      </View>

      <Divider />

      {rows.map((row, index) => (
        <View key={row.label}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 999,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.icon.default.background,
              }}
            >
              <Ionicons
                name={row.icon}
                size={20}
                color={theme.icon.default.icon}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: spacing.md,
              }}
            >
              <AppText variant="bodySmall" color="secondary">
                {row.label}
              </AppText>

              <AppText
                variant="bodyBold"
                style={{
                  marginTop: spacing.xs,
                }}
              >
                {row.value}
              </AppText>
            </View>
          </View>

          {index < rows.length - 1 && <Divider />}
        </View>
      ))}
    </Card>
  );
}
