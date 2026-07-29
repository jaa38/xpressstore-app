import { supabase } from "@/services/supabase/client";

import type {
  PaymentLink,
  CreatePaymentLinkPayload,
} from "@/types/paymentLink";

export async function getPaymentLinks(): Promise<PaymentLink[]> {
  const { data, error } = await supabase
    .from("payment_links")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data as PaymentLink[];
}

export async function createPaymentLink(
  paymentLink: CreatePaymentLinkPayload
): Promise<PaymentLink> {
  const { data, error } = await supabase
    .from("payment_links")
    .insert(paymentLink)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as PaymentLink;
}

export async function deletePaymentLink(id: string): Promise<void> {
  const { error } = await supabase.from("payment_links").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
export async function deactivatePaymentLink(id: string): Promise<PaymentLink> {
  const { data, error } = await supabase
    .from("payment_links")
    .update({
      status: "inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as PaymentLink;
}
