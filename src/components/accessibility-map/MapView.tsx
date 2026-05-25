'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { useAppStore, type PlaceData } from '@/lib/store';
import { t } from '@/lib/i18n';

// ─── Color helpers ───────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 4) return '#16a34a';
  if (score >= 2.5) return '#ca8a04';
  return '#dc2626';
}

function getScoreLabel(score: number, lang: 'en' | 'ar'): string {
  if (score >= 4) return lang === 'en' ? 'Good' : 'جيد';
  if (score >= 2.5) return lang === 'en' ? 'Moderate' : 'متوسط';
  return lang === 'en' ? 'Poor' : 'ضعيف';
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    museum: '🏛️', monument: '🗿', mosque: '🕌', park: '🌳',
    mall: '🛍️', hotel: '🏨', market: '🏪', hospital: '🏥',
    cafe: '☕', school: '🏫', government: '🏛️', transport: '🚉',
    entertainment: '🎭',
  };
  return map[category] || '📍';
}

// ─── SVG Pin Marker ─────────────────────────────────────────────────────────

function createPinIcon(score: number, category: string, isSelected: boolean): L.DivIcon {
  const color = getScoreColor(score);
  const emoji = getCategoryEmoji(category);
  const h = isSelected ? 44 : 36;
  const w = isSelected ? 30 : 26;
  const tipY = h;
  const circleR = isSelected ? 11 : 9;
  const circleCY = circleR + 4;
  const scoreFS = isSelected ? 10 : 9;
  const pinPath = `M ${w / 2},${tipY} C ${w / 2},${tipY} ${w * 0.15},${circleCY + circleR + 2} ${w * 0.15},${circleCY} A ${circleR},${circleR} 0 1,1 ${w * 0.85},${circleCY} C ${w * 0.85},${circleCY + circleR + 2} ${w / 2},${tipY} ${w / 2},${tipY} Z`;

  const cls = isSelected ? 'map-pin map-pin--selected' : 'map-pin';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${cls}" data-score-color="${color}">
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pin-shadow-${score.toFixed(1)}" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <path d="${pinPath}" fill="${color}" filter="url(#pin-shadow-${score.toFixed(1)})" stroke="#fff" stroke-width="1.5"/>
      </svg>
      <span class="map-pin__score" style="font-size:${scoreFS}px;color:#fff;">${score.toFixed(1)}</span>
      ${isSelected ? '<span class="map-pin__pulse" style="--pulse-color:' + color + '"></span>' : ''}
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h - 4],
  });
}

// ─── Popup HTML ──────────────────────────────────────────────────────────────

function createPopupHTML(place: PlaceData, lang: 'en' | 'ar'): string {
  const color = getScoreColor(place.overallScore);
  const emoji = getCategoryEmoji(place.category);
  const label = getScoreLabel(place.overallScore, lang);
  const name = lang === 'ar' && place.nameAr ? place.nameAr : place.name;
  const nameSub = lang === 'ar' ? place.name : place.nameAr || '';

  const criteria = [
    { key: 'rampScore', emoji: '🦽', label: t('rampScore', lang) },
    { key: 'elevatorScore', emoji: '🛗', label: t('elevatorScore', lang) },
    { key: 'bathroomScore', emoji: '🚻', label: t('bathroomScore', lang) },
    { key: 'parkingScore', emoji: '🅿️', label: t('parkingScore', lang) },
    { key: 'entranceScore', emoji: '🚪', label: t('entranceScore', lang) },
  ];

  const barsHTML = criteria.map((c) => {
    const val = place[c.key as keyof PlaceData] as number;
    const pct = (val / 5) * 100;
    const barColor = getScoreColor(val);
    return `<div class="popup-bar-row">
      <span class="popup-bar-emoji">${c.emoji}</span>
      <span class="popup-bar-label">${c.label}</span>
      <div class="popup-bar-track"><div class="popup-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
      <span class="popup-bar-val">${val.toFixed(1)}</span>
    </div>`;
  }).join('');

  const viewDetailsText = lang === 'en' ? 'View Details' : 'عرض التفاصيل';

  return `<div class="access-popup">
    <div class="access-popup__header">
      <div class="access-popup__name">${name}</div>
      ${nameSub ? `<div class="access-popup__name-ar">${nameSub}</div>` : ''}
      <div class="access-popup__badge">${emoji} ${place.category}</div>
    </div>
    <div class="access-popup__score-row">
      <div class="access-popup__score-circle" style="background:${color}">
        <span class="access-popup__score-num">${place.overallScore.toFixed(1)}</span>
      </div>
      <span class="access-popup__score-label" style="color:${color}">${label}</span>
    </div>
    <div class="access-popup__bars">${barsHTML}</div>
    <button class="access-popup__btn" data-place-id="${place.id}">${viewDetailsText}</button>
  </div>`;
}

// ─── Tile layer definitions ──────────────────────────────────────────────────

interface TileDef {
  name: string;
  url: string;
  opts: L.TileLayerOptions;
}

const TILE_LAYERS: Record<string, TileDef> = {
  voyager: {
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    opts: { maxZoom: 19, attribution: '' },
  },
  light: {
    name: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    opts: { maxZoom: 19, attribution: '' },
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    opts: { maxZoom: 18, attribution: '' },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

type MapStyle = 'voyager' | 'light' | 'satellite';

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('voyager');
  const [locating, setLocating] = useState(false);

  const { places, selectedPlace, sidebarOpen, setSelectedPlace, currentView, setSubmitCoords, language } = useAppStore();

  // ─── Map click handler ──────────────────────────────────────────────────
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (currentView === 'submit') {
      setSubmitCoords(e.latlng.lat, e.latlng.lng);
    }
  }, [currentView, setSubmitCoords]);

  // ─── Popup click delegation ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const target = (e.target as HTMLElement).closest('.access-popup__btn') as HTMLElement | null;
      if (!target) return;
      const placeId = target.dataset.placeId;
      if (!placeId) return;
      const place = places.find((p) => p.id === placeId);
      if (place) {
        setSelectedPlace(place);
        if (mapRef.current) {
          mapRef.current.flyTo([place.latitude, place.longitude], 14, { animate: true, duration: 0.8 });
        }
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [places, setSelectedPlace]);

  // ─── Initialize map ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30.0444, 31.2357],
      zoom: 10,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const initial = TILE_LAYERS.voyager;
    const tileLayer = L.tileLayer(initial.url, {
      ...initial.opts,
      attribution: '<span class="map-attribution">&copy; OSM &copy; CARTO</span>',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Marker cluster group
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction(cluster) {
        const count = cluster.getChildCount();
        let size = 'small';
        let dim = 36;
        if (count >= 100) { size = 'large'; dim = 48; }
        else if (count >= 10) { size = 'medium'; dim = 42; }
        return L.divIcon({
          html: `<div class="cluster-icon cluster-icon--${size}"><span>${count}</span></div>`,
          className: 'custom-cluster',
          iconSize: L.point(dim, dim),
        });
      },
    });
    cluster.addTo(map);
    clusterRef.current = cluster;

    // Handle cluster marker clicks
    cluster.on('click', (e: L.LeafletEvent) => {
      const marker = (e as L.LeafletMouseEvent).layer as L.Marker;
      const placeId = marker.getPopup()?.getContent() ? undefined : undefined;
      void placeId;
    });

    map.on('click', handleMapClick);
    mapRef.current = map;

    const timer = setTimeout(() => { map.invalidateSize(); }, 100);

    return () => {
      clearTimeout(timer);
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // ─── Update map click handler ───────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.off('click');
    mapRef.current.on('click', handleMapClick);
  }, [handleMapClick]);

  // ─── Update markers when places / selection change ──────────────────────
  useEffect(() => {
    if (!mapRef.current || !clusterRef.current) return;
    const cluster = clusterRef.current;
    cluster.clearLayers();

    const isSelected = (place: PlaceData) =>
      sidebarOpen && selectedPlace?.id === place.id;

    places.forEach((place) => {
      const selected = isSelected(place);
      const icon = createPinIcon(place.overallScore, place.category, selected);
      const title = language === 'ar' && place.nameAr ? place.nameAr : place.name;

      const marker = L.marker([place.latitude, place.longitude], { icon, title });

      const popup = L.popup({
        className: 'access-popup-wrapper',
        closeButton: true,
        maxWidth: 260,
        minWidth: 220,
        offset: [0, -4],
      }).setContent(createPopupHTML(place, language));

      marker.bindPopup(popup);

      marker.on('click', () => {
        setSelectedPlace(place);
        if (mapRef.current) {
          mapRef.current.flyTo([place.latitude, place.longitude], 14, { animate: true, duration: 0.8 });
        }
      });

      cluster.addLayer(marker);
    });

    // If selected place is present, open its popup
    if (sidebarOpen && selectedPlace) {
      cluster.eachLayer((layer) => {
        const m = layer as L.Marker;
        const latlng = m.getLatLng();
        if (
          Math.abs(latlng.lat - selectedPlace.latitude) < 0.0001 &&
          Math.abs(latlng.lng - selectedPlace.longitude) < 0.0001
        ) {
          m.openPopup();
        }
      });
    }
  }, [places, selectedPlace, sidebarOpen, setSelectedPlace, language]);

  // ─── Switch tile layer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    const def = TILE_LAYERS[mapStyle];
    if (!def) return;

    tileLayerRef.current.remove();
    const newTile = L.tileLayer(def.url, {
      ...def.opts,
      attribution: '<span class="map-attribution">&copy; OSM &copy; CARTO</span>',
    }).addTo(mapRef.current);
    tileLayerRef.current = newTile;
  }, [mapStyle]);

  // ─── City filter fly-to ─────────────────────────────────────────────────
  const cityFilter = useAppStore((s) => s.cityFilter);
  useEffect(() => {
    if (!mapRef.current) return;
    if (cityFilter === 'cairo') mapRef.current.flyTo([30.0444, 31.2357], 12, { duration: 0.8 });
    else if (cityFilter === 'alexandria') mapRef.current.flyTo([31.2001, 29.9187], 12, { duration: 0.8 });
    else if (cityFilter === 'giza') mapRef.current.flyTo([29.9765, 31.1313], 12, { duration: 0.8 });
  }, [cityFilter]);

  // ─── Locate me handler ──────────────────────────────────────────────────
  const handleLocateMe = useCallback(() => {
    if (!mapRef.current || locating) return;
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 14, { duration: 0.8 });
        setLocating(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [locating]);

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />

      {/* ── Submit mode banner ── */}
      {currentView === 'submit' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-full shadow-lg px-5 py-2 text-xs font-semibold text-teal-700 border border-teal-200 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          {t('clickMap', language)}
        </div>
      )}

      {/* ── Map style switcher ── */}
      <div className="absolute top-3 left-3 z-[1000] flex rounded-lg overflow-hidden shadow-md border border-gray-200/80 bg-white/90 backdrop-blur-sm">
        {(['voyager', 'light', 'satellite'] as MapStyle[]).map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              mapStyle === style
                ? 'bg-teal-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {TILE_LAYERS[style].name}
          </button>
        ))}
      </div>

      {/* ── Locate me button ── */}
      <button
        onClick={handleLocateMe}
        disabled={locating}
        className="absolute bottom-24 right-3 z-[1000] w-10 h-10 rounded-full bg-white shadow-md border border-gray-200/80 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
        title={language === 'en' ? 'My Location' : 'موقعي'}
        aria-label={language === 'en' ? 'My Location' : 'موقعي'}
      >
        {locating ? (
          <svg className="w-5 h-5 animate-spin text-teal-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        )}
      </button>

      {/* ── Legend (glassmorphism) ── */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-3.5 min-w-[150px]">
        <p className="text-[10px] font-bold text-gray-500 mb-2.5 uppercase tracking-widest">
          {language === 'en' ? 'Accessibility' : 'إمكانية الوصول'}
        </p>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm shadow-red-200" />
          <span className="text-[11px] text-gray-700 font-medium">
            {language === 'en' ? 'Poor (0–2.4)' : 'ضعيف (0–2.4)'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
          <span className="text-[11px] text-gray-700 font-medium">
            {language === 'en' ? 'Moderate (2.5–3.9)' : 'متوسط (2.5–3.9)'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <span className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm shadow-green-200" />
          <span className="text-[11px] text-gray-700 font-medium">
            {language === 'en' ? 'Good (4–5)' : 'جيد (4–5)'}
          </span>
        </div>
      </div>
    </div>
  );
}
