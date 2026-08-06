import { useMutation } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

export function useValidatePaymentLinkReference() {
  return useMutation({
    mutationFn: paymentLinkService.validatePaymentLinkReference,
  });
}