import { describe, expect, test } from "bun:test";
import { ApiError, createApiClient } from "./api-client.factory";

function fetchStub(responses: Array<{ status: number; body: unknown }>) {
  let call = 0;
  const requests: Array<{ url: string; method: string; body: unknown }> = [];
  const impl = (async (input: URL | Request | string, init?: RequestInit) => {
    const response = responses[Math.min(call, responses.length - 1)];
    call += 1;
    requests.push({
      url: String(input),
      method: init?.method ?? "GET",
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(
      response.status === 204 ? null : JSON.stringify(response.body),
      { status: response.status },
    );
  }) as unknown as typeof fetch;
  return { impl, requests };
}

describe("createApiClient", () => {
  test("récupère une ressource et construit l'URL complète", async () => {
    const { impl, requests } = fetchStub([{ status: 200, body: { id: "t1" } }]);
    const client = createApiClient("http://api.test/", impl);

    const result = await client.get<{ id: string }>("/museum/tickets/t1");

    expect(result.id).toBe("t1");
    expect(requests[0]?.url).toBe("http://api.test/museum/tickets/t1");
    expect(requests[0]?.method).toBe("GET");
  });

  test("envoie un corps JSON sur POST", async () => {
    const { impl, requests } = fetchStub([{ status: 201, body: { ok: true } }]);
    const client = createApiClient("http://api.test", impl);

    await client.post("/museum/tickets/validate", { qr_code: "QR-1" });

    expect(requests[0]?.method).toBe("POST");
    expect(requests[0]?.body).toEqual({ qr_code: "QR-1" });
  });

  test("lève une ApiError avec le statut sur réponse non valide", async () => {
    const { impl } = fetchStub([{ status: 404, body: { message: "inconnu" } }]);
    const client = createApiClient("http://api.test", impl);

    expect(client.get("/museum/tickets/xyz")).rejects.toBeInstanceOf(ApiError);
    expect(client.get("/museum/tickets/xyz")).rejects.toMatchObject({ status: 404 });
  });
});
