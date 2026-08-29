import type { BusinessCategory } from "@/types/lookup";

export const MOCK_BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    businessCategoryId: 1,
    categoryName: "Fashion",
    isActive: true,
  },
  {
    businessCategoryId: 2,
    categoryName: "Retail",
    isActive: true,
  },
  {
    businessCategoryId: 3,
    categoryName: "Electronics",
    isActive: true,
  },
  {
    businessCategoryId: 4,
    categoryName: "Food & Beverages",
    isActive: true,
  },
  {
    businessCategoryId: 5,
    categoryName: "Beauty & Personal Care",
    isActive: true,
  },
  {
    businessCategoryId: 6,
    categoryName: "Health",
    isActive: true,
  },
  {
    businessCategoryId: 7,
    categoryName: "Home & Living",
    isActive: true,
  },
  {
    businessCategoryId: 8,
    categoryName: "Professional Services",
    isActive: true,
  },
  {
    businessCategoryId: 9,
    categoryName: "Technology",
    isActive: true,
  },
  {
    businessCategoryId: 10,
    categoryName: "Other",
    isActive: true,
  },
];

export function getMockBusinessCategories(): BusinessCategory[] {
  return [...MOCK_BUSINESS_CATEGORIES];
}
