import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { router, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useEffect, useState } from "react";

import { ScreenHeader } from "@/components/common/ScreenHeader";
import { AppText } from "@/components/ui/AppText";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { useDiscounts } from "@/hooks/discounts/useDiscounts";
import { useUpdateDiscount } from "@/hooks/discounts/useUpdateDiscount";
import { useToast } from "@/hooks/useToast";

import { spacing, theme } from "@/theme";

export default function EditDiscountCodeScreen() {
  /**
   * ==========================================================================
   * ROUTE PARAMS
   * ==========================================================================
   */

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  /**
   * ==========================================================================
   * DISCOUNTS
   * ==========================================================================
   */

  const { data: discounts, isLoading, isError } = useDiscounts();

  const discount = discounts.find((item) => item.id === id);

  /**
   * ==========================================================================
   * STATE
   * ==========================================================================
   */

  const [code, setCode] = useState("");

  const [discountValue, setDiscountValue] = useState("");

  const [numberOfTimes, setNumberOfTimes] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [limitCodeToOneCustomer, setLimitCodeToOneCustomer] = useState(false);

  /**
   * ==========================================================================
   * VALIDATION STATE
   * ==========================================================================
   */

  const [codeError, setCodeError] = useState("");

  const [discountValueError, setDiscountValueError] = useState("");

  const [numberOfTimesError, setNumberOfTimesError] = useState("");

  const [startDateError, setStartDateError] = useState("");

  const [endDateError, setEndDateError] = useState("");

  /**
   * ==========================================================================
   * MUTATION
   * ==========================================================================
   */

  const updateDiscountMutation = useUpdateDiscount();

  /**
   * ==========================================================================
   * TOAST
   * ==========================================================================
   */

  const { showToast } = useToast();

  /**
   * ==========================================================================
   * INITIALISE FORM
   * ==========================================================================
   */

  useEffect(() => {
    if (!discount) {
      return;
    }

    setCode(discount.code);

    setDiscountValue(String(discount.discountValue));

    setNumberOfTimes(
      discount.numberOfTimes !== undefined ? String(discount.numberOfTimes) : ""
    );

    setStartDate(discount.startDate ?? "");

    setEndDate(discount.endDate ?? "");

    setLimitCodeToOneCustomer(discount.limitCodeToOneCustomer ?? false);
  }, [discount]);

  /**
   * ==========================================================================
   * VALIDATION
   * ==========================================================================
   */

  function validate(): boolean {
    let isValid = true;

    const trimmedCode = code.trim();

    const trimmedDiscountValue = discountValue.trim();

    const trimmedNumberOfTimes = numberOfTimes.trim();

    const trimmedStartDate = startDate.trim();

    const trimmedEndDate = endDate.trim();

    /**
     * ------------------------------------------------------------------------
     * RESET ERRORS
     * ------------------------------------------------------------------------
     */

    setCodeError("");
    setDiscountValueError("");
    setNumberOfTimesError("");
    setStartDateError("");
    setEndDateError("");

    /**
     * ------------------------------------------------------------------------
     * DISCOUNT CODE
     * ------------------------------------------------------------------------
     */

    if (!trimmedCode) {
      setCodeError("Discount code is required.");
      isValid = false;
    }

    /**
     * ------------------------------------------------------------------------
     * DISCOUNT VALUE
     * ------------------------------------------------------------------------
     */

    if (!trimmedDiscountValue) {
      setDiscountValueError("Discount value is required.");
      isValid = false;
    } else {
      const value = Number(trimmedDiscountValue);

      if (!Number.isFinite(value)) {
        setDiscountValueError("Enter a valid discount value.");
        isValid = false;
      } else if (value <= 0) {
        setDiscountValueError("Discount value must be greater than 0.");
        isValid = false;
      }
    }

    /**
     * ------------------------------------------------------------------------
     * NUMBER OF USES
     * ------------------------------------------------------------------------
     */

    if (trimmedNumberOfTimes) {
      const value = Number(trimmedNumberOfTimes);

      if (!Number.isInteger(value) || value <= 0) {
        setNumberOfTimesError(
          "Number of uses must be a positive whole number."
        );

        isValid = false;
      }
    }

    /**
     * ------------------------------------------------------------------------
     * START DATE
     * ------------------------------------------------------------------------
     */

    if (trimmedStartDate && Number.isNaN(Date.parse(trimmedStartDate))) {
      setStartDateError("Enter a valid start date.");
      isValid = false;
    }

    /**
     * ------------------------------------------------------------------------
     * END DATE
     * ------------------------------------------------------------------------
     */

    if (trimmedEndDate && Number.isNaN(Date.parse(trimmedEndDate))) {
      setEndDateError("Enter a valid end date.");
      isValid = false;
    }

    /**
     * ------------------------------------------------------------------------
     * DATE RELATIONSHIP
     * ------------------------------------------------------------------------
     */

    if (
      trimmedStartDate &&
      trimmedEndDate &&
      !Number.isNaN(Date.parse(trimmedStartDate)) &&
      !Number.isNaN(Date.parse(trimmedEndDate))
    ) {
      const start = new Date(trimmedStartDate).getTime();

      const end = new Date(trimmedEndDate).getTime();

      if (end < start) {
        setEndDateError("End date cannot be before the start date.");

        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * ==========================================================================
   * UPDATE DISCOUNT
   * ==========================================================================
   */

  async function handleUpdateDiscount() {
    if (!discount) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      const trimmedCode = code.trim().toUpperCase();

      const trimmedDiscountValue = discountValue.trim();

      const trimmedNumberOfTimes = numberOfTimes.trim();

      const trimmedStartDate = startDate.trim();

      const trimmedEndDate = endDate.trim();

      await updateDiscountMutation.mutateAsync({
        id: discount.id,

        code: trimmedCode,

        discountValue: Number(trimmedDiscountValue),

        ...(trimmedNumberOfTimes && {
          numberOfTimes: Number(trimmedNumberOfTimes),
        }),

        ...(trimmedStartDate && {
          startDate: trimmedStartDate,
        }),

        ...(trimmedEndDate && {
          endDate: trimmedEndDate,
        }),

        limitCodeToOneCustomer,
      });

      showToast({
        type: "success",
        title: "Discount Updated",
        message: `${trimmedCode} has been updated.`,
      });

      router.back();
    } catch (error) {
      console.log("UPDATE DISCOUNT ERROR", error);

      showToast({
        type: "error",
        title: "Unable to Update Discount",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
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
          <AppText variant="body" color="secondary">
            Loading discount...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * ==========================================================================
   * NOT FOUND
   * ==========================================================================
   */

  if (isError || !discount) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background.primary,
        }}
        edges={["top"]}
      >
        <StatusBar style="auto" />

        <ScreenHeader title="Edit Discount Code" />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          <Ionicons
            name="pricetag-outline"
            size={48}
            color={theme.icon.default.icon}
          />

          <AppText
            variant="bodyLargeBold"
            color="strong"
            style={{
              marginTop: spacing.md,
            }}
          >
            Discount not found
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              marginTop: spacing.xs,
              textAlign: "center",
            }}
          >
            This discount code may have been deleted or is no longer available.
          </AppText>
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
      edges={["top"]}
    >
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenHeader title="Edit Discount Code" />

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
              alignItems: "flex-start",
              marginBottom: spacing.lg,
            }}
          >
            <AppText
              variant="body"
              color="secondary"
              style={{
                marginTop: spacing.xs,
                textAlign: "left",
                maxWidth: 320,
              }}
            >
              Update the details of this promotional discount code.
            </AppText>
          </View>

          {/* ==================================================================
              DISCOUNT INFORMATION
          ================================================================== */}

          <View
            style={{
              gap: spacing.lg,
            }}
          >
            {/* DISCOUNT CODE */}

            <Input
              label="Discount Code"
              required
              placeholder="e.g. WELCOME10"
              value={code}
              error={codeError}
              onChangeText={(value) => {
                setCode(value.toUpperCase());

                if (codeError) {
                  setCodeError("");
                }
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="next"
              editable={!updateDiscountMutation.isPending}
            />

            {/* DISCOUNT VALUE */}

            <Input
              label="Discount Value"
              required
              placeholder="e.g. 10"
              value={discountValue}
              error={discountValueError}
              onChangeText={(value) => {
                setDiscountValue(value);

                if (discountValueError) {
                  setDiscountValueError("");
                }
              }}
              keyboardType="decimal-pad"
              returnKeyType="next"
              editable={!updateDiscountMutation.isPending}
            />

            {/* NUMBER OF USES */}

            <Input
              label="Number of Uses"
              optional
              placeholder="e.g. 100"
              value={numberOfTimes}
              error={numberOfTimesError}
              onChangeText={(value) => {
                setNumberOfTimes(value);

                if (numberOfTimesError) {
                  setNumberOfTimesError("");
                }
              }}
              keyboardType="number-pad"
              returnKeyType="next"
              editable={!updateDiscountMutation.isPending}
            />
          </View>

          {/* ==================================================================
              VALIDITY
          ================================================================== */}

          <View
            style={{
              marginTop: spacing.xl,
              gap: spacing.lg,
            }}
          >
            <AppText variant="h2" color="strong">
              Validity
            </AppText>

            <Input
              label="Start Date"
              optional
              placeholder="e.g. 2026-01-01"
              value={startDate}
              error={startDateError}
              onChangeText={(value) => {
                setStartDate(value);

                if (startDateError) {
                  setStartDateError("");
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              editable={!updateDiscountMutation.isPending}
            />

            <Input
              label="End Date"
              optional
              placeholder="e.g. 2026-12-31"
              value={endDate}
              error={endDateError}
              onChangeText={(value) => {
                setEndDate(value);

                if (endDateError) {
                  setEndDateError("");
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              editable={!updateDiscountMutation.isPending}
            />
          </View>

          {/* ==================================================================
              CUSTOMER LIMIT
          ================================================================== */}

          <View
            style={{
              marginTop: spacing.xl,
            }}
          >
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: limitCodeToOneCustomer,
                disabled: updateDiscountMutation.isPending,
              }}
              onPress={() => {
                if (!updateDiscountMutation.isPending) {
                  setLimitCodeToOneCustomer((value) => !value);
                }
              }}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: limitCodeToOneCustomer
                    ? theme.action.primary.background
                    : theme.border.default,
                  backgroundColor: limitCodeToOneCustomer
                    ? theme.action.primary.background
                    : theme.background.surface,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {limitCodeToOneCustomer && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={theme.action.primary.text}
                  />
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  gap: spacing.xs,
                }}
              >
                <AppText variant="bodyBold">Limit code to one customer</AppText>

                <AppText variant="bodySmall" color="secondary">
                  Each customer can use this discount code only once.
                </AppText>
              </View>
            </Pressable>
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
              Updating a discount does not change its active or inactive status.
            </AppText>
          </View>

          {/* ==================================================================
              UPDATE BUTTON
          ================================================================== */}

          <Button
            title="Save Changes"
            variant="primary"
            leftIcon={
              <Ionicons
                name="checkmark"
                size={20}
                color={theme.action.primary.text}
              />
            }
            loading={updateDiscountMutation.isPending}
            disabled={
              !code.trim() ||
              !discountValue.trim() ||
              updateDiscountMutation.isPending
            }
            style={{
              marginTop: spacing.xl,
            }}
            onPress={handleUpdateDiscount}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
