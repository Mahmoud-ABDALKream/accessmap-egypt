'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

function getScoreColor(score: number): string {
  if (score >= 4) return '#16a34a'; // green
  if (score >= 2.5) return '#ca8a04'; // yellow/amber
  return '#dc2626'; // red
}

function createScoreIcon(score: number): L.DivIcon {
  const color = getScoreColor(score);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.15s ease;
    ">${score.toFixed(1)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>(L.layerGroup());
  const { places, setSelectedPlace, currentView, setSubmitCoords, language } = useAppStore();

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    if (currentView === 'submit') {
      setSubmitCoords(e.latlng.lat, e.latlng.lng);
    }
  }, [currentView, setSubmitCoords]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [31.2001, 29.9187], // Alexandria
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Add zoom control to bottom-left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current.addTo(map);

    map.on('click', handleMapClick);

    mapRef.current = map;

    // Important: invalidate size after mount to ensure map renders correctly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map click handler when view changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.off('click');
    mapRef.current.on('click', handleMapClick);
  }, [handleMapClick]);

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.clearLayers();

    places.forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude], {
        icon: createScoreIcon(place.overallScore),
        title: language === 'ar' && place.nameAr ? place.nameAr : place.name,
      });

      marker.on('click', () => {
        setSelectedPlace(place);
        if (mapRef.current) {
          mapRef.current.panTo([place.latitude, place.longitude], { animate: true });
        }
      });

      markersRef.current.addLayer(marker);
    });
  }, [places, setSelectedPlace, language]);

  // Switch map center based on city filter
  const cityFilter = useAppStore((s) => s.cityFilter);
  useEffect(() => {
    if (!mapRef.current) return;
    if (cityFilter === 'cairo') {
      mapRef.current.flyTo([30.0444, 31.2357], 12, { duration: 1.5 });
    } else if (cityFilter === 'alexandria') {
      mapRef.current.flyTo([31.2001, 29.9187], 13, { duration: 1.5 });
    }
  }, [cityFilter]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
      {currentView === 'submit' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-full shadow-lg px-4 py-2 text-xs font-medium text-teal-700 border border-teal-200">
          {t('clickMap', language)}
        </div>
      )}
      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-3 py-2.5 border border-gray-200">
        <p className="text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          {language === 'en' ? 'Accessibility' : 'إمكانية الوصول'}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-[11px] text-gray-600">{language === 'en' ? 'Low' : 'ضعيف'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-[11px] text-gray-600">{language === 'en' ? 'Medium' : 'متوسط'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-[11px] text-gray-600">{language === 'en' ? 'Good' : 'جيد'}</span>
        </div>
      </div>
    </div>
  );
}
