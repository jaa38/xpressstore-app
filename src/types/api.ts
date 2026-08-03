/**
 * -----------------------------------------------------------------------------
 * Standard Xpress API Response
 * -----------------------------------------------------------------------------
 */

export interface ApiResponse<T> {
  responseCode: string;

  responseMessage: string;

  data: T;
}

/**
 * -----------------------------------------------------------------------------
 * Paginated Response
 * -----------------------------------------------------------------------------
 */

export interface PaginatedResponse<T> {
  responseCode: string;

  responseMessage: string;

  data: T[];

  pageNumber: number;

  pageSize: number;

  totalRecords: number;

  totalPages: number;
}

/**
 * -----------------------------------------------------------------------------
 * API Error
 * -----------------------------------------------------------------------------
 */

export interface ApiError {
  responseCode: string;

  responseMessage: string;

  errors?: string[];
}

/**
 * -----------------------------------------------------------------------------
 * Pagination
 * -----------------------------------------------------------------------------
 */

export interface PaginationParams {
  pageNumber?: number;

  pageSize?: number;

  search?: string;
}
