/* eslint-disable */
import type { FillLayer, LineLayer } from 'react-map-gl';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const StateDataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(59, 130, 246, 1)',
    'fill-color': {
      property: 'score',
      stops: [
        [0, '#f5f9ff'],
        [1, '#cee0fd'],
        [2, '#a7c7fb'],
        [3, '#80aef9'],
        [4, '#5995f7'],
        [5, '#0b64f4'],
        [6, '#0b64f4'],
        [7, '#0b64f4'],
        [8, '#0b64f4'],
      ],
    },
    'fill-opacity': 0.5,
  },
};

export const StateDataLineLayer: LineLayer = {
  id: 'outline',
  type: 'line',
  paint: {
    'line-color': 'rgba(59, 130, 246, 0.7)',
    'line-width': 2,
  },
};

export const StateDataHighlightedLayer: FillLayer = {
  id: 'data-highlighted',
  type: 'fill',
  source: 'data',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#FFFFFF',
    'fill-opacity': 0.7,
  },
};
