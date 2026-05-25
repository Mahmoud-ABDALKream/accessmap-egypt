'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

// Fix Leaflet default marker icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getScoreColor(score: number): string {
  if (score >= 4) return '#22c55e'; // green
  if (score >= 2.5) return '#eab308'; // yellow
  return '#ef4444'; // red
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
      font-weight: bold;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    ">${score.toFixed(1)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
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
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current.addTo(map);

    map.on('click', handleMapClick);

    mapRef.current = map;

    // Force a resize after mount to fix any rendering issues
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

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
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      {currentView === 'submit' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-teal-700 border border-teal-200">
          {t('clickMap', language)}
        </div>
      )}
    </div>
  );
}
