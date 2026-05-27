import {
  StyleSheet,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { theme } from "@/theme";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <AppText variant="h2">
        Product {id}
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