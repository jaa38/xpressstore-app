import { useEffect } from "react";
import { View, Image } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";

import { getAccessToken } from "@/storage/authStorage";
import { isOnboardingComplete } from "@/services/auth/storage";

import { theme } from "@/theme";
import { ROUTES } from "@/navigation/routes";

export default function IndexScreen() {
  const { isLoading, isAuthenticated } =
    useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      bootstrap();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  async function bootstrap() {
    const onboarded =
      await isOnboardingComplete();

    if (!onboarded) {
      router.replace(ROUTES.WELCOME);
      return;
    }

    /**
     * Check for a stored JWT.
     */
    const token =
      await getAccessToken();

    if (token) {
      router.replace(ROUTES.TABS);
      return;
    }

    router.replace(ROUTES.LOGIN);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          theme.background.primary,
      }}
    >
      <Image
        source={require("../assets/logo/xpressStoreLogo.png")}
        style={{
          width: 270,
          height: 270,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}

// import { useEffect } from "react";
// import { View, Image } from "react-native";
// import { router } from "expo-router";

// import { theme } from "@/theme";
// import { ROUTES } from "@/navigation/routes";

// export default function IndexScreen() {
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       router.replace(ROUTES.TABS);
//     }, 2000);

//     return () => clearTimeout(timeout);
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: theme.background.primary,
//       }}
//     >
//       <Image
//         source={require("../assets/logo/xpressStoreLogo.png")}
//         style={{
//           width: 270,
//           height: 270,
//           resizeMode: "contain",
//         }}
//       />
//     </View>
//   );
// }


// import { useEffect } from "react";
// import { View, Image } from "react-native";
// import { router } from "expo-router";

// import { useAuth } from "@/providers/AuthProvider";

// import { getAccessToken } from "@/storage/authStorage";
// import { isOnboardingComplete } from "@/services/auth/storage";

// import { bootstrapDevAuth } from "@/services/auth/devAuth";

// import { theme } from "@/theme";
// import { ROUTES } from "@/navigation/routes";

// export default function IndexScreen() {
//   const { isLoading } = useAuth();

//   useEffect(() => {
//     if (isLoading) {
//       return;
//     }

//     bootstrap();
//   }, [isLoading]);

//   async function bootstrap() {
//     /**
//      * DEVELOPMENT ONLY
//      *
//      * Stores the backend-provided JWT in SecureStore.
//      */
//     await bootstrapDevAuth();

//     const onboarded = await isOnboardingComplete();

//     if (!onboarded) {
//       router.replace(ROUTES.WELCOME);
//       return;
//     }

//     const token = await getAccessToken();

//     if (token) {
//       router.replace(ROUTES.TABS);
//       return;
//     }

//     router.replace(ROUTES.LOGIN);
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: theme.background.primary,
//       }}
//     >
//       <Image
//         source={require("../assets/logo/xpressStoreLogo.png")}
//         style={{
//           width: 270,
//           height: 270,
//           resizeMode: "contain",
//         }}
//       />
//     </View>
//   );
// }