import { useQuery } from "@tanstack/react-query";

import { paymentLinkService } from "@/services/payment-links/paymentLinkService";

import { queryKeys } from "@/lib/queryKeys";

export function usePaymentLinks() {
  console.log("USE PAYMENT LINKS HOOK");

  return useQuery({
    queryKey: queryKeys.paymentLinks,

    queryFn: async () => {
      console.log("PAYMENT LINKS QUERY START");

      try {
        const response =
          await paymentLinkService.getPaymentLinks();

        console.log(
          "PAYMENT LINKS API RESPONSE",
          JSON.stringify(response, null, 2)
        );

        return response.data;
      } catch (error: any) {
        console.log(
          "================================="
        );

        console.log(
          "PAYMENT LINKS API ERROR"
        );

        console.log(
          "MESSAGE:",
          error?.message
        );

        console.log(
          "STATUS:",
          error?.response?.status
        );

        console.log(
          "STATUS TEXT:",
          error?.response?.statusText
        );

        console.log(
          "RESPONSE DATA:",
          JSON.stringify(
            error?.response?.data,
            null,
            2
          )
        );

        console.log(
          "REQUEST URL:",
          error?.config?.url
        );

        console.log(
          "BASE URL:",
          error?.config?.baseURL
        );

        console.log(
          "================================="
        );

        throw error;
      }
    },

    retry: false,
  });
}