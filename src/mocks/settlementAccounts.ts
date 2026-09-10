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
   * UPDATE EXISTING ACCOUNT
   * --------------------------------------------------------------------------
   */

  if (payload.settlementAccountId !== undefined) {
    const existingAccount = mockSettlementAccounts.find(
      (account) =>
        String(account.settlementAccountId) ===
        String(payload.settlementAccountId)
    );

    if (!existingAccount) {
      throw new Error("Settlement account not found.");
    }

    /**
     * ------------------------------------------------------------------------
     * PRIMARY LOGIC
     * ------------------------------------------------------------------------
     */

    const shouldBePrimary = payload.isPrimary ?? existingAccount.isDefault;

    if (shouldBePrimary) {
      mockSettlementAccounts = mockSettlementAccounts.map((account) => ({
        ...account,

        isDefault:
          String(account.settlementAccountId) ===
          String(payload.settlementAccountId),
      }));
    }

    mockSettlementAccounts = mockSettlementAccounts.map((account) => {
      if (
        String(account.settlementAccountId) !==
        String(payload.settlementAccountId)
      ) {
        return account;
      }

      return {
        settlementAccountId: account.settlementAccountId,

        accountNumber: payload.accountNumber,

        accountName: payload.accountName,

        bankName: payload.bankName,

        bankCode: payload.bankCode,

        isDefault: shouldBePrimary,
      };
    });

    return {
      responseCode: "00",

      responseMessage: "Settlement account updated successfully",

      data: undefined,
    };
  }

  /**
   * --------------------------------------------------------------------------
   * CREATE NEW ACCOUNT
   * --------------------------------------------------------------------------
   */

  const shouldBePrimary =
    payload.isPrimary ?? mockSettlementAccounts.length === 0;

  /**
   * --------------------------------------------------------------------------
   * ENSURE ONLY ONE PRIMARY ACCOUNT
   * --------------------------------------------------------------------------
   */

  if (shouldBePrimary) {
    mockSettlementAccounts = mockSettlementAccounts.map((account) => ({
      ...account,

      isDefault: false,
    }));
  }

  const settlementAccount: SettlementAccount = {
    settlementAccountId: Date.now().toString(),

    accountNumber: payload.accountNumber,

    accountName: payload.accountName,

    bankName: payload.bankName,

    bankCode: payload.bankCode,

    isDefault: shouldBePrimary,
  };

  mockSettlementAccounts = [...mockSettlementAccounts, settlementAccount];

  return {
    responseCode: "00",

    responseMessage: "Settlement account added successfully",

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
  const deletedAccount = mockSettlementAccounts.find(
    (account) => String(account.settlementAccountId) === String(settlementId)
  );

  mockSettlementAccounts = mockSettlementAccounts.filter(
    (account) => String(account.settlementAccountId) !== String(settlementId)
  );

  /**
   * --------------------------------------------------------------------------
   * ENSURE A PRIMARY ACCOUNT EXISTS
   * --------------------------------------------------------------------------
   */

  if (deletedAccount?.isDefault && mockSettlementAccounts.length > 0) {
    mockSettlementAccounts = mockSettlementAccounts.map((account, index) => ({
      ...account,

      isDefault: index === 0,
    }));
  }

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
