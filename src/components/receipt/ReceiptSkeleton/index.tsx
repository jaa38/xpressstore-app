import {
  View,
  type DimensionValue,
} from "react-native";

import { Card } from "@/components/ui/Card";

import { radius, spacing, theme } from "@/theme";

export function ReceiptSkeleton() {
  function Skeleton({
    width,
    height,
  }: {
    width: DimensionValue;
    height: number;
  }) {
    return (
      <View
        style={{
          width,
          height,

          borderRadius: radius.md,

          backgroundColor:
            theme.background.subtle,
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* Header */}

      <View
        style={{
          alignItems: "center",
          paddingHorizontal: spacing.lg,
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,

            borderRadius: 999,

            backgroundColor:
              theme.background.subtle,
          }}
        />

        <View
          style={{
            marginTop: spacing.lg,
          }}
        >
          <Skeleton
            width={180}
            height={34}
          />
        </View>

        <View
          style={{
            marginTop: spacing.md,
          }}
        >
          <Skeleton
            width={140}
            height={18}
          />
        </View>

        <View
          style={{
            marginTop: spacing.sm,
          }}
        >
          <Skeleton
            width={120}
            height={16}
          />
        </View>
      </View>

      {/* Metadata */}

      <Card
        style={{
          marginHorizontal: spacing.lg,
          marginTop: spacing.xl,
        }}
      >
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",

                marginBottom:
                  index === 4
                    ? 0
                    : spacing.lg,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,

                  borderRadius: 999,

                  backgroundColor:
                    theme.background.subtle,
                }}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: spacing.md,
                }}
              >
                <Skeleton
                  width={90}
                  height={12}
                />

                <View
                  style={{
                    marginTop: spacing.sm,
                  }}
                >
                  <Skeleton
                    width="70%"
                    height={18}
                  />
                </View>
              </View>
            </View>
          )
        )}
      </Card>

      {/* PDF Preview */}

      <View
        style={{
          flex: 1,

          margin: spacing.lg,

          borderRadius: radius.lg,

          backgroundColor:
            theme.background.subtle,
        }}
      />
    </View>
  );
}