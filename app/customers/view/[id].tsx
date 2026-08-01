import {
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenHeader } from "@/components/common/ScreenHeader";

import { Divider } from "@/components/ui/Divider";
import { Card } from "@/components/ui/Card";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";

import { spacing, radius, theme } from "@/theme";

import { useCustomerById } from "@/hooks/customers/useCustomerById";

import { countryOptions } from "@/constants/address/countries";

import * as Clipboard from "expo-clipboard";

import { useToast } from "@/hooks/useToast";

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const { showToast } = useToast();

  const { data: customer, isLoading } = useCustomerById(id);

  const countryLabel =
    countryOptions.find((country) => country.value === customer?.country)
      ?.label ?? customer?.country;

  async function handleCall(phone: string) {
    const url = `tel:${phone}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to place call");
    }
  }

  async function handleWhatsApp(phone: string) {
    const url = `https://wa.me/${phone.replace(/\D/g, "")}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp is not installed.");
    }
  }

  async function handleEmail(email: string) {
    if (!email) return;

    const url = `mailto:${email}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Unable to open email app.");
    }
  }

  async function handleCopy(
    value: string,
    label: "Phone Number" | "Email Address"
  ) {
    if (!value) {
      return;
    }

    await Clipboard.setStringAsync(value);

    showToast({
      type: "success",
      title: `${label} Copied`,
      message: `${label} copied to clipboard.`,
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={theme.icon.branding.icon} />

        <AppText
          style={{
            marginTop: spacing.md,
          }}
        >
          Loading customer...
        </AppText>
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background.primary,
        }}
      >
        <AppText>Customer not found.</AppText>

        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={{
            marginTop: spacing.lg,
          }}
        />
      </SafeAreaView>
    );
  }

  const initials = customer.name
    .split(" ")
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <ScreenHeader title="Customer Details" onBack={() => router.back()} />

      <Divider />

      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.md,
          paddingBottom: spacing["2xl"],
        }}
      >
        {/* Customer Profile */}
        <Card>
          <View
            style={{
              alignItems: "center",
              paddingVertical: spacing.lg,
            }}
          >
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.icon.branding.background,
                marginBottom: spacing.md,
              }}
            >
              <AppText
                variant="h2"
                style={{
                  color: theme.icon.branding.icon,
                }}
              >
                {initials}
              </AppText>
            </View>

            <AppText
              variant="h2"
              style={{
                textAlign: "center",
              }}
            >
              {customer.name}
            </AppText>

            <View
              style={{
                marginTop: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: radius.full,
                backgroundColor:
                  customer.customerType === "business"
                    ? theme.badge.secondary.background
                    : theme.badge.primary.background,
              }}
            >
              <AppText
                variant="caption"
                style={{
                  color:
                    customer.customerType === "business"
                      ? theme.badge.secondary.text
                      : theme.badge.primary.text,
                  textTransform: "capitalize",
                }}
              >
                {customer.customerType}
              </AppText>
            </View>
          </View>
        </Card>

        {/* Contact Information */}

        <View>
          <AppText variant="h3">Contact Information</AppText>

          <Card style={{ marginTop: spacing.sm }}>
            {/* Phone */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.branding.background,
                }}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={theme.icon.branding.icon}
                />
              </View>

              {/* Content */}
              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  Phone Number
                </AppText>

                <AppText
                  variant="bodyBold"
                  onPress={() => handleCall(customer.phone)}
                >
                  {customer.phone}
                </AppText>
              </View>

              {/* Copy */}
              <Pressable
                onPress={() => handleCopy(customer.phone, "Phone Number")}
                hitSlop={10}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.background.subtle,
                }}
              >
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color={theme.icon.default.icon}
                />
              </Pressable>
            </View>

            <Divider
              style={{
                marginVertical: spacing.md,
              }}
            />

            {/* Email */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.full,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.icon.accent.background,
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.icon.accent.icon}
                />
              </View>

              {/* Content */}
              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  Email Address
                </AppText>

                <AppText
                  variant="bodyBold"
                  onPress={() => {
                    if (customer.email) {
                      handleEmail(customer.email);
                    }
                  }}
                >
                  {customer.email || "No email provided"}
                </AppText>
              </View>

              {/* Copy */}
              {!!customer.email && (
                <Pressable
                  onPress={() => handleCopy(customer.email, "Email Address")}
                  hitSlop={10}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.full,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.background.subtle,
                  }}
                >
                  <Ionicons
                    name="copy-outline"
                    size={18}
                    color={theme.icon.default.icon}
                  />
                </Pressable>
              )}
            </View>
          </Card>
        </View>

        {/* Customer Summary */}

        <View>
          <AppText variant="h3">Customer Summary</AppText>
          <Card style={{ marginTop: spacing.sm }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  Orders
                </AppText>

                <AppText
                  variant="h2"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {customer.orders}
                </AppText>
              </View>

              <View
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  backgroundColor: theme.divider.default,
                  marginHorizontal: spacing.lg,
                }}
              />

              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  Total Spent
                </AppText>

                <AppText
                  variant="h2"
                  style={{
                    marginTop: spacing.xs,
                  }}
                >
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(customer.spent)}
                </AppText>
              </View>
            </View>
          </Card>
        </View>
        {/* Address Information */}

        <View>
          <AppText variant="h3">Address Information</AppText>
          <Card style={{ marginTop: spacing.sm }}>
            {/* Country */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color={theme.icon.branding.icon}
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  Country
                </AppText>
                <AppText variant="bodyBold">{countryLabel || "—"}</AppText>
              </View>
            </View>

            <Divider
              style={{
                marginVertical: spacing.md,
              }}
            />

            {/* State */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={theme.icon.accent.icon}
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  State
                </AppText>

                <AppText variant="bodyBold">{customer.state || "—"}</AppText>
              </View>
            </View>

            <Divider
              style={{
                marginVertical: spacing.md,
              }}
            />

            {/* City */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.state.info.icon}
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  City
                </AppText>

                <AppText variant="bodyBold">{customer.city || "—"}</AppText>
              </View>
            </View>

            <Divider
              style={{
                marginVertical: spacing.md,
              }}
            />

            {/* Street */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="home-outline"
                  size={20}
                  color={theme.icon.default.icon}
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <AppText variant="caption" color="secondary">
                  Street
                </AppText>

                <AppText variant="bodyBold">{customer.street || "—"}</AppText>
              </View>
            </View>
          </Card>
        </View>
        {/* Quick Actions */}

        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            paddingVertical: spacing.lg,
          }}
        >
          <Button
            title="Call"
            variant="tertiary"
            style={{
              flex: 1,
            }}
            leftIcon={
              <Ionicons
                name="call-outline"
                size={20}
                color={theme.action.tertiary.text}
              />
            }
            onPress={() => handleCall(customer.phone)}
          />

          <Button
            title="WhatsApp"
            variant="whatsapp"
            style={{
              flex: 1,
            }}
            leftIcon={
              <Ionicons
                name="logo-whatsapp"
                size={20}
                color={theme.action.whatsapp.text}
              />
            }
            onPress={() => handleWhatsApp(customer.phone)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
