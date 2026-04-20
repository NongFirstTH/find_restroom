// hooks/useLeafletMap.ts
import { useEffect, useRef, useCallback } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Restroom } from "../types";

let L: any = null;

interface Options {
  onMoveEnd: (map: LeafletMap) => void;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (r: Restroom, x: number, y: number) => void;
  getOwnerOf: (r: Restroom) => boolean;
}

export function useLeafletMap(
  containerRef: React.RefObject<HTMLDivElement>,
  options: Options,
) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, any>>({});
  const pendingMarkerRef = useRef<any>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options; // always fresh, no stale closures

  // Init map once
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!containerRef.current || mapRef.current) return;
      const leaflet = await import("leaflet");
      L = leaflet.default ?? leaflet;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [13.7563, 100.5018],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { attribution: '&copy; <a href="https://carto.com/">CARTO</a>', maxZoom: 19 },
      ).addTo(map);

      map.on("moveend", () => optionsRef.current.onMoveEnd(map));
      map.on("click", (e: any) =>
        optionsRef.current.onMapClick(e.latlng.lat, e.latlng.lng),
      );

      mapRef.current = map;
      optionsRef.current.onMoveEnd(map); // initial fetch
    })();
    return () => { mounted = false; };
  }, [containerRef]);

  // Sync restroom markers
  const syncMarkers = useCallback((restrooms: Restroom[]) => {
    if (!mapRef.current || !L) return;
    const map = mapRef.current;

    // Clear all, re-add fresh (handles ownership color refresh too)
    for (const marker of Object.values(markersRef.current)) {
      map.removeLayer(marker);
    }
    markersRef.current = {};

    for (const r of restrooms) {
      const lat = Number(r.latitude);
      const lng = Number(r.longitude);
      if (!isFinite(lat) || !isFinite(lng)) continue;

      const isOwner = optionsRef.current.getOwnerOf(r);
      const icon = L.divIcon({
        html: `<div style="
          width:32px;height:32px;border-radius:50%;
          background:${r.isFree ? "#0d9488" : "#6366f1"};
          border:3px solid ${isOwner ? "#f59e0b" : "white"};
          display:flex;align-items:center;justify-content:center;
          font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer;
        ">🚻</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        className: "",
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .on("click", (e: any) => {
          L.DomEvent.stopPropagation(e);
          const p = map.latLngToContainerPoint([lat, lng]);
          optionsRef.current.onMarkerClick(r, p.x, p.y);
        });

      markersRef.current[r.restroomId] = marker;
    }

    return map.getBounds();
  }, []);

  // Pending pin marker
  const setPendingPin = useCallback(
    (latlng: { latitude: number; longitude: number } | null) => {
      if (!mapRef.current || !L) return;
      const map = mapRef.current;

      if (pendingMarkerRef.current) {
        map.removeLayer(pendingMarkerRef.current);
        pendingMarkerRef.current = null;
      }
      if (!latlng) return;

      const icon = L.divIcon({
        html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 3px 6px rgba(0,0,0,.4));">
          <div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#ef4444;border:3px solid white;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
            <div style="width:8px;height:8px;background:white;border-radius:50%;transform:rotate(45deg);"></div>
          </div>
        </div>`,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        className: "",
      });

      pendingMarkerRef.current = L.marker(
        [latlng.latitude, latlng.longitude],
        { icon, zIndexOffset: 1000 },
      ).addTo(map);
    },
    [],
  );

  const flyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo([lat, lng], 17, { duration: 0.8 });
  }, []);

  return { mapRef, syncMarkers, setPendingPin, flyTo };
}