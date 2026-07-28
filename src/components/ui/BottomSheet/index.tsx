import { ReactNode } from "react";

import { Modal, Pressable, ScrollView, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components/ui/AppText";

import { spacing, theme } from "@/theme";

interface BottomSheetProps {
  visible: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;

  /**
   * Shows the close icon in the header.
   * Defaults to true.
   */
  showCloseButton?: boolean;

  /**
   * Wraps children in a ScrollView.
   * Set to false when the child manages its own scrolling
   * (e.g. FlatList, FlashList, SectionList).
   *
   * Defaults to true.
   */
  scrollable?: boolean;
}

export function BottomSheet({
  visible,
  title,
  children,
  onClose,
  showCloseButton = true,
  scrollable = true,
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}

      <Pressable
        style={{
          flex: 1,
          backgroundColor: theme.overlay.background,
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        {/* Sheet */}

        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: theme.background.surface,

            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,

            maxHeight: "90%",
          }}
        >
          {/* Handle */}

          <View
            style={{
              alignItems: "center",
              paddingTop: spacing.sm,
            }}
          >
            <View
              style={{
                width: 48,
                height: 5,

                borderRadius: 99,

                backgroundColor: theme.divider.default,
              }}
            />
          </View>

          {/* Header */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",

              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <AppText variant="h3">{title}</AppText>

            {showCloseButton ? (
              <Pressable hitSlop={10} onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.text.primary} />
              </Pressable>
            ) : (
              // Keeps the title visually centered
              <View style={{ width: 24 }} />
            )}
          </View>

          {scrollable ? (
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.xl,
              }}
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.xl,
                maxHeight: "75%",
              }}
            >
              {children}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
