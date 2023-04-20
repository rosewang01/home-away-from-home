/* eslint-disable */
import type {FillLayer, LineLayer} from 'react-map-gl';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const StateDataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  minzoom: 3,
  maxzoom: 9,
  paint: {
    'fill-color': 'transparent',
    'fill-outline-color': 'rgba(59, 130, 246, 1)',
    // 'fill-color': {
    //   property: 'percentile',
    //   stops: [
    //     [0, '#3288bd'],
    //     [1, '#66c2a5'],
    //     [2, '#abdda4'],
    //     [3, '#e6f598'],
    //     [4, '#ffffbf'],
    //     [5, '#fee08b'],
    //     [6, '#fdae61'],
    //     [7, '#f46d43'],
    //     [8, '#d53e4f']
    //   ]
    // },
    'fill-opacity': 0.5
  }
};

export const StateDataLineLayer: LineLayer = {
  id: 'outline',
  type: 'line',
  paint: {
    'line-color': 'rgba(59, 130, 246, 0.7)',
    'line-width': 2
  }
};

export const StateDataHighlightedLayer: FillLayer = {
  id: 'data-highlighted',
  type: 'fill',
  source: 'data',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#FFFFFF',
    'fill-opacity': 0.7
  }
};