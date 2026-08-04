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

export default function DocumentUploadScreen() {
  const uploadDocument = useUploadDocument();

  const createMerchantKyc = useCreateMerchantKyc();

  const { merchantId, kycTierId, bvn, uploadedDocument, setUploadedDocument } =
    useOnboardingStore();

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    setSelectedFile(result.assets[0]);
  }

  async function handleContinue() {
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
      Alert.alert("Upload Failed", "Unable to upload your document.");
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
            padding: spacing.lg,
            gap: spacing.md,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="document-outline"
            size={72}
            color={theme.icon.branding.icon}
          />

          <AppText variant="body" align="center">
            {selectedFile ? selectedFile.name : "No document selected"}
          </AppText>

          <Button
            title="Choose Document"
            variant="secondary"
            onPress={pickDocument}
          />
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
              uploadDocument.isPending || createMerchantKyc.isPending
                ? "Uploading..."
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
