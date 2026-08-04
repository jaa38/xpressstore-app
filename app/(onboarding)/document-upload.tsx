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

export default function DocumentUploadScreen() {
  const uploadDocument = useUploadDocument();

  const createMerchantKyc = useCreateMerchantKyc();

  const { merchantId, kycTierId, bvn, uploadedDocument, setUploadedDocument } =
    useOnboardingStore();

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  async function pickDocument() {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ],
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
    Alert.alert(
      "File Too Large",
      "Maximum upload size is 5 MB."
    );

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

      setUploadedDocument(uploaded.data);

      await createMerchantKyc.mutateAsync({
        merchantId: merchantId ?? "",

        kycTierId: kycTierId ?? "",

        documentType: "BVN",

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
            <ProgressBar progress={90} />
          </View>

          <AppText variant="bodySmall" color="muted">
            Step 4 of 5
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
          <Ionicons
            name="document-outline"
            size={72}
            color={theme.icon.branding.icon}
          />

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
              uploadDocument.isPending
                ? "Uploading document..."
                : createMerchantKyc.isPending
                  ? "Submitting..."
                  : "Continue"
            }
            variant="primary"
            size="large"
            disabled={
              !selectedFile ||
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
