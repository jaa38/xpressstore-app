import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchBar } from "@/components/ui/SearchBar";

import { spacing, theme } from "@/theme";
import { router } from "expo-router";

export default function PaymentLinksScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  // Replace later with usePaymentLinks()
  const paymentLinks: any[] = [];

  const loading = false;
  const error = false;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* HEADER */}

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  gap: spacing.xs,
                }}
              >
                <AppText variant="h1">Payment Links</AppText>

                <AppText variant="body" color="secondary">
                  Create and manage payment links.
                </AppText>
              </View>

              <Button
                title="Create"
                variant="primary"
                onPress={() => {
                  // Navigate to create payment link
                }}
              />
            </View>

            {paymentLinks.length > 0 && (
              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <SearchBar
                  placeholder="Search payment links"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}

            {error && (
              <Card
                style={{
                  marginTop: spacing.md,
                  borderWidth: 1,
                  borderColor: theme.border.error,
                }}
              >
                <AppText color="error">Unable to load payment links.</AppText>
              </Card>
            )}
          </View>

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.lg,
            }}
          >
            {loading ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={theme.icon.branding.icon}
                />

                <AppText
                  style={{
                    marginTop: spacing.md,
                  }}
                >
                  Loading payment links...
                </AppText>
              </Card>
            ) : paymentLinks.length === 0 ? (
              <Card
                style={{
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                }}
              >
                <Ionicons
                  name="link-outline"
                  size={48}
                  color={theme.icon.branding.icon}
                />

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.sm,
                  }}
                >
                  No Payment Links
                </AppText>

                <AppText
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                  }}
                >
                  Create your first payment link to start accepting payments.
                </AppText>

                <Button
                  title="Create Payment Link"
                  variant="primary"
                  style={{
                    marginTop: spacing.md,
                  }}
                  onPress={() => {
                    // Navigate to create payment link
                  }}
                />
              </Card>
            ) : (
              <FlatList
                data={paymentLinks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return <Pressable>{/* PaymentLinkCard */}</Pressable>;
                }}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: spacing.md,
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: spacing.md,
                }}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
