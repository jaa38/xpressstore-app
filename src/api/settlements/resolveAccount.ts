import { apiClient } from "@/api/client";

/**
 * ============================================================================
 * TYPES
 * ============================================================================
 */

export type ResolveAccountPayload = {
  bankCode: string;
  accountNumber: string;
};

export type ResolveAccountResponse = {
  accountName: string;
  accountNumber: string;
};

/**
 * ============================================================================
 * RESOLVE ACCOUNT
 * ============================================================================
 */

export async function resolveAccount(
  payload: ResolveAccountPayload
): Promise<ResolveAccountResponse> {
  const response = await apiClient.post<ResolveAccountResponse>(
    "/settlements/resolve-account",
    payload
  );

  return response.data;
}
