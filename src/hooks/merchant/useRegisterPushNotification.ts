import { useMutation } from "@tanstack/react-query";

import { merchantService } from "@/services/merchant/merchantService";

export function useRegisterPushNotification() {
  return useMutation({
    mutationFn: merchantService.registerPushNotification,
  });
}