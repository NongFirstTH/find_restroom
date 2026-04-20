import { BASE, fetchWithAuth } from ".";
import type { Restroom, RestroomFormData } from "../types";

// region get
export async function getRestrooms(bbox: {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}): Promise<Restroom[]> {
  const params = `?minLng=${bbox.minLng}&minLat=${bbox.minLat}&maxLng=${bbox.maxLng}&maxLat=${bbox.maxLat}`;
  const res = await fetch(`${BASE}/api/restrooms/bounds${params}`);
  if (!res.ok) throw new Error("Failed to fetch restrooms");

  const restrooms = await res.json();
  return restrooms;
}

// region create
export async function createRestroom(
  data: RestroomFormData,
  token: string,
  onRefresh: (a: string, r: string) => void,
  onLogout: () => void,
): Promise<Restroom> {
  const res = await fetchWithAuth(
    `${BASE}/api/restrooms`,
    { method: "POST", body: JSON.stringify(data) },
    () => token,
    onRefresh,
    onLogout,
  );
  if (!res.ok) throw new Error("Failed to create restroom");
  return res.json();
}

// region update
export async function updateRestroom(
  id: string,
  data: Partial<RestroomFormData>,
  token: string,
  onRefresh: (a: string, r: string) => void,
  onLogout: () => void,
): Promise<Restroom> {
  const res = await fetchWithAuth(
    `${BASE}/api/restrooms/${id}`,
    { method: "PUT", body: JSON.stringify(data) },
    () => token,
    onRefresh,
    onLogout,
  );
  if (!res.ok) throw new Error("Failed to update restroom");
  return res.json();
}

// region delete
export async function deleteRestroom(
  id: string,
  token: string,
  onRefresh: (a: string, r: string) => void,
  onLogout: () => void,
): Promise<void> {
  const res = await fetchWithAuth(
    `${BASE}/api/restrooms/${id}`,
    { method: "DELETE" },
    () => token,
    onRefresh,
    onLogout,
  );
  if (!res.ok) throw new Error("Failed to delete restroom");
}
