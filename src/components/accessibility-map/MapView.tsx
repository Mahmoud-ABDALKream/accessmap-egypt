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

function getScoreBgColor(score: number): string {
  if (score >= 4) return '#dcfce7'; // green-100
  if (score >= 2.5) return '#fef9c3'; // yellow-100
  return '#fee2e2'; // red-100
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'museum': return '🏛️';
    case 'monument': return '🗿';
    case 'mosque': return '🕌';
    case 'park': return '🌳';
    case 'mall': return '🛍️';
    case 'hotel': return '🏨';
    case 'market': return '🏪';
    case 'hospital': return '🏥';
    case 'cafe': return '☕';
    case 'school': return '🏫';
    case 'government': return '🏛️';
    case 'transport': return '🚉';
    case 'entertainment': return '🎭';
    default: return '📍';
  }
}

function createScoreIcon(score: number, category: string): L.DivIcon {
  const color = getScoreColor(score);
  const bgColor = getScoreBgColor(score);
  const emoji = getCategoryEmoji(category);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      position: relative;
      cursor: pointer;
      transition: transform 0.15s ease;
    " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
      <div style="
        background-color: ${bgColor};
        border: 2.5px solid ${color};
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 0 0 3px rgba(255,255,255,0.8);
        position: relative;
      ">
        <span style="font-size: 16px; line-height: 1;">${emoji}</span>
      </div>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${color};
        color: white;
        font-size: 9px;
        font-weight: 700;
        padding: 1px 4px;
        border-radius: 6px;
        line-height: 1.2;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        white-space: nowrap;
      ">${score.toFixed(1)}</div>
    </div>`,
    iconSize: [38, 48],
    iconAnchor: [19, 38],
    popupAnchor: [0, -42],
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
      center: [30.0444, 31.2357], // Cairo center - shows both cities
      zoom: 10,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Add zoom control to bottom-left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Use a cleaner, more modern map style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
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
        icon: createScoreIcon(place.overallScore, place.category),
        title: language === 'ar' && place.nameAr ? place.nameAr : place.name,
      });

      marker.on('click', () => {
        setSelectedPlace(place);
        if (mapRef.current) {
          mapRef.current.flyTo([place.latitude, place.longitude], 14, { animate: true, duration: 0.8 });
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
      mapRef.current.flyTo([30.0444, 31.2357], 12, { duration: 1.2 });
    } else if (cityFilter === 'alexandria') {
      mapRef.current.flyTo([31.2001, 29.9187], 12, { duration: 1.2 });
    } else if (cityFilter === 'giza') {
      mapRef.current.flyTo([29.9765, 31.1313], 12, { duration: 1.2 });
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
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-200">
        <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">
          {language === 'en' ? 'Accessibility Score' : 'تقييم إمكانية الوصول'}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100" />
          <span className="text-[11px] text-gray-600">{language === 'en' ? 'Poor (0-2.4)' : 'ضعيف (0-2.4)'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-100" />
          <span className="text-[11px] text-gray-600">{language === 'en' ? 'Moderate (2.5-3.9)' : 'متوسط (2.5-3.9)'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-100" />
          <span className="text-[11px] text-gray-600">{language === 'en' ? 'Good (4-5)' : 'جيد (4-5)'}</span>
        </div>
      </div>
    </div>
  );
}
