import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { Link } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { radius, spacing, theme } from "@/theme";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="displayLarge">
          Welcome Back
        </AppText>

        <AppText
          variant="body"
          color="secondary"
          style={styles.subtitle}
        >
          Sign in to continue managing your store.
        </AppText>

        <Pressable style={styles.button}>
          <AppText
            variant="buttonLarge"
            color="inverse"
          >
            Login
          </AppText>
        </Pressable>

        <View style={styles.footer}>
          <AppText color="muted">
            Don&apos;t have an account?
          </AppText>

          <Link href="/signup" asChild>
            <Pressable>
              <AppText
                color="link"
                variant="label"
              >
                Sign Up
              </AppText>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },

  content: {
    gap: spacing.md,
  },

  subtitle: {
    marginTop: -spacing.sm,
  },

  button: {
    height: 56,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: radius.lg,

    backgroundColor:
      theme.action.primary.background,

    marginTop: spacing.md,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: spacing.xs,

    marginTop: spacing.lg,
  },
});