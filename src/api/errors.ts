import axios, { AxiosError } from "axios";

import { ApiError } from "@/types/api";

/**
 * Returns a user-friendly error message from an unknown error.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return getAxiosErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

/**
 * Converts an Axios error into a readable message.
 */
export function getAxiosErrorMessage(error: AxiosError<ApiError>): string {
  /**
   * Network error
   */
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  /**
   * API supplied message
   */
  if (error.response.data?.responseMessage) {
    return error.response.data.responseMessage;
  }

  /**
   * Validation errors
   */
  if (error.response.data?.errors && error.response.data.errors.length > 0) {
    return error.response.data.errors.join("\n");
  }

  switch (error.response.status) {
    case 400:
      return "Invalid request.";

    case 401:
      return "Your session has expired. Please login again.";

    case 403:
      return "You are not authorized to perform this action.";

    case 404:
      return "The requested resource could not be found.";

    case 409:
      return "The request could not be completed because of a conflict.";

    case 422:
      return "Validation failed.";

    case 500:
      return "An unexpected server error occurred.";

    case 503:
      return "The service is temporarily unavailable.";

    default:
      return "Something went wrong.";
  }
}
