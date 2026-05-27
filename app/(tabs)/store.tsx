import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { theme } from "@/theme";

export default function StoreScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="h2">
        Store
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: theme.background.primary,
  },
});