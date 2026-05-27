import {
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "@/components/ui/AppText";
import { theme } from "@/theme";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="h2">
        Orders
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      theme.background.primary,
  },
});