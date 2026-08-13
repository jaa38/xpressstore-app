import { getAccessToken } from "@/storage/authStorage";

const GRAPHQL_URL = "https://myxpresspay.com:7015/";

interface GraphQLResponse<T> {
  data?: T;

  errors?: Array<{
    message: string;
  }>;
}

interface GraphQLRequest {
  query: string;

  variables?: Record<string, unknown>;
}

export async function graphqlRequest<T>({
  query,
  variables,
}: GraphQLRequest): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  let response: Response;

  try {
    response = await fetch(GRAPHQL_URL, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",

        Accept: "application/json",
      },

      body: JSON.stringify({
        query,

        variables,
      }),
    });
  } catch {
    throw new Error(
      "Check your internet connection."
    );
  }

  if (response.status === 401) {
    throw new Error(
      "Your session has expired. Please log in again."
    );
  }

  if (response.status === 403) {
    throw new Error(
      "You do not have permission to perform this action."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`
    );
  }

  const result =
    (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    throw new Error(
      result.errors[0]?.message ??
        "GraphQL request failed."
    );
  }

  if (result.data === undefined) {
    throw new Error(
      "The API returned an empty GraphQL response."
    );
  }

  return result.data;
}