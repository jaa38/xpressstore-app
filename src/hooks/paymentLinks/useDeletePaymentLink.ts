import { useMutation } from "@tanstack/react-query";

/**
 * ---------------------------------------------------------------------------
 * Delete Payment Link
 * ---------------------------------------------------------------------------
 *
 * The current Payment Pages backend documentation does not expose a
 * Delete Payment Page endpoint.
 *
 * Therefore this mutation must not make an undocumented API request.
 *
 * Deactivation should be used instead when the backend supports changing
 * the active state of a payment page.
 */
export function useDeletePaymentLink() {
  return useMutation({
    mutationFn: async (_paymentLinkId: number): Promise<void> => {
      throw new Error(
        "Deleting payment links is not currently supported by the Payment Pages API."
      );
    },
  });
}