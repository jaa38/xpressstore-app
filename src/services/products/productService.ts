import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import { productRepository } from "@/repositories/products/sqliteProductRepository";

import {
  CreateProductRequest,
  CreateProductCategoryRequest,
  MerchantProduct,
  ProductCategoryDto,
  ProductImageDto,
  UpdateProductRequest,
  CreatedProduct,
} from "@/types/product";

export const productService = {
  /**
   * ---------------------------------------------------------------------------
   * Merchant Products
   * ---------------------------------------------------------------------------
   */
  async getMerchantProducts() {
    try {
      const { data } = await authClient.get<ApiResponse<MerchantProduct[]>>(
        API_ENDPOINTS.products.merchant
      );

      await productRepository.saveMerchantProducts(data.data ?? []);

      return data;
    } catch (error) {
      const products = await productRepository.getProducts();

      if (products.length === 0) {
        throw error;
      }

      return {
        responseCode: "LOCAL_CACHE",
        responseMessage: "Products loaded from local storage.",
        data: products,
      } satisfies ApiResponse<MerchantProduct[]>;
    }
  },

  async getProduct(productId: number) {
    try {
      const { data } = await authClient.get<ApiResponse<MerchantProduct>>(
        API_ENDPOINTS.products.product(productId)
      );

      if (data.data) {
        await productRepository.saveProduct(data.data);
      }

      return data;
    } catch (error) {
      const product = await productRepository.getProductById(String(productId));

      if (!product) {
        throw error;
      }

      return {
        responseCode: "LOCAL_CACHE",
        responseMessage: "Product loaded from local storage.",
        data: product,
      } satisfies ApiResponse<MerchantProduct>;
    }
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
    const { data } = await authClient.post<ApiResponse<CreatedProduct>>(
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
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.products.delete(productId)
    );

    await productRepository.deleteProduct(String(productId));

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
    const { data } = await authClient.post<ApiResponse<ProductImageDto[]>>(
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

  async updateCategory(
    categoryId: number,
    payload: CreateProductCategoryRequest
  ) {
    const { data } = await authClient.post<ApiResponse<ProductCategoryDto>>(
      API_ENDPOINTS.products.updateCategory,
      {
        ...payload,
        id: categoryId,
      }
    );

    return data;
  },

  async deleteCategory(categoryId: number) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.products.deleteCategory(categoryId)
    );

    return data;
  },
};
