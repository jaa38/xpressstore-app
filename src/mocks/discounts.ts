import type {
  CreateDiscountRequest,
  Discount,
  UpdateDiscountRequest,
} from "@/types/discount";

/**
 * ============================================================================
 * MOCK DISCOUNTS
 * ============================================================================
 *
 * Mirrors the XpressPay Discount API contract.
 *
 * API:
 * GET  /Product/GetAllMerchantDiscounts
 * POST /Product/CreateDiscount
 * POST /Product/UpdateDiscount
 * ============================================================================
 */

export const MOCK_DISCOUNTS: Discount[] = [
  {
    id: "disc-001",
    code: "WELCOME10",
    discountValue: 10,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z",
    isActive: true,
    numberOfTimes: 100,
    limitCodeToOneCustomer: true,
  },

  {
    id: "disc-002",
    code: "SUMMER20",
    discountValue: 20,
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2026-09-30T23:59:59.999Z",
    isActive: true,
    numberOfTimes: 50,
    limitCodeToOneCustomer: false,
  },

  {
    id: "disc-003",
    code: "SAVE500",
    discountValue: 500,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.999Z",
    isActive: false,
    numberOfTimes: 25,
    limitCodeToOneCustomer: true,
  },

  {
    id: "disc-004",
    code: "NEWYEAR15",
    discountValue: 15,
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-02-28T23:59:59.999Z",
    isActive: false,
    numberOfTimes: 75,
    limitCodeToOneCustomer: false,
  },
];

/**
 * ============================================================================
 * IN-MEMORY STATE
 * ============================================================================
 *
 * This is the source of truth while USE_MOCK_DISCOUNTS is enabled.
 * ============================================================================
 */

let mockDiscounts: Discount[] = MOCK_DISCOUNTS.map((discount) => ({
  ...discount,
}));

/**
 * ============================================================================
 * GET ALL DISCOUNTS
 * ============================================================================
 */

export function getMockDiscounts(): Discount[] {
  return mockDiscounts.map((discount) => ({
    ...discount,
  }));
}

/**
 * ============================================================================
 * GET DISCOUNT BY ID
 * ============================================================================
 */

export function getMockDiscountById(discountId: string): Discount | undefined {
  const discount = mockDiscounts.find((item) => item.id === discountId);

  if (!discount) {
    return undefined;
  }

  return {
    ...discount,
  };
}

/**
 * ============================================================================
 * CREATE DISCOUNT
 * ============================================================================
 */

export function createMockDiscount(payload: CreateDiscountRequest): Discount {
  const normalizedCode = payload.code.trim().toUpperCase();

  if (!normalizedCode) {
    throw new Error("Discount code is required.");
  }

  const duplicate = mockDiscounts.find(
    (discount) => discount.code.trim().toUpperCase() === normalizedCode
  );

  if (duplicate) {
    throw new Error("A discount with this code already exists.");
  }

  const nextIdNumber =
    mockDiscounts.reduce((highest, discount) => {
      const match = discount.id.match(/^disc-(\d+)$/);

      if (!match) {
        return highest;
      }

      return Math.max(highest, Number(match[1]));
    }, 0) + 1;

  const newDiscount: Discount = {
    id: `disc-${String(nextIdNumber).padStart(3, "0")}`,

    code: normalizedCode,

    discountValue: payload.discountValue,

    ...(payload.numberOfTimes !== undefined && {
      numberOfTimes: payload.numberOfTimes,
    }),

    ...(payload.startDate !== undefined && {
      startDate: payload.startDate,
    }),

    ...(payload.endDate !== undefined && {
      endDate: payload.endDate,
    }),

    ...(payload.limitCodeToOneCustomer !== undefined && {
      limitCodeToOneCustomer: payload.limitCodeToOneCustomer,
    }),

    isActive: true,
  };

  mockDiscounts = [newDiscount, ...mockDiscounts];

  return {
    ...newDiscount,
  };
}

/**
 * ============================================================================
 * UPDATE DISCOUNT
 * ============================================================================
 *
 * Mirrors:
 * POST /Product/UpdateDiscount
 * ============================================================================
 */

export function updateMockDiscount(
  payload: UpdateDiscountRequest
): Discount | undefined {
  const discountId = payload.id;

  const index = mockDiscounts.findIndex(
    (discount) => discount.id === discountId
  );

  if (index === -1) {
    return undefined;
  }

  const existingDiscount = mockDiscounts[index];

  if (!existingDiscount) {
    return undefined;
  }

  const normalizedCode = payload.code.trim().toUpperCase();

  if (!normalizedCode) {
    throw new Error("Discount code is required.");
  }

  /**
   * --------------------------------------------------------------------------
   * Duplicate code protection
   * --------------------------------------------------------------------------
   */

  const duplicate = mockDiscounts.find(
    (discount) =>
      discount.id !== discountId &&
      discount.code.trim().toUpperCase() === normalizedCode
  );

  if (duplicate) {
    throw new Error("A discount with this code already exists.");
  }

  /**
   * --------------------------------------------------------------------------
   * Preserve existing status
   * --------------------------------------------------------------------------
   *
   * UpdateDiscount does not contain isActive.
   *
   * Therefore the existing activation state must remain unchanged.
   */

  const updatedDiscount: Discount = {
    ...existingDiscount,

    id: discountId,

    code: normalizedCode,

    discountValue: payload.discountValue,

    numberOfTimes: payload.numberOfTimes,

    startDate: payload.startDate,

    endDate: payload.endDate,

    limitCodeToOneCustomer: payload.limitCodeToOneCustomer,
  };

  mockDiscounts[index] = updatedDiscount;

  return {
    ...updatedDiscount,
  };
}

/**
 * ============================================================================
 * UPDATE DISCOUNT STATUS
 * ============================================================================
 */

export function updateMockDiscountStatus(
  discountId: string,
  isActive: boolean
): Discount | undefined {
  const index = mockDiscounts.findIndex(
    (discount) => discount.id === discountId
  );

  if (index === -1) {
    return undefined;
  }

  const existingDiscount = mockDiscounts[index];

  if (!existingDiscount) {
    return undefined;
  }

  const updatedDiscount: Discount = {
    ...existingDiscount,

    isActive,
  };

  mockDiscounts[index] = updatedDiscount;

  return {
    ...updatedDiscount,
  };
}

/**
 * ============================================================================
 * DELETE DISCOUNT
 * ============================================================================
 */

export function deleteMockDiscount(discountId: string): boolean {
  const originalLength = mockDiscounts.length;

  mockDiscounts = mockDiscounts.filter(
    (discount) => discount.id !== discountId
  );

  return mockDiscounts.length !== originalLength;
}

/**
 * ============================================================================
 * RESET MOCK DISCOUNTS
 * ============================================================================
 */

export function resetMockDiscounts(): void {
  mockDiscounts = MOCK_DISCOUNTS.map((discount) => ({
    ...discount,
  }));
}


