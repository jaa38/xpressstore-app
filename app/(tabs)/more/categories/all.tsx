import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
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

import type { ProductCategoryDto } from "@/types/product";

export default function AllCategoriesScreen() {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCategories();

  /**
   * ==========================================================================
   * CATEGORY CARD
   * ==========================================================================
   */

  function renderCategory({
    item,
  }: {
    item: ProductCategoryDto;
  }) {
    return (
      <Card
        style={{
          marginBottom: spacing.md,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${item.name} category`}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
          onPress={() => {
            // Edit category will be implemented in Phase 6/next iteration.
          }}
        >
          {/* ICON */}

          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.md,
              backgroundColor: theme.background.subtle,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="albums-outline"
              size={24}
              color={theme.icon.default.icon}
            />
          </View>

          {/* CONTENT */}

          <View
            style={{
              flex: 1,
              marginLeft: spacing.md,
              gap: spacing.xs,
            }}
          >
            <AppText
              variant="bodyBold"
              numberOfLines={1}
            >
              {item.name}
            </AppText>

            {item.description ? (
              <AppText
                variant="bodySmall"
                color="muted"
                numberOfLines={2}
              >
                {item.description}
              </AppText>
            ) : (
              <AppText
                variant="bodySmall"
                color="muted"
              >
                No description
              </AppText>
            )}
          </View>

          {/* STATUS */}

          <View
            style={{
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: radius.full,
              backgroundColor: item.isActive
                ? theme.state.success.background
                : theme.state.error.background,
            }}
          >
            <AppText
              variant="caption"
              color={item.isActive ? "success" : "error"}
            >
              {item.isActive ? "Active" : "Inactive"}
            </AppText>
          </View>
        </Pressable>
      </Card>
    );
  }

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
        edges={["top"]}
      >
        <StatusBar style="auto" />

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
        edges={["top"]}
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
              All Categories
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
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={theme.state.error.icon}
            />

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
   * EMPTY STATE
   * ==========================================================================
   */

  const hasCategories = categories.length > 0;

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
      edges={["top"]}
    >
      <StatusBar style="auto" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* HEADER */}

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

          <View
            style={{
              flex: 1,
              marginLeft: spacing.sm,
            }}
          >
            <AppText variant="h1">
              All Categories
            </AppText>

            <AppText
              variant="body"
              color="secondary"
            >
              {categories.length}{" "}
              {categories.length === 1
                ? "category"
                : "categories"}
            </AppText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add category"
            onPress={() => {
              // Add Category route will be implemented next.
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.full,
              backgroundColor: theme.background.brand,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="add"
              size={24}
              color={theme.icon.branding.icon}
            />
          </Pressable>
        </View>

        <Divider />

        {/* CONTENT */}

        {!hasCategories ? (
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
                backgroundColor: theme.icon.branding.background,
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
              }}
            >
              Create your first category to organise
              your products.
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
              onPress={() => {
                // Add Category route will be implemented next.
              }}
            />
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCategory}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: spacing.lg,
              paddingBottom: spacing["2xl"],
            }}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={refetch}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}