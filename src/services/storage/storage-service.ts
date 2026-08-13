import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

import type { ApiResponse } from "@/types/api";
import type { ProductImageDto } from "@/types/product";

/**
 * ---------------------------------------------------------------------------
 * Upload Product Image
 * ---------------------------------------------------------------------------
 *
 * Uploads a product image through the Xpress API.
 *
 * Backend:
 *
 * POST /FileUploader/UploadProductImage
 *
 * Content-Type:
 *
 * multipart/form-data
 *
 * The backend returns a ProductImageDto containing:
 *
 * {
 *   filename: string;
 *   url: string;
 * }
 *
 * Existing remote URLs are returned unchanged so callers can safely use this
 * function for both new and already-uploaded images.
 */
export async function uploadProductImage(
  uri: string
): Promise<string> {
  /**
   * No image selected.
   */
  if (!uri) {
    return "";
  }

  /**
   * Image has already been uploaded.
   *
   * Do not upload the same remote image again.
   */
  if (uri.startsWith("http")) {
    return uri;
  }

  /**
   * Build multipart/form-data request.
   */
  const formData = new FormData();

  /**
   * Extract a usable filename from the local URI.
   */
  const uriParts = uri.split("/");

  const originalFileName =
    uriParts[uriParts.length - 1] ||
    `product-${Date.now()}.jpg`;

  const fileName =
    originalFileName.includes(".")
      ? originalFileName
      : `${originalFileName}.jpg`;

  /**
   * React Native FormData file.
   */
  formData.append("file", {
    uri,
    name: fileName,
    type: "image/jpeg",
  } as any);

  /**
   * Upload through the authenticated Xpress API client.
   *
   * The API client interceptor automatically attaches:
   *
   * Authorization: Bearer <jwt>
   */
  const { data } =
    await apiClient.post<
      ApiResponse<ProductImageDto>
    >(
      API_ENDPOINTS.products.uploadImage,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  return data.data.url;
}