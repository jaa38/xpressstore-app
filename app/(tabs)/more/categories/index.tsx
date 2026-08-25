import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";

import { spacing, theme, radius } from "@/theme";

import { useCategories } from "@/hooks/categories/useCategories";

export default function CategoriesScreen() {
  /**
   * ==========================================================================
   * CATEGORIES
   * ==========================================================================
   */

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCategories();

  const hasCategories = categories.length > 0;

  /**
   * ==========================================================================
   * ACTIONS
   * ==========================================================================
   */

  const handleAddCategory = () => {
    router.push("/(tabs)/more/categories/add");
  };

  const handleViewCategories = () => {
    router.push("/(tabs)/more/categories/all");
  };

  /**
   * ==========================================================================
   * LOADING
   * ==========================================================================
   */

  if (isLoading) {
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
              flexDirection: "row",
              alignItems: "center",
              minHeight: 64,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
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

            <AppText
              variant="h1"
              style={{
                marginLeft: spacing.sm,
              }}
            >
              Categories
            </AppText>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color={theme.action.primary.background}
            />

            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.md,
              }}
            >
              Loading categories...
            </AppText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * ERROR
   * ==========================================================================
   */

  if (isError) {
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
              flexDirection: "row",
              alignItems: "center",
              minHeight: 64,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
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

            <AppText
              variant="h1"
              style={{
                marginLeft: spacing.sm,
              }}
            >
              Categories
            </AppText>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: spacing.lg,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.full,
                backgroundColor: theme.state.error.background,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={theme.state.error.icon}
              />
            </View>

            <AppText
              variant="bodyLargeBold"
              style={{
                marginTop: spacing.md,
                textAlign: "center",
              }}
            >
              Unable to load categories
            </AppText>

            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.xs,
                textAlign: "center",
              }}
            >
              Something went wrong while loading your categories.
            </AppText>

            <Button
              title="Try Again"
              variant="primary"
              onPress={() => refetch()}
              style={{
                marginTop: spacing.lg,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * SCREEN
   * ==========================================================================
   */

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
          }}
        >
          {/* =================================================================
              HEADER
          ================================================================= */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
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

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Categories</AppText>

              <AppText variant="body" color="secondary">
                {hasCategories
                  ? `${categories.length} ${
                      categories.length === 1
                        ? "category"
                        : "categories"
                    }`
                  : "Organise your products into categories."}
              </AppText>
            </View>
          </View>

          {/* =================================================================
              CONTENT
          ================================================================= */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: spacing.lg,
              paddingBottom: spacing["2xl"],
            }}
          >
            {/* ===============================================================
                CATEGORY MANAGEMENT
            =============================================================== */}

            <AppText
              variant="bodyBold"
              color="muted"
              style={{
                marginBottom: spacing.sm,
              }}
            >
              Manage Categories
            </AppText>

            <Card
              style={{
                gap: spacing.rg,
              }}
            >
              {/* -------------------------------------------------------------
                  ALL CATEGORIES
              ------------------------------------------------------------- */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View all categories"
                onPress={handleViewCategories}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.subtle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="grid-outline"
                    size={22}
                    color={theme.listItem.default.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">
                    All Categories
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="muted"
                  >
                    {hasCategories
                      ? `View and manage your ${categories.length} ${
                          categories.length === 1
                            ? "category"
                            : "categories"
                        }`
                      : "View and manage your product categories"}
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>

              <Divider />

              {/* -------------------------------------------------------------
                  ADD CATEGORY
              ------------------------------------------------------------- */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add category"
                onPress={handleAddCategory}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: theme.background.brand,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="add-outline"
                    size={24}
                    color={theme.icon.branding.icon}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    gap: spacing.xs,
                  }}
                >
                  <AppText variant="bodyBold">
                    Add Category
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    color="muted"
                  >
                    Create a new product category
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.listItem.default.chevron}
                />
              </Pressable>
            </Card>

            {/* ===============================================================
                EMPTY STATE
            =============================================================== */}

            {!hasCategories && (
              <Card
                style={{
                  marginTop: spacing.lg,
                  alignItems: "center",
                  paddingVertical: spacing.xl,
                  paddingHorizontal: spacing.lg,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: radius.full,
                    backgroundColor:
                      theme.icon.branding.background,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="albums-outline"
                    size={32}
                    color={theme.icon.branding.icon}
                  />
                </View>

                <AppText
                  variant="bodyLargeBold"
                  style={{
                    marginTop: spacing.md,
                    textAlign: "center",
                  }}
                >
                  No categories yet
                </AppText>

                <AppText
                  variant="body"
                  color="secondary"
                  style={{
                    marginTop: spacing.xs,
                    textAlign: "center",
                    maxWidth: 320,
                  }}
                >
                  Organise your products into categories to make
                  your storefront easier for customers to browse.
                </AppText>

                <Button
                  title="Add Category"
                  variant="primary"
                  leftIcon={
                    <Ionicons
                      name="add"
                      size={20}
                      color={theme.action.primary.text}
                    />
                  }
                  style={{
                    marginTop: spacing.lg,
                  }}
                  onPress={handleAddCategory}
                />

                <AppText
                  variant="caption"
                  color="muted"
                  style={{
                    marginTop: spacing.sm,
                    textAlign: "center",
                  }}
                >
                  Categories can be assigned to your products when
                  creating or editing them.
                </AppText>
              </Card>
            )}

            {/* ===============================================================
                INFORMATION
            =============================================================== */}

            <View
              style={{
                marginTop: spacing.xl,
                alignItems: "center",
                paddingHorizontal: spacing.lg,
              }}
            >
              <AppText
                variant="bodySmall"
                color="secondary"
                style={{
                  textAlign: "center",
                  maxWidth: 320,
                }}
              >
                Categories help customers find the products they
                are looking for quickly.
              </AppText>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}