// hooks/useRestrooms.ts
import { useState, useCallback } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Restroom, RestroomFormData } from "../types";
import {
  getRestrooms,
  createRestroom,
  updateRestroom,
  deleteRestroom,
} from "../api/restroom";

interface AuthCallbacks {
  token: string;
  onRefresh: (accessToken: string, refreshToken: string) => void;
  onLogout: () => void;
}

export function useRestrooms() {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (map: LeafletMap) => {
    try {
      setError(null);
      const b = map.getBounds();
      const data = await getRestrooms({
        minLng: b.getWest(),
        minLat: b.getSouth(),
        maxLng: b.getEast(),
        maxLat: b.getNorth(),
      });
      setRestrooms(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load restrooms");
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (data: RestroomFormData, auth: AuthCallbacks) => {
    const created = await createRestroom(data, auth.token, auth.onRefresh, auth.onLogout);
    setRestrooms((prev) => [...prev, { ...data, ...created }]);
  }, []);

  const edit = useCallback(
    async (id: string, data: RestroomFormData, auth: AuthCallbacks) => {
      const updated = await updateRestroom(id, data, auth.token, auth.onRefresh, auth.onLogout);
      setRestrooms((prev) =>
        prev.map((r) => (r.restroomId === id ? { ...r, ...updated } : r)),
      );
    },
    [],
  );

  const remove = useCallback(async (id: string, auth: AuthCallbacks) => {
    await deleteRestroom(id, auth.token, auth.onRefresh, auth.onLogout);
    setRestrooms((prev) => prev.filter((r) => r.restroomId !== id));
  }, []);

  return { restrooms, loading, error, setError, fetch, add, edit, remove };
}