import { productService } from "@/services/products/product-service";

import type {
  CreateDiscountRequest,
  Discount,
  UpdateDiscountRequest,
} from "@/types/discount";

/**
 * ============================================================================
 * GET DISCOUNTS
 * ============================================================================
 */

export async function getDiscounts(): Promise<Discount[]> {
  const response = await productService.getDiscounts();

  return response.data ?? [];
}

/**
 * ============================================================================
 * CREATE DISCOUNT
 * ============================================================================
 */

export async function createDiscount(
  payload: CreateDiscountRequest
): Promise<void> {
  await productService.createDiscount(payload);
}

/**
 * ============================================================================
 * UPDATE DISCOUNT
 * ============================================================================
 */

export async function updateDiscount(
  payload: UpdateDiscountRequest
): Promise<void> {
  await productService.updateDiscount(payload);
}

/**
 * ============================================================================
 * UPDATE DISCOUNT STATUS
 * ============================================================================
 */

export async function updateDiscountStatus(
  discountId: string,
  status: boolean
): Promise<void> {
  await productService.updateDiscountStatus(discountId, status);
}

/**
 * ============================================================================
 * DELETE DISCOUNT
 * ============================================================================
 */

export async function deleteDiscount(discountId: string): Promise<void> {
  await productService.deleteDiscount(discountId);
}
