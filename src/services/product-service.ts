import { supabase } from "@/services/supabase/client";

import type { Product, ProductDraft } from "@/types/product";

export async function createProduct(product: ProductDraft) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      product_name: product.productName,

      description: product.description,

      category: product.category,

      brand: product.brand,

      sku: product.sku,

      price: product.price,

      cost_price: product.costPrice,

      tax_applicable: product.taxApplicable,

      track_inventory: product.trackInventory,

      stock: product.stock,

      low_stock_alert: product.lowStockAlert,

      reorder_level: product.reorderLevel,

      visible: product.visible,

      shipping_class: product.shippingClass,

      delivery_notes: product.deliveryNotes,

      image: product.image,

      images: product.images,

      dimensions: product.dimensions,

      variants_enabled: product.variantsEnabled,

      variants: product.variants,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const mappedProducts: Product[] =
    data?.map((item) => ({
      id: item.id,

      productName: item.product_name,

      description: item.description,

      category: item.category,

      brand: item.brand,

      sku: item.sku,

      price: item.price,

      costPrice: item.cost_price,

      taxApplicable: item.tax_applicable,

      trackInventory: item.track_inventory,

      stock: item.stock,

      lowStockAlert: item.low_stock_alert,

      reorderLevel: item.reorder_level,

      image: item.image ?? "",

      images: item.images ?? [],

      visible: item.visible,

      shippingClass: item.shipping_class,

      deliveryNotes: item.delivery_notes ?? "",

      dimensions: item.dimensions ?? {
        weight: "",
        length: "",
        width: "",
        height: "",
      },

      variantsEnabled: item.variants_enabled,

      variants: item.variants ?? [],

      productStatus: "active",
    })) ?? [];

  return mappedProducts;
}

export async function updateProductVisibility(
  productId: string,
  visible: boolean
) {
  const { data, error } = await supabase
    .from("products")
    .update({
      visible,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }
}

export async function getProduct(productId: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,

    productName: data.product_name,

    description: data.description,

    category: data.category,

    brand: data.brand,

    sku: data.sku,

    price: data.price,

    costPrice: data.cost_price,

    taxApplicable: data.tax_applicable,

    trackInventory: data.track_inventory,

    stock: data.stock,

    lowStockAlert: data.low_stock_alert,

    reorderLevel: data.reorder_level,

    image: data.image ?? "",

    images: data.images ?? [],

    visible: data.visible,

    shippingClass: data.shipping_class,

    deliveryNotes: data.delivery_notes ?? "",

    dimensions: data.dimensions ?? {
      weight: "",
      length: "",
      width: "",
      height: "",
    },

    variantsEnabled: data.variants_enabled,

    variants: data.variants ?? [],

    productStatus: "active",
  };
}

export async function updateProduct(
  productId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
