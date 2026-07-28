import { Pressable, View, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme, radius } from "@/theme";
import { SearchBar } from "@/components/ui/SearchBar";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function CustomersScreen() {
  const phoneNumber = "+23493322201234";

  async function handleCall() {
    const url = `tel:${phoneNumber}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to place call");
    }
  }

  async function handleWhatsApp() {
    const url = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp is not installed.");
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* Back Button */}

            <Pressable
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.text.primary}
              />
            </Pressable>

            {/* Title */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Customers</AppText>

              <AppText variant="body" color="secondary">
                Number of customers
              </AppText>
            </View>

            {/* Add Button */}

            <Pressable
              onPress={() => {
                // router.push(ROUTES.ADD_CUSTOMER)
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.action.primary.background,
              }}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
              marginTop: spacing.md,
            }}
          >
            {/* Search */}
            <SearchBar />

            <View
              style={{
                marginTop: spacing.md,
                gap: spacing.md,
              }}
            >
              <Card>
                {/* Customer */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="person-circle"
                    size={56}
                    color={theme.icon.default.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <AppText variant="h3">Jim Parsons</AppText>

                    <AppText variant="body" color="secondary">
                      +234 933 222 01234
                    </AppText>
                  </View>
                </View>

                <Divider
                  style={{
                    marginVertical: spacing.rg,
                  }}
                />

                {/* Summary */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: spacing.md,
                    }}
                  >
                    <View>
                      <AppText variant="label" color="secondary">
                        Orders
                      </AppText>

                      <AppText variant="bodyBold">12</AppText>
                    </View>

                    <View>
                      <AppText variant="label" color="secondary">
                        Spent
                      </AppText>

                      <AppText variant="bodyBold">₦142,000</AppText>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.sm,
                    }}
                  >
                    <Pressable
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.background.subtle,
                      }}
                      onPress={handleCall}
                    >
                      <Ionicons
                        name="call-outline"
                        size={22}
                        color={theme.icon.default.icon}
                      />
                    </Pressable>

                    <Pressable
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#25D36615",
                      }}
                      onPress={handleWhatsApp}
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        size={22}
                        color="#25D366"
                      />
                    </Pressable>
                  </View>
                </View>
              </Card>
              <Card>
                {/* Customer */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="person-circle"
                    size={56}
                    color={theme.icon.default.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <AppText variant="h3">Jim Parsons</AppText>

                    <AppText variant="body" color="secondary">
                      +234 933 222 01234
                    </AppText>
                  </View>
                </View>

                <Divider
                  style={{
                    marginVertical: spacing.rg,
                  }}
                />

                {/* Summary */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: spacing.md,
                    }}
                  >
                    <View>
                      <AppText variant="label" color="secondary">
                        Orders
                      </AppText>

                      <AppText variant="bodyBold">12</AppText>
                    </View>

                    <View>
                      <AppText variant="label" color="secondary">
                        Spent
                      </AppText>

                      <AppText variant="bodyBold">₦142,000</AppText>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.sm,
                    }}
                  >
                    <Pressable
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.background.subtle,
                      }}
                      onPress={handleCall}
                    >
                      <Ionicons
                        name="call-outline"
                        size={22}
                        color={theme.icon.default.icon}
                      />
                    </Pressable>

                    <Pressable
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#25D36615",
                      }}
                      onPress={handleWhatsApp}
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        size={22}
                        color="#25D366"
                      />
                    </Pressable>
                  </View>
                </View>
              </Card>

              <Card>
                {/* Customer */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="person-circle"
                    size={56}
                    color={theme.icon.default.icon}
                  />

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <AppText variant="h3">Jim Parsons</AppText>

                    <AppText variant="body" color="secondary">
                      +234 933 222 01234
                    </AppText>
                  </View>
                </View>

                <Divider
                  style={{
                    marginVertical: spacing.rg,
                  }}
                />

                {/* Summary */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: spacing.md,
                    }}
                  >
                    <View>
                      <AppText variant="label" color="secondary">
                        Orders
                      </AppText>

                      <AppText variant="bodyBold">12</AppText>
                    </View>

                    <View>
                      <AppText variant="label" color="secondary">
                        Spent
                      </AppText>

                      <AppText variant="bodyBold">₦142,000</AppText>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.sm,
                    }}
                  >
                    <Pressable
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.background.subtle,
                      }}
                      onPress={handleCall}
                    >
                      <Ionicons
                        name="call-outline"
                        size={22}
                        color={theme.icon.default.icon}
                      />
                    </Pressable>

                    <Pressable
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.full,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#25D36615",
                      }}
                      onPress={handleWhatsApp}
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        size={22}
                        color="#25D366"
                      />
                    </Pressable>
                  </View>
                </View>
              </Card>
            </View>

            {/* Customer List */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
