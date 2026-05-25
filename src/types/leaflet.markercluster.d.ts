import L from 'leaflet';

declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    maxClusterRadius?: number | ((zoom: number) => number);
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    singleMarkerMode?: boolean;
    disableClusteringAtZoom?: number;
    removeOutsideVisibleBounds?: boolean;
    animate?: boolean;
    animateAddingMarkers?: boolean;
    clusterHideOnZoom?: boolean;
    spiderLegPolylineOptions?: L.PolylineOptions;
    iconCreateFunction?: (cluster: L.MarkerCluster) => L.DivIcon;
    spiderfyShapePositions?: (count: number, centerPt: L.Point) => L.Point[];
  }

  interface MarkerCluster {
    getChildCount(): number;
    getAllChildMarkers(): L.Marker[];
    getBounds(): L.LatLngBounds;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;

  interface MarkerClusterGroup extends L.LayerGroup {
    addLayer(layer: L.Layer): this;
    removeLayer(layer: L.Layer): this;
    addLayers(layers: L.Layer[]): this;
    removeLayers(layers: L.Layer[]): this;
    clearLayers(): this;
    getVisibleParent(marker: L.Marker): L.Marker | null;
    refreshClusters(layers?: L.Layer[]): this;
    zoomToShowLayer(layer: L.Layer, callback?: () => void): void;
  }
}
