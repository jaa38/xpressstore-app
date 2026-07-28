import { Alert, Pressable, Share, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import QRCode from "react-native-qrcode-svg";

import * as Clipboard from "expo-clipboard";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { spacing, radius, theme } from "@/theme";

export default function PaymentLinkQRCodeScreen() {
  const { title = "", url = "" } = useLocalSearchParams<{
    title?: string;
    url?: string;
  }>();

  async function handleCopyLink() {
    if (!url) return;

    await Clipboard.setStringAsync(url);

    Alert.alert("Link Copied", "Payment link copied to clipboard.");
  }

  async function handleShareLink() {
    if (!url) return;

    try {
      await Share.share({
        title,
        message: `${title}\n\n${url}`,
        url,
      });
    } catch {
      Alert.alert(
        "Unable to Share",
        "Something went wrong while trying to share the payment link."
      );
    }
  }

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
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.text.primary}
            />
          </Pressable>

          <AppText variant="h2">QR Code</AppText>
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
          <AppText variant="bodyBold" align="center">
            {title}
          </AppText>

          <View
            style={{
              padding: spacing.lg,
              borderRadius: radius.lg,
              backgroundColor: theme.background.surface,
            }}
          >
            <QRCode value={url} size={260} />
          </View>

          <AppText color="secondary" align="center" selectable>
            {url}
          </AppText>

          <View
            style={{
              width: "100%",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "stretch",
                gap: spacing.md,
              }}
            >
              <Button
                title="Copy"
                variant="tertiary"
                style={{ flex: 1 }}
                leftIcon={
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={theme.action.tertiary.text}
                  />
                }
                onPress={handleCopyLink}
              />

              <Button
                title="Share"
                style={{ flex: 1 }}
                leftIcon={
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color={theme.action.primary.text}
                  />
                }
                onPress={handleShareLink}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
