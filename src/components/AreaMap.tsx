"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource } from "maplibre-gl";
import type { Area, Place } from "@/lib/types";
import Spinner from "./Spinner";

// 無料の地図（OpenFreeMap。カード登録・キー不要）。要件定義 Q1
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const PIN = "#c9a47b";

type Props = {
  area: Area;
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBackgroundClick?: () => void; // ピン以外の所（地図そのもの）をタップした時
};

export default function AreaMap({ area, places, selectedId, onSelect, onBackgroundClick }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onBackgroundRef = useRef(onBackgroundClick);
  onBackgroundRef.current = onBackgroundClick;
  const placesRef = useRef(places);
  placesRef.current = places;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const [lng, lat] = area.center;
  const [loading, setLoading] = useState(true); // 地図の読み込みが終わるまでスピナー

  // 地図を1回だけ作る
  useEffect(() => {
    if (!box.current) return;
    const map = new maplibregl.Map({
      container: box.current,
      style: STYLE_URL,
      center: [lng, lat],
      zoom: area.zoom,
      attributionControl: false,
    });
    // スマホでは下にシートが重なるので、ボタンとクレジット（OSM・OpenFreeMap）は右上に出す
    // スマホでは下にシート、PCでは右に詳細が重なるので、ボタンとクレジット（OSM・OpenFreeMap）は左上に出す
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "top-left");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
    mapRef.current = map;

    map.on("load", () => {
      setLoading(false);
      // 地図の文字を日本語にする（日本語の名前がない所は元の名前）
      for (const layer of map.getStyle().layers) {
        if (layer.type !== "symbol") continue;
        const tf = map.getLayoutProperty(layer.id, "text-field");
        // 道路番号（ref）や番地（housenumber）のラベルはそのまま
        if (tf && JSON.stringify(tf).includes("name")) {
          map.setLayoutProperty(layer.id, "text-field", ["coalesce", ["get", "name:ja"], ["get", "name"]]);
        }
      }
      map.addSource("places", {
        type: "geojson",
        data: toGeoJSON(placesRef.current),
        cluster: true, // ピンが重なったら数字でまとめる
        clusterRadius: 44,
      });
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "places",
        filter: ["has", "point_count"],
        paint: { "circle-color": "#6f9b88", "circle-radius": 20, "circle-stroke-width": 3, "circle-stroke-color": "#fff" },
      });
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "places",
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Noto Sans Bold"], "text-size": 14 },
        paint: { "text-color": "#fff" },
      });
      map.addLayer({
        id: "pins",
        type: "circle",
        source: "places",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": PIN,
          "circle-radius": ["case", ["==", ["get", "id"], selectedIdOrEmpty(selectedRef.current)], 13, 10],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", "pins", (e) => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") onSelectRef.current(id);
      });
      // ピンやまとまり以外をタップした時（ドラッグで動かした時は click にならない）
      map.on("click", (e) => {
        const hit = map.queryRenderedFeatures(e.point, { layers: ["pins", "clusters"] });
        if (hit.length === 0) onBackgroundRef.current?.();
      });
      map.on("click", "clusters", async (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const src = map.getSource("places") as GeoJSONSource;
        const zoom = await src.getClusterExpansionZoom(f.properties.cluster_id);
        map.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
      });
      // ?place=〜 で開いた時は、その場所へ寄る
      const first = placesRef.current.find((x) => x.id === selectedRef.current);
      if (first) map.jumpTo({ center: [first.lng, first.lat], zoom: Math.max(map.getZoom(), 14), padding: detailPadding(map) });

      for (const layer of ["pins", "clusters"]) {
        map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
      }
    });

    // 一覧やシートの開け閉めで地図の大きさが変わった時に描き直す
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(box.current);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // area はサーバーから毎回新しいオブジェクトで届くので、値で比べる（同じなら作り直さない）
  }, [lng, lat, area.zoom]);

  // 場所が変わったらピンを描き直す
  useEffect(() => {
    const src = mapRef.current?.getSource("places") as GeoJSONSource | undefined;
    src?.setData(toGeoJSON(places));
  }, [places]);

  // 選んだピンを大きくし、地図の真ん中に寄せる
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("pins")) return;
    map.setPaintProperty("pins", "circle-radius", [
      "case",
      ["==", ["get", "id"], selectedIdOrEmpty(selectedId)],
      13,
      10,
    ]);
    const p = placesRef.current.find((x) => x.id === selectedId);
    if (p) map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 13), padding: detailPadding(map) });
  }, [selectedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={box} className="h-full w-full" aria-label={`${area.name}の地図`} />
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-cream/80">
          <Spinner label="地図を読み込み中" />
        </div>
      )}
    </div>
  );
}

// 詳細が重なる分だけ余白をとり、選んだピンが見える所に来るようにする
function detailPadding(map: maplibregl.Map) {
  const { clientWidth: w, clientHeight: h } = map.getContainer();
  if (window.innerWidth >= 1024) return { top: 0, bottom: 0, left: 0, right: Math.min(420, w / 2) }; // 右の詳細パネル
  // 下のシート（最大で画面の高さの72%）に隠れない、上の帯の真ん中に寄せる
  const sheet = Math.min(window.innerHeight * 0.72, h - 80);
  return { top: 0, bottom: Math.max(0, Math.round(sheet)), left: 0, right: 0 };
}

function selectedIdOrEmpty(id: string | null) {
  return id ?? "";
}

function toGeoJSON(places: Place[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: places.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, name: p.name },
    })),
  };
}
