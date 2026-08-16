import type {
  Store,
  StoreSummary,
  ShippingRegion,
} from "@/types/store";

import { getDatabase } from "@/database";

import type { StoreRepository } from "./storeRepository";

/**
 * ============================================================================
 * SQLite Row Types
 * ============================================================================
 */

interface StoreRow {
  store_id: number;
  store_name: string;
  store_reference: string;
  store_link: string;
  currency: string;

  welcome_message: string | null;
  description: string | null;

  is_active: number;

  theme_color: string | null;
  callback_url: string | null;
  success_message: string | null;
  whatsapp_number: string | null;
  phone_number: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;

  products: string | null;
  discounts: string | null;

  updated_at: number;
}

interface ShippingRegionRow {
  id: number;
  region: string;
  state: string;
  shipping_fee: number;
  updated_at: number;
}

/**
 * ============================================================================
 * Mapping Helpers
 * ============================================================================
 */

/**
 * Safely parse a JSON array stored in SQLite.
 *
 * Store products and discounts are represented by number[]
 * in the application model but persisted as TEXT in SQLite.
 */
function parseNumberArray(
  value: string | null
): number[] | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return undefined;
    }

    const numbers = parsed.filter(
      (item): item is number =>
        typeof item === "number" &&
        Number.isFinite(item)
    );

    return numbers;
  } catch {
    return undefined;
  }
}

/**
 * Serialize a number array for SQLite storage.
 */
function serializeNumberArray(
  value?: number[]
): string | null {
  if (!value) {
    return null;
  }

  return JSON.stringify(value);
}

/**
 * Map a SQLite store row into the application Store model.
 */
function mapRowToStore(
  row: StoreRow
): Store {
  return {
    storeId: row.store_id,

    storeName: row.store_name,

    storeReference: row.store_reference,

    storeLink: row.store_link,

    currency: row.currency,

    welcomeMessage:
      row.welcome_message ?? undefined,

    description:
      row.description ?? undefined,

    isActive:
      row.is_active === 1,

    themeColor:
      row.theme_color ?? undefined,

    callBackUrl:
      row.callback_url ?? undefined,

    successMessage:
      row.success_message ?? undefined,

    whatsAppNumber:
      row.whatsapp_number ?? undefined,

    phoneNumber:
      row.phone_number ?? undefined,

    email:
      row.email ?? undefined,

    instagram:
      row.instagram ?? undefined,

    facebook:
      row.facebook ?? undefined,

    twitter:
      row.twitter ?? undefined,

    products:
      parseNumberArray(row.products),

    discounts:
      parseNumberArray(row.discounts),
  };
}

/**
 * Map a SQLite store row into the smaller StoreSummary model.
 */
function mapRowToStoreSummary(
  row: StoreRow
): StoreSummary {
  return {
    storeId: row.store_id,

    storeName: row.store_name,

    storeReference: row.store_reference,

    currency: row.currency,

    isActive:
      row.is_active === 1,
  };
}

/**
 * Map a SQLite shipping-region row into the application model.
 */
function mapRowToShippingRegion(
  row: ShippingRegionRow
): ShippingRegion {
  return {
    id: row.id,

    region: row.region,

    state: row.state,

    shippingFee: row.shipping_fee,
  };
}

/**
 * ============================================================================
 * SQLite Store Repository
 * ============================================================================
 */

class SQLiteStoreRepository
  implements StoreRepository
{
  /**
   * --------------------------------------------------------------------------
   * Get Stores
   * --------------------------------------------------------------------------
   */

  async getStores(): Promise<Store[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<StoreRow>(`
        SELECT
          store_id,
          store_name,
          store_reference,
          store_link,
          currency,
          welcome_message,
          description,
          is_active,
          theme_color,
          callback_url,
          success_message,
          whatsapp_number,
          phone_number,
          email,
          instagram,
          facebook,
          twitter,
          products,
          discounts,
          updated_at
        FROM stores
        ORDER BY store_name ASC
      `);

    return rows.map(mapRowToStore);
  }

  /**
   * --------------------------------------------------------------------------
   * Get Store By ID
   * --------------------------------------------------------------------------
   */

  async getStoreById(
    id: number
  ): Promise<Store | null> {
    const database = await getDatabase();

    const row =
      await database.getFirstAsync<StoreRow>(
        `
          SELECT
            store_id,
            store_name,
            store_reference,
            store_link,
            currency,
            welcome_message,
            description,
            is_active,
            theme_color,
            callback_url,
            success_message,
            whatsapp_number,
            phone_number,
            email,
            instagram,
            facebook,
            twitter,
            products,
            discounts,
            updated_at
          FROM stores
          WHERE store_id = ?
          LIMIT 1
        `,
        id
      );

    if (!row) {
      return null;
    }

    return mapRowToStore(row);
  }

  /**
   * --------------------------------------------------------------------------
   * Get Store Summaries
   * --------------------------------------------------------------------------
   */

  async getStoreSummaries(): Promise<StoreSummary[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<StoreRow>(`
        SELECT
          store_id,
          store_name,
          store_reference,
          store_link,
          currency,
          welcome_message,
          description,
          is_active,
          theme_color,
          callback_url,
          success_message,
          whatsapp_number,
          phone_number,
          email,
          instagram,
          facebook,
          twitter,
          products,
          discounts,
          updated_at
        FROM stores
        ORDER BY store_name ASC
      `);

    return rows.map(mapRowToStoreSummary);
  }

  /**
   * --------------------------------------------------------------------------
   * Save Stores
   * --------------------------------------------------------------------------
   */

  async saveStores(
    stores: Store[]
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        for (const store of stores) {
          await this.upsertStore(
            database,
            store
          );
        }
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Store
   * --------------------------------------------------------------------------
   */

  async saveStore(
    store: Store
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        await this.upsertStore(
          database,
          store
        );
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Upsert Store
   * --------------------------------------------------------------------------
   */

  private async upsertStore(
    database: Awaited<
      ReturnType<typeof getDatabase>
    >,
    store: Store
  ): Promise<void> {
    await database.runAsync(
      `
        INSERT INTO stores (
          store_id,
          store_name,
          store_reference,
          store_link,
          currency,
          welcome_message,
          description,
          is_active,
          theme_color,
          callback_url,
          success_message,
          whatsapp_number,
          phone_number,
          email,
          instagram,
          facebook,
          twitter,
          products,
          discounts,
          updated_at
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        ON CONFLICT(store_id)
        DO UPDATE SET
          store_name = excluded.store_name,
          store_reference = excluded.store_reference,
          store_link = excluded.store_link,
          currency = excluded.currency,
          welcome_message = excluded.welcome_message,
          description = excluded.description,
          is_active = excluded.is_active,
          theme_color = excluded.theme_color,
          callback_url = excluded.callback_url,
          success_message = excluded.success_message,
          whatsapp_number = excluded.whatsapp_number,
          phone_number = excluded.phone_number,
          email = excluded.email,
          instagram = excluded.instagram,
          facebook = excluded.facebook,
          twitter = excluded.twitter,
          products = excluded.products,
          discounts = excluded.discounts,
          updated_at = excluded.updated_at
      `,
      store.storeId,

      store.storeName,

      store.storeReference,

      store.storeLink,

      store.currency,

      store.welcomeMessage ?? null,

      store.description ?? null,

      store.isActive ? 1 : 0,

      store.themeColor ?? null,

      store.callBackUrl ?? null,

      store.successMessage ?? null,

      store.whatsAppNumber ?? null,

      store.phoneNumber ?? null,

      store.email ?? null,

      store.instagram ?? null,

      store.facebook ?? null,

      store.twitter ?? null,

      serializeNumberArray(
        store.products
      ),

      serializeNumberArray(
        store.discounts
      ),

      Date.now()
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Get Shipping Regions
   * --------------------------------------------------------------------------
   */

  async getShippingRegions(): Promise<ShippingRegion[]> {
    const database = await getDatabase();

    const rows =
      await database.getAllAsync<ShippingRegionRow>(`
        SELECT
          id,
          region,
          state,
          shipping_fee,
          updated_at
        FROM shipping_regions
        ORDER BY region ASC, state ASC
      `);

    return rows.map(
      mapRowToShippingRegion
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Save Shipping Regions
   * --------------------------------------------------------------------------
   */

  async saveShippingRegions(
    regions: ShippingRegion[]
  ): Promise<void> {
    const database = await getDatabase();

    await database.withTransactionAsync(
      async () => {
        for (const region of regions) {
          await database.runAsync(
            `
              INSERT INTO shipping_regions (
                id,
                region,
                state,
                shipping_fee,
                updated_at
              )
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(id)
              DO UPDATE SET
                region = excluded.region,
                state = excluded.state,
                shipping_fee = excluded.shipping_fee,
                updated_at = excluded.updated_at
            `,
            region.id,

            region.region,

            region.state,

            region.shippingFee,

            Date.now()
          );
        }
      }
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Delete Store
   * --------------------------------------------------------------------------
   */

  async deleteStore(
    id: number
  ): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(
      `
        DELETE FROM stores
        WHERE store_id = ?
      `,
      id
    );
  }

  /**
   * --------------------------------------------------------------------------
   * Clear Stores
   * --------------------------------------------------------------------------
   */

  async clearStores(): Promise<void> {
    const database = await getDatabase();

    await database.runAsync(`
      DELETE FROM stores
    `);
  }
}

/**
 * ============================================================================
 * Repository Instance
 * ============================================================================
 */

export const storeRepository =
  new SQLiteStoreRepository();