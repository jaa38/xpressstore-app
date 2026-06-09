import { View, Pressable, ScrollView, Share } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { spacing, theme, radius } from "@/theme";
import { UICard } from "@/components/ui/UICard";

import * as Clipboard from "expo-clipboard";

export default function StoreScreen() {
  const storeUrl = "https://xpressstore.app/jeremiah-productions";

  async function handleCopyLink() {
    await Clipboard.setStringAsync(storeUrl);

    console.log("Link copied");
  }

  async function handleShareLink() {
    try {
      await Share.share({
        message: storeUrl,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View
          style={{
            gap: spacing.xs,
          }}
        >
          <AppText variant="h1">Storefront</AppText>

          <AppText variant="body" color="secondary">
            Manage your shop & share with customers
          </AppText>
        </View>

        {/* STORE URL */}

        <Card
          style={{
            marginTop: spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: spacing.lg,
            }}
          >
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <AppText variant="bodySmall" color="primary">
                Total Products
              </AppText>
              <AppText variant="h3" color="strong">
                4
              </AppText>
            </View>

            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <AppText variant="bodySmall" color="primary">
                Inventory Value
              </AppText>
              <AppText variant="h3" color="strong">
                ₦1,582,500
              </AppText>
            </View>
          </View>
        </Card>

        {/* STORE STATUS */}

        <Card
          style={{
            marginTop: spacing.md,
            backgroundColor: theme.background.brand,

            gap: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <AppText variant="bodyBold">Jeremiah Productions</AppText>

            <UICard title="Live" variant="active" />
          </View>

          <View
            style={{
              flexDirection: "row",

              alignItems: "center",

              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,

              backgroundColor: theme.background.primary,

              borderRadius: radius.md,

              borderWidth: 1,

              borderColor: theme.border.default,
            }}
          >
            <AppText
              variant="body"
              color="secondary"
              numberOfLines={1}
              style={{
                flex: 1,
              }}
            >
              {storeUrl}
            </AppText>

            <View
              style={{
                flexDirection: "row",

                gap: spacing.sm,

                marginLeft: spacing.sm,
              }}
            >
              <Pressable onPress={handleCopyLink}>
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={theme.icon.default.icon}
                />
              </Pressable>

              <Pressable onPress={handleShareLink}>
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>
          </View>
        </Card>

        {/* Preview Store */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <Card
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "column", gap: spacing.xs }}>
                <AppText variant="bodyBold" color="primary">
                  Preview Store
                </AppText>
                <AppText variant="bodySmall" color="secondary">
                  See what customers see
                </AppText>
              </View>
              <Ionicons name="share-outline" size={24} />
            </View>
          </Card>
        </View>

        {/* STORE PERFORMANCE */}

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <AppText variant="h3">Customise</AppText>

          <View
            style={{
              marginTop: spacing.md,
            }}
          >
            <Card
              style={{
                flex: 1,
              }}
            >
              <AppText variant="bodyBold">120</AppText>

              <AppText variant="bodySmall" color="secondary">
                Visitors
              </AppText>
            </Card>
          </View>
        </View>

        {/* SHARE STORE */}

        <Button
          title="Share Storefront"
          variant="primary"
          style={{
            marginTop: spacing.xl,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
