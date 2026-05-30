import { View } from "react-native";

import { theme } from "@/theme";

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({
  progress,
}: ProgressBarProps) {
  return (
    <View
      style={{
        flex: 1,

        height: 8,

        backgroundColor:
          theme.divider.default,

        borderRadius: 999,

        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${progress}%`,

          height: "100%",

          backgroundColor:
            theme.action.primary
              .background,

          borderRadius: 999,
        }}
      />
    </View>
  );
}