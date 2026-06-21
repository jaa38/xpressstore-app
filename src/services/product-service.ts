import { supabase } from "@/services/supabase/client";

import type { ProductDraft } from "@/types/product";

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

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
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

      image: item.image,

      images: item.images ?? [],

      visible: item.visible,

      shippingClass: item.shipping_class,

      deliveryNotes: item.delivery_notes,

      dimensions: item.dimensions,

      variantsEnabled: item.variants_enabled,

      variants: item.variants ?? [],

      productStatus: "active",
    })) ?? []
  );
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
