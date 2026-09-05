import { useMutation } from "@tanstack/react-query";

import {
  resolveAccount,
  ResolveAccountPayload,
} from "@/api/settlements/resolveAccount";

/**
 * ============================================================================
 * RESOLVE ACCOUNT HOOK
 * ============================================================================
 */

export function useResolveAccount() {
  return useMutation({
    mutationFn: (payload: ResolveAccountPayload) => resolveAccount(payload),
  });
}
