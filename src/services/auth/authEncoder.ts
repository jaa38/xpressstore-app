import { LoginRequest } from "@/types/auth";

import { Buffer } from "buffer";

/**
 * Base64 encode a string.
 *
 * Note:
 * React Native does not provide btoa() by default.
 * We'll use Buffer from the buffer package.
 */
export function encodeBase64(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64");
}

/**
 * Encode login credentials required by the
 * Xpress Authentication API.
 */
export function encodeLoginRequest(
  payload: LoginRequest
): LoginRequest {
  return {
    email: encodeBase64(payload.email.trim()),

    password: encodeBase64(payload.password),
  };
}