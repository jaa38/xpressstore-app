import type {
  Store,
  StoreSummary,
  ShippingRegion,
} from "@/types/store";

export interface StoreRepository {
  getStores(): Promise<Store[]>;

  getStoreById(
    id: number
  ): Promise<Store | null>;

  getStoreSummaries(): Promise<StoreSummary[]>;

  saveStores(
    stores: Store[]
  ): Promise<void>;

  saveStore(
    store: Store
  ): Promise<void>;

  getShippingRegions(): Promise<ShippingRegion[]>;

  saveShippingRegions(
    regions: ShippingRegion[]
  ): Promise<void>;

  deleteStore(
    id: number
  ): Promise<void>;

  clearStores(): Promise<void>;
}