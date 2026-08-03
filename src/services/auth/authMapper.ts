import { LoginResponse } from "@/types/auth";

export interface AuthSession {
  accessToken: string;

  refreshToken: string;

  expiresAt: string;

  user: LoginResponse["data"];
}

/**
 * Converts the Xpress login response into
 * the application's authentication session.
 */
export function mapLoginResponse(response: LoginResponse): AuthSession {
  return {
    accessToken: response.token.jwtToken,

    refreshToken: response.token.refreshToken,

    expiresAt: response.token.tokenExpireOn,

    user: response.data,
  };
}
