import {
  SettlementAccount,
  UpdateSettlementAccountRequest,
  ValidateSettlementAccountRequest,
  ValidateSettlementAccountResponse,
} from "@/types/merchant";

import { ApiResponse } from "@/types/api";

/**
 * ============================================================================
 * SETTLEMENT ACCOUNT MOCK DATA
 * ============================================================================
 */

/**
 * ---------------------------------------------------------------------------
 * IN-MEMORY DATABASE
 * ---------------------------------------------------------------------------
 */

let mockSettlementAccounts: SettlementAccount[] = [];

/**
 * ============================================================================
 * MOCK BANK ACCOUNTS
 * ============================================================================
 *
 * These simulate successful bank account verification.
 *
 * In a real application this would be handled by the API.
 */

const MOCK_ACCOUNT_NAMES: Record<string, string> = {
  "0000000000": "Jeremiah Akinsowon",

  "1234567890": "John Doe",

  "2222222222": "Mock Merchant",
};

/**
 * ============================================================================
 * GET SETTLEMENT ACCOUNTS
 * ============================================================================
 */

export function getMockSettlementAccounts(): ApiResponse<SettlementAccount[]> {
  return {
    responseCode: "00",

    responseMessage: "Settlement accounts retrieved successfully",

    data: mockSettlementAccounts,
  };
}

/**
 * ============================================================================
 * VALIDATE SETTLEMENT ACCOUNT
 * ============================================================================
 */

export function validateMockSettlementAccount(
  payload: ValidateSettlementAccountRequest
): ApiResponse<ValidateSettlementAccountResponse> {
  const accountName =
    MOCK_ACCOUNT_NAMES[payload.accountNumber] ?? "Mock Account Holder";

  return {
    responseCode: "00",

    responseMessage: "Account verified successfully",

    data: {
      accountNumber: payload.accountNumber,

      accountName,

      bankCode: payload.bankCode,

      /**
       * The actual bank name is normally returned by the API.
       *
       * The settlement screen already knows the selected bank,
       * so this value only needs to satisfy the response contract.
       */

      bankName: "Access Bank",
    },
  };
}

/**
 * ============================================================================
 * UPDATE SETTLEMENT ACCOUNT
 * ============================================================================
 */

export function updateMockSettlementAccount(
  payload: UpdateSettlementAccountRequest
): ApiResponse<void> {
  /**
   * --------------------------------------------------------------------------
   * CREATE SETTLEMENT ACCOUNT
   * --------------------------------------------------------------------------
   */

  const settlementAccount: SettlementAccount = {
    settlementAccountId: Date.now().toString(),

    accountNumber: payload.accountNumber,

    accountName: payload.accountName,

    bankName: payload.bankName,

    bankCode: payload.bankCode,

    /**
     * API request: isPrimary
     * Response model: isDefault
     */

    isDefault: payload.isPrimary ?? true,
  };

  /**
   * --------------------------------------------------------------------------
   * STORE ACCOUNT
   * --------------------------------------------------------------------------
   */

  mockSettlementAccounts = [settlementAccount];

  return {
    responseCode: "00",

    responseMessage: "Settlement account updated successfully",

    data: undefined,
  };
}

/**
 * ============================================================================
 * DELETE SETTLEMENT ACCOUNT
 * ============================================================================
 */

export function deleteMockSettlementAccount(
  settlementId: string | number
): ApiResponse<void> {
  mockSettlementAccounts = mockSettlementAccounts.filter(
    (account) => String(account.settlementAccountId) !== String(settlementId)
  );

  return {
    responseCode: "00",

    responseMessage: "Settlement account deleted successfully",

    data: undefined,
  };
}

/**
 * ============================================================================
 * RESET MOCK SETTLEMENT ACCOUNTS
 * ============================================================================
 */

export function resetMockSettlementAccounts() {
  mockSettlementAccounts = [];
}