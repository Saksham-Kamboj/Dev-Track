// Generic API service for HTTP requests
export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiRequestOptions<P = unknown> {
  method?: ApiMethod;
  payload?: P;
  token?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
}

export async function apiFetch<T = unknown, P = unknown>(
  url: string,
  options: ApiRequestOptions<P> = {}
): Promise<T> {
  const {
    method = "GET",
    payload,
    token = localStorage.getItem("token") || undefined,
    headers = {},
    signal,
  } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(signal ? { signal } : {}),
  };

  if (payload && method !== "GET") {
    fetchOptions.body = JSON.stringify(payload);
  }

  const response = await fetch(url, fetchOptions);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    // Optionally, dispatch a global unauthorized event
    if (response.status === 401) {
      window.dispatchEvent(
        new CustomEvent("unauthorized-response", {
          detail: {
            status: 401,
            message: getErrorMessage(data, "Unauthorized"),
          },
        })
      );
    }
    throw new Error(getErrorMessage(data, response.statusText));
  }

  return data as T;
}
