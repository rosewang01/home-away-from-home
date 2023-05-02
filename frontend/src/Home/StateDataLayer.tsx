/* eslint-disable */
import type { FillLayer, LineLayer, HeatmapLayer } from 'react-map-gl';

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


export const GrowthDataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(59, 130, 246, 1)',
    'fill-color': {
      property: 'growth',
      stops: [
        [5, '#f5f9ff'],
        [8, '#cee0fd'],
        [10, '#a7c7fb'],
        [12, '#80aef9'],
        [14, '#5995f7'],
        [16, '#0b64f4'],
        [18, '#0b64f4'],
        [20, '#0b64f4'],
        [22, '#0b64f4'],
      ],
    },
    'fill-opacity': 0.5,
  },
};

export const DebtDataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(59, 130, 246, 1)',
    'fill-color': {
      property: 'debt',
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

export const VolumeDataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(59, 130, 246, 1)',
    'fill-color': {
      property: 'H1B_volume_normalized',
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

export const  SuccessRateLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-outline-color': 'rgba(59, 130, 246, 1)',
    'fill-color': {
      property: 'H1B_success_rate',
      stops: [
        [60, '#f5f9ff'],
        [70, '#cee0fd'],
        [80, '#a7c7fb'],
        [86, '#80aef9'],
        [87, '#5995f7'],
        [88, '#0b64f4'],
        [89, '#0b64f4'],
        [95, '#0b64f4'],
        [100, '#0b64f4'],
      ],
    },
    'fill-opacity': 0.5,
  },
};


