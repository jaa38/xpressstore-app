import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { ScreenHeader } from "@/components/common/ScreenHeader";
import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { useCreateCategory } from "@/hooks/categories/useCreateCategory";
import { useToast } from "@/hooks/useToast";

import { spacing, theme } from "@/theme";

import { useState } from "react";

export default function AddCategoryScreen() {
  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [nameError, setNameError] = useState("");

  /**
   * ==========================================================================
   * MUTATION
   * ==========================================================================
   */

  const createCategoryMutation = useCreateCategory();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * VALIDATION
   * ==========================================================================
   */

  function validate(): boolean {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Category name is required.");
      return false;
    }

    setNameError("");

    return true;
  }

  /**
   * ==========================================================================
   * CREATE CATEGORY
   * ==========================================================================
   */

  async function handleCreateCategory() {
    if (!validate()) {
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      showToast({
        type: "success",
        title: "Category Created",
        message: `${name.trim()} has been added.`,
      });

      router.back();
    } catch (error) {
      console.log("CREATE CATEGORY ERROR", error);

      showToast({
        type: "error",
        title: "Unable to Create Category",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
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
      edges={["top"]}
    >
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader
          title="Add Category"
          subtitle="Create a category for your products."
        />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: spacing["2xl"],
          }}
        >
          {/* ==================================================================
              INTRODUCTION
          ================================================================== */}

          <View
            style={{
              alignItems: "center",
              marginBottom: spacing.xl,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
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
              variant="h3"
              style={{
                marginTop: spacing.md,
                textAlign: "center",
              }}
            >
              Create a Category
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
              Add a category to help organise your products and make them easier
              for customers to browse.
            </AppText>
          </View>

          {/* ==================================================================
              CATEGORY INFORMATION
          ================================================================== */}

          <View
            style={{
              gap: spacing.lg,
            }}
          >
            <Input
              label="Category Name"
              required
              placeholder="e.g. Travel Bags"
              value={name}
              error={nameError}
              onChangeText={(value) => {
                setName(value);

                if (nameError) {
                  setNameError("");
                }
              }}
              autoCapitalize="words"
              returnKeyType="next"
              editable={!createCategoryMutation.isPending}
            />

            <Input
              label="Description"
              optional
              variant="textarea"
              placeholder="Describe what products belong in this category."
              value={description}
              maxLength={250}
              onChangeText={setDescription}
              editable={!createCategoryMutation.isPending}
            />
          </View>

          {/* ==================================================================
              SUPPORTING INFORMATION
          ================================================================== */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: spacing.sm,
              marginTop: spacing.lg,
              padding: spacing.md,
              borderRadius: 12,
              backgroundColor: theme.background.subtle,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.icon.default.icon}
            />

            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                flex: 1,
              }}
            >
              Categories can be assigned to products when creating or editing
              them.
            </AppText>
          </View>

          {/* ==================================================================
              CREATE BUTTON
          ================================================================== */}

          <Button
            title="Create Category"
            variant="primary"
            leftIcon={
              <Ionicons
                name="add"
                size={20}
                color={theme.action.primary.text}
              />
            }
            loading={createCategoryMutation.isPending}
            disabled={!name.trim() || createCategoryMutation.isPending}
            style={{
              marginTop: spacing.xl,
            }}
            onPress={handleCreateCategory}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
