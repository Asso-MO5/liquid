/**
 * Fabrique de client HTTP pour l'API Ocelot, sans dépendance à
 * l'environnement : testable unitairement avec n'importe quelle implémentation
 * de fetch.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly detail: string,
  ) {
    super(`Appel API en échec (${status}) : ${detail}`);
    this.name = "ApiError";
  }
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
}

export function createApiClient(
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
): ApiClient {
  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const url = new URL(path.replace(/^\//, ""), base);

    const response = await fetchImpl(url, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new ApiError(response.status, detail.slice(0, 200));
    }

    return (await response.json()) as T;
  }

  return {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
  };
}
