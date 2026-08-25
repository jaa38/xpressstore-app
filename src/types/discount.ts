/**
 * ============================================================================
 * DISCOUNT TYPES
 * ============================================================================
 */

/**
 * ============================================================================
 * DISCOUNT
 * ============================================================================
 *
 * Based on the XpressPay Discount API response.
 *
 * API:
 * GET /Product/GetAllMerchantDiscounts
 * ============================================================================
 */

export interface Discount {
  id: string;

  code: string;

  discountValue: number;

  startDate?: string;

  endDate?: string;

  isActive: boolean;

  /**
   * Optional fields supported by CreateDiscount.
   */
  numberOfTimes?: number;

  limitCodeToOneCustomer?: boolean;
}

/**
 * ============================================================================
 * CREATE DISCOUNT
 * ============================================================================
 *
 * API:
 * POST /Product/CreateDiscount
 * ============================================================================
 */

export interface CreateDiscountRequest {
  code: string;

  discountValue: number;

  numberOfTimes?: number;

  startDate?: string;

  endDate?: string;

  limitCodeToOneCustomer?: boolean;
}

/**
 * ============================================================================
 * UPDATE DISCOUNT
 * ============================================================================
 *
 * API:
 * POST /Product/UpdateDiscount
 * ============================================================================
 */

export interface UpdateDiscountRequest {
  id: string;

  code: string;

  discountValue: number;

  numberOfTimes?: number;

  startDate?: string;

  endDate?: string;

  limitCodeToOneCustomer?: boolean;
}
