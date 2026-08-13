import { useMutation } from "@tanstack/react-query";

/**
 * ---------------------------------------------------------------------------
 * Deactivate Payment Link
 * ---------------------------------------------------------------------------
 *
 * The Payment Pages API currently documents:
 *
 *   POST /PaymentPages/Update
 *
 * but does not document a dedicated deactivate/toggle endpoint.
 *
 * Although Payment Pages expose `isActive`, the supplied API documentation
 * does not explicitly state that `isActive` can be changed through the
 * Update Payment Page request.
 *
 * Therefore we must not construct an undocumented deactivate request here.
 */
export function useDeactivatePaymentLink() {
  return useMutation({
    mutationFn: async (_paymentLinkId: number): Promise<void> => {
      throw new Error(
        "Deactivating payment links is not currently supported by the documented Payment Pages API."
      );
    },
  });
}