import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "@/components/ui/AppText";

import { supabase } from "@/services/supabase/client";

import {
  radius,
  spacing,
  theme,
} from "@/theme";

export default function TestSupabaseScreen() {
  async function testConnection() {
    const { data, error } =
      await supabase.auth.getSession();

    console.log("DATA:", data);

    console.log("ERROR:", error);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={testConnection}
      >
        <AppText
          variant="buttonLarge"
          color="inverse"
        >
          Test Supabase
        </AppText>
      </Pressable>
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

  button: {
    height: 56,

    paddingHorizontal: spacing.lg,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: radius.lg,

    backgroundColor:
      theme.action.primary.background,
  },
});