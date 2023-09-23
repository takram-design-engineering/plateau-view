import { type Expression } from 'mapbox-gl'

import { type LayerStyles, type LineLayerStyle } from './createStyle'
import { sequenceKeys } from './helpers'

const opacity: Expression = ['match', ['get', 'vt_rtcode'], '地下鉄', 0.5, 1]

const simplifiedWidth: Expression = [
  'match',
  ['get', 'vt_rtcode'],
  '新幹線',
  2,
  'JR',
  2,
  'JR以外',
  2,
  '地下鉄',
  2,
  '路面',
  2,
  '索道',
  2,
  1
]

const width: Expression = [
  '*',
  [
    'match',
    ['get', 'vt_rtcode'],
    'JR',
    600,
    'JR以外',
    600,
    '地下鉄',
    500,
    '路面',
    400,
    '索道',
    400,
    '特殊鉄道',
    300,
    '側線',
    300,
    0
  ],
  [
    'case',
    ['in', ['get', 'vt_sngldbl'], ['literal', ['複線以上', '駅部分']]],
    2,
    1
  ]
]

export interface RailwayStylesOptions {
  railwayColor: string
  railwayBackgroundColor: string
  railwayJrDashColor: string
  stationColor: string
}

export function createRailwayStyles(
  options: RailwayStylesOptions
): LayerStyles {
  const simplifiedStyle: LineLayerStyle = {
    minZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': opacity,
      'line-width': [
        'let',
        'width',
        simplifiedWidth,
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          4,
          ['*', ['var', 'width'], 1 / 2 ** (11 - 4)],
          11,
          ['var', 'width']
        ]
      ]
    }
  }

  const backgroundStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayBackgroundColor,
      'line-opacity': opacity,
      'line-width': [
        'let',
        'width',
        width,
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          23,
          ['var', 'width']
        ]
      ]
    }
  }

  const stationStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.stationColor,
      'line-opacity': opacity,
      'line-width': [
        'let',
        'width',
        ['*', width, 3],
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          23,
          ['var', 'width']
        ]
      ]
    }
  }

  const lineStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: 16,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': opacity,
      'line-width': [
        'let',
        'width',
        width,
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          15,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 15)]
        ]
      ]
    }
  }

  const dashStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: 16,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': 1,
      'line-width': [
        'let',
        'width',
        ['*', width, 2],
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          15,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 15)]
        ]
      ],
      'line-dasharray': ['literal', [0.2, 2]]
    }
  }

  const jrDashStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: 16,
    paint: {
      'line-color': options.railwayJrDashColor ?? options.railwayColor,
      'line-opacity': 1,
      'line-width': [
        'let',
        'width',
        width,
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['-', ['*', ['var', 'width'], 1 / 2 ** (23 - 10)], 1],
          15,
          ['-', ['*', ['var', 'width'], 1 / 2 ** (23 - 15)], 1]
        ]
      ],
      'line-dasharray': ['literal', [5, 5]]
    }
  }

  const centerlineStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-width': 2
    }
  }

  const centerlineDashStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-width': 5,
      'line-dasharray': ['literal', [0.2, 2]]
    }
  }

  return {
    '鉄道中心線ZL4-10': simplifiedStyle,

    ...sequenceKeys(5, {
      // Background lines
      鉄道中心線: backgroundStyle,
      鉄道中心線橋ククリ黒: backgroundStyle,
      // Centerlines
      railwayCenterline: lineStyle,
      鉄道中心線橋: lineStyle,
      // Dashes
      railwayDash: dashStyle,
      鉄道中心線橋ククリ白: dashStyle,
      // JR dashes
      鉄道中心線旗竿: jrDashStyle,
      鉄道中心線旗竿橋: jrDashStyle,
      // Stations
      鉄道中心線駅ククリ: stationStyle,
      鉄道中心線橋駅ククリ: stationStyle
    }),

    // Detailed centerlines and dashes
    軌道の中心線: centerlineStyle,
    railwayTrackCenterlineDash: centerlineDashStyle
  }
}
