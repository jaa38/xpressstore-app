import { supabase } from "@/services/supabase/client";

import type { DropdownOption } from "@/components/ui/Dropdown";

export async function getCategories(): Promise<DropdownOption[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (
    data?.map((category) => ({
      label: category.name,
      value: category.slug,
    })) ?? []
  );
}

export async function createCategory(
  name: string
): Promise<DropdownOption> {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    label: data.name,
    value: data.slug,
  };
}