import { useState } from "react";

import { Alert, Pressable, View } from "react-native";

import * as DocumentPicker from "expo-document-picker";

import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";

import { spacing, radius, theme } from "@/theme";

import { ROUTES } from "@/navigation/routes";

import { useUploadDocument } from "@/hooks/kyc/useUploadDocument";
import { useCreateMerchantKyc } from "@/hooks/kyc/useCreateMerchantKyc";

import { useOnboardingStore } from "@/store/onboarding/onboardingStore";

import { getApiErrorMessage } from "@/api/errors";

import { useKycRequirements } from "@/hooks/kyc/useKycRequirements";

export default function DocumentUploadScreen() {
  const uploadDocument = useUploadDocument();

  const createMerchantKyc = useCreateMerchantKyc();

  const { merchantId, kycTierId, bvn, setUploadedDocument } =
    useOnboardingStore();

  const numericKycTierId = kycTierId ? Number(kycTierId) : null;

  const { requirements, isLoading: isLoadingRequirements } =
    useKycRequirements(numericKycTierId);

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/jpeg", "image/png"],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const file = result.assets[0];

    if (!file) {
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB

    if ((file.size ?? 0) > maxSize) {
      Alert.alert("File Too Large", "Maximum upload size is 5 MB.");

      return;
    }

    setSelectedFile(file);
  }

  async function handleContinue() {
    if (!merchantId || !kycTierId) {
      Alert.alert(
        "Missing Information",
        "Please complete the previous onboarding steps."
      );

      return;
    }

    if (isLoadingRequirements) {
      Alert.alert(
        "Please Wait",
        "We're loading the documents required for your verification tier."
      );

      return;
    }

    const requiredDocument = requirements.find(
      (requirement) => requirement.required
    );

    if (!requiredDocument) {
      Alert.alert(
        "Verification Requirement",
        "We couldn't determine the document required for this verification tier."
      );

      return;
    }

    if (!selectedFile) {
      Alert.alert(
        "Document Required",
        "Please upload your verification document."
      );

      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType ?? "application/octet-stream",
      } as any);

      const uploaded = await uploadDocument.mutateAsync(formData);

      if (!uploaded.data?.url) {
        throw new Error("The document upload did not return a document URL.");
      }

      setUploadedDocument(uploaded.data);

      await createMerchantKyc.mutateAsync({
        merchantId,

        kycTierId,

        documentType: requiredDocument.documentType,

        documentUrl: uploaded.data.url,

        bvn: bvn ?? "",
      });

      router.push(ROUTES.BIOMETRIC_VERIFICATION);
    } catch (error) {
      Alert.alert("Upload Failed", getApiErrorMessage(error));
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
        }}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing.sm,
          }}
        >
          <Link href={ROUTES.ID_VERIFICATION} asChild>
            <Pressable>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.icon.default.icon}
              />
            </Pressable>
          </Link>

          <View
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: theme.divider.default,
              marginHorizontal: spacing.sm,
            }}
          >
            <ProgressBar progress={83.33} />
          </View>

          <AppText variant="bodySmall" color="muted">
            Step 5 of 6
          </AppText>
        </View>

        <View
          style={{
            marginTop: spacing.lg,
            gap: spacing.xs,
          }}
        >
          <AppText variant="h1" color="heading">
            Upload verification document
          </AppText>

          <AppText variant="body" color="secondary">
            Upload a clear copy of your identity document.
          </AppText>

          {!isLoadingRequirements && requirements.length > 0 && (
            <AppText
              variant="bodySmall"
              color="secondary"
              style={{
                marginTop: spacing.xs,
              }}
            >
              Required document:{" "}
              {requirements
                .filter((requirement) => requirement.required)
                .map((requirement) => requirement.displayName)
                .join(", ")}
            </AppText>
          )}
        </View>

        <Card
          style={{
            marginTop: spacing.xl,

            gap: spacing.md,

            alignItems: "center",

            borderWidth: 2,

            borderStyle: "dashed",

            borderColor: selectedFile
              ? theme.state.success.border
              : theme.border.default,

            backgroundColor: selectedFile
              ? theme.state.success.background
              : theme.background.surface,
          }}
        >
          {selectedFile ? (
            <>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color={theme.icon.success.icon}
              />

              <AppText variant="bodyBold" align="center">
                {selectedFile.name}
              </AppText>

              <AppText variant="bodySmall" color="success" align="center">
                Ready to upload
              </AppText>
            </>
          ) : (
            <>
              <Ionicons
                name="document-outline"
                size={72}
                color={theme.icon.branding.icon}
              />

              <AppText variant="body" color="secondary" align="center">
                No document selected
              </AppText>
            </>
          )}

          <Button
            title={selectedFile ? "Choose Another Document" : "Choose Document"}
            variant="secondary"
            onPress={pickDocument}
          />

          <AppText variant="caption" color="muted" align="center">
            Accepted formats: PDF, JPG, PNG (Max 5 MB)
          </AppText>
        </Card>

        <View
          style={{
            flex: 1,
          }}
        />

        <View
          style={{
            paddingBottom: spacing.lg,
          }}
        >
          <Button
            title={
              isLoadingRequirements
                ? "Loading requirements..."
                : uploadDocument.isPending
                  ? "Uploading document..."
                  : createMerchantKyc.isPending
                    ? "Submitting..."
                    : "Continue"
            }
            variant="primary"
            size="large"
            disabled={
              !selectedFile ||
              isLoadingRequirements ||
              uploadDocument.isPending ||
              createMerchantKyc.isPending
            }
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
