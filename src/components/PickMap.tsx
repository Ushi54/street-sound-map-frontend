"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

type Props = {
  center: [number, number];
  zoom: number;
  value: [number, number] | null; // [経度, 緯度]
  onChange: (v: [number, number]) => void;
};

// 投稿の位置を決める地図。押した所にピンを置き、ピンはドラッグで動かせる
export default function PickMap({ center, zoom, value, onChange }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const initial = useRef({ center: value ?? center, zoom: value ? 15 : zoom });

  useEffect(() => {
    if (!box.current) return;
    const map = new maplibregl.Map({
      container: box.current,
      style: STYLE_URL,
      center: initial.current.center,
      zoom: initial.current.zoom,
      attributionControl: false,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "top-right");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => {
      for (const layer of map.getStyle().layers) {
        if (layer.type !== "symbol") continue;
        const tf = map.getLayoutProperty(layer.id, "text-field");
        if (tf && JSON.stringify(tf).includes("name")) {
          map.setLayoutProperty(layer.id, "text-field", ["coalesce", ["get", "name:ja"], ["get", "name"]]);
        }
      }
    });
    map.on("click", (e) => onChangeRef.current([e.lngLat.lng, e.lngLat.lat]));
    mapRef.current = map;
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(box.current);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // ピンを置く・動かす
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !value) return;
    if (!markerRef.current) {
      const m = new maplibregl.Marker({ color: "#c9a47b", draggable: true }).setLngLat(value).addTo(map);
      m.on("dragend", () => {
        const p = m.getLngLat();
        onChangeRef.current([p.lng, p.lat]);
      });
      markerRef.current = m;
    } else {
      markerRef.current.setLngLat(value);
    }
  }, [value]);

  return <div ref={box} className="h-full w-full" aria-label="位置を決める地図" />;
}
