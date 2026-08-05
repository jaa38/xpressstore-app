import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  CreateProductRequest,
  CreateProductCategoryRequest,
  MerchantProduct,
  ProductCategoryDto,
  ProductImageDto,
  UpdateProductRequest,
} from "@/types/product";

export const productService = {
  /**
   * ---------------------------------------------------------------------------
   * Merchant Products
   * ---------------------------------------------------------------------------
   */
  async getMerchantProducts() {
    const { data } = await authClient.get<ApiResponse<MerchantProduct[]>>(
      API_ENDPOINTS.products.merchant
    );

    return data;
  },

  async getProduct(productId: number) {
    const { data } = await authClient.get<ApiResponse<MerchantProduct>>(
      API_ENDPOINTS.products.product(productId)
    );

    return data;
  },

  async getProductsByStore(storeId: number) {
    const { data } = await authClient.get<ApiResponse<MerchantProduct[]>>(
      API_ENDPOINTS.products.byStore(storeId)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * CRUD
   * ---------------------------------------------------------------------------
   */
  async createProduct(payload: CreateProductRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.products.create,
      payload
    );

    return data;
  },

  async updateProduct(productId: number, payload: UpdateProductRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.products.update,
      {
        ...payload,
        id: productId,
      }
    );

    return data;
  },

  async deleteProduct(productId: number) {
    const { data } = await authClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.products.delete(productId)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Product Status
   * ---------------------------------------------------------------------------
   */
  async toggleProductStatus(productId: number, status: boolean) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.products.toggleStatus(productId, status)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Product Images
   * ---------------------------------------------------------------------------
   */
  async uploadProductImage(formData: FormData) {
    const { data } = await authClient.post<ApiResponse<ProductImageDto>>(
      API_ENDPOINTS.products.uploadImage,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Store Assignment
   * ---------------------------------------------------------------------------
   */
  async addProductToStore(payload: { productId: number; storeIds: number[] }) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.products.addToStore,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Product Categories
   * ---------------------------------------------------------------------------
   */
  async getCategories() {
    const { data } = await authClient.get<ApiResponse<ProductCategoryDto[]>>(
      API_ENDPOINTS.products.categories
    );

    return data;
  },

  async createCategory(payload: CreateProductCategoryRequest) {
    const { data } = await authClient.post<ApiResponse<ProductCategoryDto>>(
      API_ENDPOINTS.products.createCategory,
      payload
    );

    return data;
  },
};
