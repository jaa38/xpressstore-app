import { View, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { SearchBar } from "@/components/ui/SearchBar";

import { UICard } from "@/components/ui/UICard";

import { spacing, theme } from "@/theme";
import { Card } from "@/components/ui/Card";

export default function OrdersScreen() {
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
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {/* TOP */}

          <View
            style={{
              marginTop: spacing.lg,
            }}
          >
            <View style={{}}>
              <AppText variant="h1">Orders</AppText>

              <AppText variant="body" color="secondary">
                Number of orders this week
              </AppText>
            </View>

            <View
              style={{
                marginTop: spacing.md,
              }}
            >
              <SearchBar placeholder="Search orders" />
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: spacing.md,
                justifyContent: "space-between",
              }}
            >
              {/* <UICard /> */}
              <UICard title="All" variant="active" />
              <UICard title="Delivered" />
              <UICard title="Returned" />
              <UICard title="Failed" />
            </View>

            <View
              style={{
                marginTop: spacing.md,
                flexDirection: "column",
                gap: spacing.md,
              }}
            >
              <Card>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <AppText variant="h3">Order #12345</AppText>
                    <AppText variant="body" color="secondary">
                      2 items - $50.00
                    </AppText>
                  </View>

                  <Button title="View" />
                </View>
              </Card>
            </View>
          </View>

          {/* BOTTOM */}

          <View
            style={{
              paddingBottom: spacing.lg,
            }}
          ></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
