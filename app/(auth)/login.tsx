import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { router } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { loginUser } from "@/features/auth/api/auth-api";

import { useAuthStore } from "@/features/auth/store/auth-store";

import { LoginSchema, loginSchema } from "@/features/auth/schemas/login-schema";

import { radius, spacing, theme } from "@/theme";

import { AppText } from "@/components/ui/AppText";
import { ROUTES } from "@/navigation/routes";
import { Link } from "expo-router";

export default function LoginScreen() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setUser = useAuthStore((state) => state.setUser);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    const response = await loginUser(data.email, data.password);

    if (response.error) {
      console.log(response.error);
      return;
    }

    if (response.data.user) {
      setAuthenticated(true);

      setUser(response.data.user);

      router.replace("/");
    }
  }

  return (
    <View style={styles.container}>
      <AppText variant="h1">Login</AppText>

      {/* EMAIL */}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Email"
            style={styles.input}
            autoCapitalize="none"
          />
        )}
      />

      {errors.email && <AppText color="error">Invalid email</AppText>}

      {/* PASSWORD */}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />
        )}
      />

      {errors.password && <AppText color="error">Password too short</AppText>}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <AppText variant="buttonLarge" color="inverse">
          Login
        </AppText>
      </Pressable>

      <Link href={ROUTES.SIGNUP} asChild>
        <Pressable>
          <AppText variant="label" color="link">
            Sign Up
          </AppText>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    paddingHorizontal: spacing.lg,

    gap: spacing.md,

    backgroundColor: theme.background.primary,
  },

  input: {
    height: 56,

    borderWidth: 1,

    borderColor: theme.input.border,

    borderRadius: radius.lg,

    paddingHorizontal: spacing.md,

    backgroundColor: theme.input.background,
  },

  button: {
    height: 56,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: radius.lg,

    backgroundColor: theme.action.primary.background,
  },
});
