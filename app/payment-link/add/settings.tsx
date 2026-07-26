import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentLinkSettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Payment Link Settings</Text>
      </View>
    </SafeAreaView>
  );
}