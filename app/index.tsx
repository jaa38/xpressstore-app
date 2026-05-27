import { View, Text, StyleSheet } from "react-native";
import { APP_NAME } from "@/constants/test";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>XpressStore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 24,
    fontWeight: "700",
  },
});
