import { View, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import QRCode from "react-native-qrcode-svg";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { spacing, radius, theme } from "@/theme";

export default function PaymentLinkQRCodeScreen() {
  const { title, url } = useLocalSearchParams<{
    title: string;
    url: string;
  }>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: spacing.lg,
        }}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            gap: spacing.md,
          }}
        >
          <Pressable
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>

          <AppText variant="h2">
            QR Code
          </AppText>
        </View>

        {/* Content */}

        <View
          style={{
            flex: 1,

            justifyContent: "center",

            alignItems: "center",

            gap: spacing.xl,
          }}
        >
          <AppText
            variant="bodyBold"
            align="center"
          >
            {title}
          </AppText>

          <View
            style={{
              padding: spacing.lg,

              borderRadius: radius.lg,

              backgroundColor:
                theme.background.surface,
            }}
          >
            <QRCode
              value={url}
              size={260}
            />
          </View>

          <AppText
            color="secondary"
            align="center"
          >
            {url}
          </AppText>

          <Button
            title="Done"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}