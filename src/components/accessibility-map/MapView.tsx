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
      border: 2.5px solid white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 11px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      cursor: pointer;
      transition: transform 0.15s ease;
    ">${score.toFixed(1)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
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

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
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
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '300px' }} />
      {currentView === 'submit' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-full shadow-md px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-100">
          {t('clickMap', language)}
        </div>
      )}
      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-sm px-2.5 py-2 border border-gray-100">
        <p className="text-[10px] font-semibold text-gray-500 mb-1">
          {language === 'en' ? 'Accessibility' : 'إمكانية الوصول'}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-[10px] text-gray-500">{language === 'en' ? 'Low' : 'ضعيف'}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="text-[10px] text-gray-500">{language === 'en' ? 'Med' : 'متوسط'}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-500">{language === 'en' ? 'Good' : 'جيد'}</span>
        </div>
      </div>
    </div>
  );
}
