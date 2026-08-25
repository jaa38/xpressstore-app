import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { router, useFocusEffect } from "expo-router";

import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { useCallback, useMemo, useState } from "react";

import { AppText } from "@/components/ui/AppText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";

import { spacing, theme, radius } from "@/theme";

import { useCategories } from "@/hooks/categories/useCategories";
import { useDeleteCategory } from "@/hooks/categories/useDeleteCategory";

import { useToast } from "@/hooks/useToast";

import { ROUTES } from "@/navigation/routes";

import { USE_MOCK_PRODUCTS } from "@/mocks/config";
import { getMockCategories } from "@/mocks/categories";

import type { ProductCategoryDto } from "@/types/product";

/**
 * ============================================================================
 * RIGHT SWIPE ACTIONS
 * ============================================================================
 */

function RightActions({
  onDelete,
  disabled,
}: {
  onDelete: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Delete category"
      disabled={disabled}
      onPress={onDelete}
      style={{
        width: 90,
        marginLeft: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.action.primary.delete,
        borderRadius: radius.md,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name="trash-outline" size={24} color={theme.text.inverse} />

      <AppText
        variant="bodySmall"
        color="inverse"
        style={{
          marginTop: spacing.xs,
        }}
      >
        Delete
      </AppText>
    </Pressable>
  );
}

/**
 * ============================================================================
 * CATEGORY CARD
 * ============================================================================
 */

function CategoryCard({
  category,
  onDelete,
  deleting,
}: {
  category: ProductCategoryDto;
  onDelete: (categoryId: number) => void;
  deleting: boolean;
}) {
  return (
    <Swipeable
      enabled={!deleting}
      renderRightActions={() => (
        <RightActions
          disabled={deleting}
          onDelete={() => onDelete(category.id)}
        />
      )}
    >
      <Card
        style={{
          borderWidth: 1,
          borderColor: theme.border.default,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* ================================================================
              ICON
          ================================================================ */}

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

          {/* ================================================================
              DETAILS
          ================================================================ */}

          <View
            style={{
              flex: 1,
              marginLeft: spacing.md,
              gap: spacing.xs,
            }}
          >
            <AppText variant="bodyBold" numberOfLines={1}>
              {category.name}
            </AppText>

            <AppText variant="bodySmall" color="muted" numberOfLines={2}>
              {category.description || "No description"}
            </AppText>
          </View>

          {/* ================================================================
              STATUS
          ================================================================ */}

          <View
            style={{
              marginLeft: spacing.sm,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: radius.full,
              backgroundColor: category.isActive
                ? theme.state.success.background
                : theme.state.error.background,
            }}
          >
            <AppText
              variant="caption"
              color={category.isActive ? "success" : "error"}
            >
              {category.isActive ? "Active" : "Inactive"}
            </AppText>
          </View>
        </View>
      </Card>
    </Swipeable>
  );
}

/**
 * ============================================================================
 * FIRST-TIME USER EMPTY STATE
 * ============================================================================
 */

function CategoriesEmptyState({
  onAddCategory,
}: {
  onAddCategory: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Card
        style={{
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
            maxWidth: 320,
          }}
        >
          Organise your products into categories to make your storefront easier
          for customers to browse.
        </AppText>

        <Button
          title="Add Category"
          variant="primary"
          leftIcon={
            <Ionicons name="add" size={20} color={theme.action.primary.text} />
          }
          style={{
            marginTop: spacing.lg,
          }}
          onPress={onAddCategory}
        />

        <AppText
          variant="caption"
          color="muted"
          style={{
            marginTop: spacing.sm,
            textAlign: "center",
          }}
        >
          Categories can be assigned to your products when creating or editing
          them.
        </AppText>
      </Card>
    </View>
  );
}

/**
 * ============================================================================
 * SEARCH EMPTY STATE
 * ============================================================================
 */

function CategoriesSearchEmptyState({
  onClearSearch,
}: {
  onClearSearch: () => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          alignItems: "center",
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: theme.icon.default.background,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="search-outline"
            size={28}
            color={theme.icon.default.icon}
          />
        </View>

        <AppText
          variant="bodyLargeBold"
          style={{
            marginTop: spacing.md,
            textAlign: "center",
          }}
        >
          No categories found
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          style={{
            marginTop: spacing.xs,
            textAlign: "center",
          }}
        >
          Try searching with a different category name.
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear category search"
          onPress={onClearSearch}
          style={{
            marginTop: spacing.md,
          }}
        >
          <AppText color="link">Clear Search</AppText>
        </Pressable>
      </Card>
    </View>
  );
}

/**
 * ============================================================================
 * ERROR STATE
 * ============================================================================
 */

function CategoriesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
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
          width: 56,
          height: 56,
          borderRadius: radius.full,
          backgroundColor: theme.background.error,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={30}
          color={theme.icon.error.icon}
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
          maxWidth: 320,
        }}
      >
        We couldn't load your categories. Please try again.
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Try again"
        onPress={onRetry}
        style={{
          marginTop: spacing.md,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        }}
      >
        <AppText color="link">Try Again</AppText>
      </Pressable>
    </View>
  );
}

/**
 * ============================================================================
 * CATEGORIES SCREEN
 * ============================================================================
 */

export default function CategoriesScreen() {
  /**
   * --------------------------------------------------------------------------
   * API
   * --------------------------------------------------------------------------
   */

  const {
    data: categories = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCategories();

  /**
   * --------------------------------------------------------------------------
   * MOCK DATA
   * --------------------------------------------------------------------------
   */

  const [mockCategories, setMockCategories] = useState<ProductCategoryDto[]>(
    () => (USE_MOCK_PRODUCTS ? getMockCategories() : [])
  );

  const refreshMockCategories = useCallback(() => {
    if (!USE_MOCK_PRODUCTS) {
      return;
    }

    setMockCategories(getMockCategories());
  }, []);

  /**
   * --------------------------------------------------------------------------
   * SOURCE OF TRUTH
   * --------------------------------------------------------------------------
   */

  const categoryList = useMemo(() => {
    const source = USE_MOCK_PRODUCTS ? mockCategories : categories;

    return source.filter((category) => category.isActive);
  }, [categories, mockCategories]);

  /**
   * --------------------------------------------------------------------------
   * SCREEN FOCUS
   * --------------------------------------------------------------------------
   */

  useFocusEffect(
    useCallback(() => {
      if (USE_MOCK_PRODUCTS) {
        refreshMockCategories();
        return;
      }

      refetch();
    }, [refreshMockCategories, refetch])
  );

  /**
   * --------------------------------------------------------------------------
   * MUTATIONS
   * --------------------------------------------------------------------------
   */

  const deleteCategoryMutation = useDeleteCategory();

  const { showToast } = useToast();

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const [searchQuery, setSearchQuery] = useState("");

  /**
   * --------------------------------------------------------------------------
   * SCREEN STATE
   * --------------------------------------------------------------------------
   *
   * Architecture:
   *
   * 1. Initial loading
   * 2. First-time user
   * 3. Error after categories already exist
   * 4. Search empty
   * 5. Category list
   *
   * IMPORTANT:
   *
   * A merchant with no categories should not see
   * a technical API error.
   */

  const hasCategories = categoryList.length > 0;

  const isFirstTimeUser =
    !isLoading && !isError && !hasCategories && searchQuery.trim() === "";

  const showCategoryError = !isLoading && isError && hasCategories;

  /**
   * --------------------------------------------------------------------------
   * SORT
   * --------------------------------------------------------------------------
   */

  const sortedCategories = useMemo(() => {
    return [...categoryList].sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryList]);

  /**
   * --------------------------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------------------------
   */

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sortedCategories;
    }

    return sortedCategories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [sortedCategories, searchQuery]);

  const hasNoSearchResults =
    !isLoading &&
    !showCategoryError &&
    hasCategories &&
    searchQuery.trim() !== "" &&
    filteredCategories.length === 0;

  /**
   * --------------------------------------------------------------------------
   * HEADER
   * --------------------------------------------------------------------------
   */

  const headerSubtitle = isLoading
    ? "Loading categories..."
    : isFirstTimeUser
      ? "Organise your products into categories."
      : categoryList.length === 1
        ? "1 category"
        : `${categoryList.length} categories`;

  /**
   * --------------------------------------------------------------------------
   * ADD CATEGORY
   * --------------------------------------------------------------------------
   */

  const handleAddCategory = () => {
    router.push(ROUTES.ADD_CATEGORY);
  };

  /**
   * --------------------------------------------------------------------------
   * DELETE CATEGORY
   * --------------------------------------------------------------------------
   */

  const handleDelete = (categoryId: number) => {
    if (deleteCategoryMutation.isPending) {
      return;
    }

    const category = categoryList.find((item) => item.id === categoryId);

    if (!category) {
      return;
    }

    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteCategoryMutation.mutateAsync(categoryId);

              if (USE_MOCK_PRODUCTS) {
                refreshMockCategories();
              } else {
                await refetch();
              }

              showToast({
                type: "success",
                title: "Category Deleted",
                message: "The category has been removed successfully.",
              });
            } catch (error) {
              console.log("DELETE CATEGORY ERROR", error);

              showToast({
                type: "error",
                title: "Delete Failed",
                message: "Unable to delete this category. Please try again.",
              });
            }
          },
        },
      ]
    );
  };

  /**
   * --------------------------------------------------------------------------
   * REFRESH
   * --------------------------------------------------------------------------
   */

  const onRefresh = async () => {
    if (USE_MOCK_PRODUCTS) {
      refreshMockCategories();
      return;
    }

    await refetch();
  };

  /**
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
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
          {/* ================================================================
              HEADER
          ================================================================ */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            {/* BACK */}

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

            {/* TITLE */}

            <View
              style={{
                flex: 1,
                gap: spacing.xs,
              }}
            >
              <AppText variant="h1">Categories</AppText>

              <AppText variant="body" color="secondary">
                {headerSubtitle}
              </AppText>
            </View>

            {/* ADD */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add category"
              disabled={deleteCategoryMutation.isPending}
              onPress={handleAddCategory}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: radius.full,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: pressed
                  ? theme.action.primary.pressed
                  : theme.action.primary.background,
                opacity: deleteCategoryMutation.isPending ? 0.5 : 1,
              })}
            >
              <Ionicons
                name="add"
                size={24}
                color={theme.action.primary.text}
              />
            </Pressable>
          </View>

          {/* ================================================================
              CONTENT
          ================================================================ */}

          <View
            style={{
              flex: 1,
            }}
          >
            {/* ==============================================================
                SEARCH
            ============================================================== */}

            {!isFirstTimeUser && !showCategoryError && (
              <View
                style={{
                  marginTop: spacing.md,
                }}
              >
                <SearchBar
                  placeholder="Search categories"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}

            {/* ==============================================================
                CATEGORY CONTENT
            ============================================================== */}

            <View
              style={{
                flex: 1,
                marginTop: spacing.md,
              }}
            >
              {/* ============================================================
                  1. INITIAL LOADING
              ============================================================ */}

              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: spacing["3xl"],
                  }}
                >
                  <ActivityIndicator
                    size="large"
                    color={theme.icon.branding.icon}
                  />

                  <AppText
                    color="secondary"
                    style={{
                      marginTop: spacing.md,
                    }}
                  >
                    Loading categories...
                  </AppText>
                </View>
              ) : showCategoryError ? (
                /* ==========================================================
                   2. ERROR
                ========================================================== */

                <CategoriesErrorState onRetry={refetch} />
              ) : isFirstTimeUser ? (
                /* ==========================================================
                   3. FIRST-TIME USER
                ========================================================== */

                <CategoriesEmptyState onAddCategory={handleAddCategory} />
              ) : hasNoSearchResults ? (
                /* ==========================================================
                   4. SEARCH EMPTY
                ========================================================== */

                <CategoriesSearchEmptyState
                  onClearSearch={() => setSearchQuery("")}
                />
              ) : (
                /* ==========================================================
                   5. CATEGORY LIST
                ========================================================== */

                <FlatList
                  data={filteredCategories}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <CategoryCard
                      category={item}
                      deleting={deleteCategoryMutation.isPending}
                      onDelete={handleDelete}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    paddingTop: spacing.md,
                    paddingBottom: spacing["2xl"],
                  }}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: spacing.md,
                      }}
                    />
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={isFetching}
                      onRefresh={onRefresh}
                      tintColor={theme.icon.branding.icon}
                      colors={[theme.icon.branding.icon]}
                      progressBackgroundColor={theme.background.surface}
                    />
                  }
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
