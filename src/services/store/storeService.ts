import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import {
  Store,
  StoreSummary,
  CreateStoreRequest,
  UpdateStoreRequest,
  ShippingRegion,
  CreateShippingRegionRequest,
  UpdateShippingRegionRequest,
  StoreAvailabilityResponse,
} from "@/types/store";

export const storeService = {
  /**
   * ---------------------------------------------------------------------------
   * Get Stores
   * ---------------------------------------------------------------------------
   */
  async getStores() {
    const { data } = await authClient.get<ApiResponse<Store[]>>(
      API_ENDPOINTS.store.getStores
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Get Store By Id
   * ---------------------------------------------------------------------------
   */
  async getStore(storeId: number) {
    const { data } = await authClient.get<ApiResponse<StoreSummary>>(
      API_ENDPOINTS.store.getStore(storeId)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Create Store
   * ---------------------------------------------------------------------------
   */
  async createStore(payload: CreateStoreRequest) {
    const { data } = await authClient.post<ApiResponse<StoreSummary>>(
      API_ENDPOINTS.store.createStore,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Update Store
   * ---------------------------------------------------------------------------
   */
  async updateStore(payload: UpdateStoreRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.updateStore,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Delete Store
   * ---------------------------------------------------------------------------
   */
  async deleteStore(storeId: number) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.deleteStore(storeId)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Validate Store Name
   * ---------------------------------------------------------------------------
   */
  async validateStoreName(storeName: string) {
    const { data } = await authClient.get<
      ApiResponse<StoreAvailabilityResponse>
    >(API_ENDPOINTS.store.validateStoreName(storeName));

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Validate Store Reference
   * ---------------------------------------------------------------------------
   */
  async validateStoreReference(reference: string) {
    const { data } = await authClient.get<
      ApiResponse<StoreAvailabilityResponse>
    >(API_ENDPOINTS.store.validateStoreReference(reference));

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Get Shipping Regions
   * ---------------------------------------------------------------------------
   */
  async getShippingRegions() {
    const { data } = await authClient.get<ApiResponse<ShippingRegion[]>>(
      API_ENDPOINTS.store.getShippingRegions
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Create Shipping Region
   * ---------------------------------------------------------------------------
   */
  async createShippingRegion(payload: CreateShippingRegionRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.createShippingRegion,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Update Shipping Region
   * ---------------------------------------------------------------------------
   */
  async updateShippingRegion(payload: UpdateShippingRegionRequest) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.updateShippingRegion,
      payload
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Delete Shipping Region
   * ---------------------------------------------------------------------------
   */
  async deleteShippingRegion(regionId: number) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.deleteShippingRegion(regionId)
    );

    return data;
  },

  /**
   * ---------------------------------------------------------------------------
   * Toggle Delivery
   * ---------------------------------------------------------------------------
   */
  async toggleDelivery(transactionId: string, isDelivery: boolean) {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.toggleDelivery(transactionId, isDelivery)
    );

    return data;
  },
};
