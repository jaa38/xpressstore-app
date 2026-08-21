import { authClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import { ApiResponse } from "@/types/api";

import { storeRepository } from "@/repositories/stores/sqliteStoreRepository";

import {
  Store,
  CreateStoreRequest,
  UpdateStoreRequest,
  ShippingRegion,
  CreateShippingRegionRequest,
  UpdateShippingRegionRequest,
  StoreAvailabilityResponse,
} from "@/types/store";

export const storeService = {
  /**
   * ===========================================================================
   * Get Stores
   * ===========================================================================
   *
   * Retrieves all stores from the API.
   *
   * The returned stores are also persisted locally in SQLite so the app
   * can continue working with cached store data when the API is unavailable.
   */
  async getStores(): Promise<ApiResponse<Store[]>> {
    try {
      const { data } = await authClient.get<ApiResponse<Store[]>>(
        API_ENDPOINTS.store.getStores
      );

      const stores = data.data ?? [];

      /**
       * Persist the complete Store objects locally.
       */
      await storeRepository.saveStores(stores);

      return data;
    } catch (error) {
      /**
       * -----------------------------------------------------------------------
       * Offline fallback
       * -----------------------------------------------------------------------
       */

      const stores = await storeRepository.getStores();

      if (stores.length === 0) {
        throw error;
      }

      return {
        data: stores,
        responseCode: "00",
        responseMessage: "Using locally cached store data.",
      };
    }
  },

  /**
   * ===========================================================================
   * Get Store By ID
   * ===========================================================================
   *
   * Retrieves one complete Store object.
   *
   * IMPORTANT:
   *
   * The GetStoreById API response currently exposes StoreSummary-level data,
   * while the application needs the complete Store model for the edit and
   * customisation screens.
   *
   * The complete Store object is already persisted locally by getStores().
   *
   * Therefore:
   *
   * 1. Check SQLite first.
   * 2. If the store is not cached, refresh the store list.
   * 3. Look for the requested store.
   * 4. Return the complete Store.
   *
   * This means the edit screen can safely access:
   *
   * - storeLink
   * - description
   * - welcomeMessage
   * - themeColor
   * - callBackUrl
   * - successMessage
   * - whatsAppNumber
   * - phoneNumber
   * - email
   * - instagram
   * - facebook
   * - twitter
   * - products
   * - discounts
   */
  async getStore(storeId: number): Promise<ApiResponse<Store>> {
    /**
     * -------------------------------------------------------------------------
     * Validate store ID
     * -------------------------------------------------------------------------
     */

    if (!Number.isFinite(storeId) || storeId <= 0) {
      throw new Error("Invalid store ID.");
    }

    /**
     * -------------------------------------------------------------------------
     * Try local database first
     * -------------------------------------------------------------------------
     *
     * The local database contains the complete Store model.
     */
    const cachedStore = await storeRepository.getStoreById(storeId);

    if (cachedStore) {
      return {
        data: cachedStore,
        responseCode: "00",
        responseMessage: "Store loaded successfully.",
      };
    }

    /**
     * -------------------------------------------------------------------------
     * Store is not cached
     * -------------------------------------------------------------------------
     *
     * Refresh the merchant store list from the API.
     *
     * getStores() also persists the complete Store objects into SQLite.
     */
    const storesResponse = await this.getStores();

    const store = storesResponse.data.find((item) => item.storeId === storeId);

    if (!store) {
      throw new Error(`Store ${storeId} could not be found.`);
    }

    return {
      data: store,
      responseCode: storesResponse.responseCode,
      responseMessage: storesResponse.responseMessage,
    };
  },

  /**
   * ===========================================================================
   * Create Store
   * ===========================================================================
   */
  async createStore(payload: CreateStoreRequest): Promise<ApiResponse<Store>> {
    const { data } = await authClient.post<ApiResponse<Store>>(
      API_ENDPOINTS.store.createStore,
      payload
    );

    /**
     * Cache the newly created store when the API returns it.
     */
    if (data.data) {
      await storeRepository.saveStore(data.data);
    }

    return data;
  },

  /**
   * ===========================================================================
   * Update Store
   * ===========================================================================
   */
  async updateStore(payload: UpdateStoreRequest): Promise<ApiResponse<void>> {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.updateStore,
      payload
    );

    /**
     * The update endpoint currently returns void.
     *
     * The React Query mutation invalidates the relevant store queries after
     * the update succeeds.
     */
    return data;
  },

  /**
   * ===========================================================================
   * Delete Store
   * ===========================================================================
   */
  async deleteStore(storeId: number): Promise<ApiResponse<void>> {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.deleteStore(storeId)
    );

    /**
     * Remove the deleted store from the local cache.
     */
    await storeRepository.deleteStore(storeId);

    return data;
  },

  /**
   * ===========================================================================
   * Validate Store Name
   * ===========================================================================
   */
  async validateStoreName(
    storeName: string
  ): Promise<ApiResponse<StoreAvailabilityResponse>> {
    const { data } = await authClient.get<
      ApiResponse<StoreAvailabilityResponse>
    >(API_ENDPOINTS.store.validateStoreName(storeName));

    return data;
  },

  /**
   * ===========================================================================
   * Validate Store Reference
   * ===========================================================================
   */
  async validateStoreReference(
    reference: string
  ): Promise<ApiResponse<StoreAvailabilityResponse>> {
    const { data } = await authClient.get<
      ApiResponse<StoreAvailabilityResponse>
    >(API_ENDPOINTS.store.validateStoreReference(reference));

    return data;
  },

  /**
   * ===========================================================================
   * Get Shipping Regions
   * ===========================================================================
   */
  async getShippingRegions(): Promise<ApiResponse<ShippingRegion[]>> {
    try {
      const { data } = await authClient.get<ApiResponse<ShippingRegion[]>>(
        API_ENDPOINTS.store.getShippingRegions
      );

      const regions = data.data ?? [];

      /**
       * Persist shipping regions locally.
       */
      await storeRepository.saveShippingRegions(regions);

      return data;
    } catch (error) {
      /**
       * -----------------------------------------------------------------------
       * Offline fallback
       * -----------------------------------------------------------------------
       */

      const regions = await storeRepository.getShippingRegions();

      if (regions.length === 0) {
        throw error;
      }

      return {
        data: regions,
        responseCode: "00",
        responseMessage: "Using locally cached shipping region data.",
      };
    }
  },

  /**
   * ===========================================================================
   * Create Shipping Region
   * ===========================================================================
   */
  async createShippingRegion(
    payload: CreateShippingRegionRequest
  ): Promise<ApiResponse<void>> {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.createShippingRegion,
      payload
    );

    return data;
  },

  /**
   * ===========================================================================
   * Update Shipping Region
   * ===========================================================================
   */
  async updateShippingRegion(
    payload: UpdateShippingRegionRequest
  ): Promise<ApiResponse<void>> {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.updateShippingRegion,
      payload
    );

    return data;
  },

  /**
   * ===========================================================================
   * Delete Shipping Region
   * ===========================================================================
   */
  async deleteShippingRegion(regionId: number): Promise<ApiResponse<void>> {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.deleteShippingRegion(regionId)
    );

    return data;
  },

  /**
   * ===========================================================================
   * Toggle Delivery
   * ===========================================================================
   */
  async toggleDelivery(
    transactionId: string,
    isDelivery: boolean
  ): Promise<ApiResponse<void>> {
    const { data } = await authClient.post<ApiResponse<void>>(
      API_ENDPOINTS.store.toggleDelivery(transactionId, isDelivery)
    );

    return data;
  },
};
