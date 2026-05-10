import type {
  DefectType,
  EstimateResponse,
  IphoneModel,
  IphoneSeries,
  StorageVariant,
} from "./types";

// Server components use the direct Django URL (server-to-server, no CORS).
// Client components call /api/* which Next.js rewrites to Django via next.config.ts.
const serverBase =
  typeof window === "undefined"
    ? (process.env.DJANGO_URL ?? "http://localhost:8000")
    : "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${serverBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  series: (): Promise<IphoneSeries[]> =>
    apiFetch("/api/series/"),

  models: (seriesId: number): Promise<IphoneModel[]> =>
    apiFetch(`/api/models/${seriesId}/`),

  storage: (modelId: number): Promise<StorageVariant[]> =>
    apiFetch(`/api/storage/${modelId}/`),

  defects: (): Promise<DefectType[]> =>
    apiFetch("/api/defects/"),

  estimate: (
    fromStorageId: number,
    toStorageId: number,
    defectIds: number[]
  ): Promise<EstimateResponse> =>
    apiFetch("/api/estimate/", {
      method: "POST",
      body: JSON.stringify({
        from_storage_id: fromStorageId,
        to_storage_id: toStorageId,
        defect_ids: defectIds,
      }),
    }),
};
