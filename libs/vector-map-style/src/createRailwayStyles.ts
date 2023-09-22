import { fromPairs } from 'lodash'
import { type Expression } from 'mapbox-gl'

import {
  type LayerId,
  type LayerStyles,
  type LineLayerStyle
} from './createStyle'

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

const filters: { [K in LayerId]?: Expression } = fromPairs(
  [...Array(5)].map((_, index) => [
    `鉄道中心線橋ククリ白${index}`,
    [
      'all',
      ['!=', ['get', 'vt_rtcode'], 'JR'],
      ['in', ['get', 'vt_railstate'], '橋・高架'],
      ['!=', ['get', 'vt_sngldbl'], '駅部分'],
      ['==', ['get', 'vt_lvorder'], index]
    ]
  ])
)

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
    maxZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': opacity,
      'line-width': [
        'let',
        'width',
        width,
        'constantWidth',
        ['match', ['get', 'vt_rtcode'], 'JR', 6, 3],
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          14,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 14)],
          15,
          ['var', 'constantWidth'],
          23,
          ['var', 'constantWidth']
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
        ['*', width, 3],
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          14,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 14)],
          15,
          12,
          23,
          12
        ]
      ],
      'line-dasharray': ['literal', [0.2, 2]]
    }
  }

  const jrDashStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
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
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          14,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 14)],
          15,
          4,
          23,
          4
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
      'line-width': 8,
      'line-dasharray': ['literal', [0.1, 1]]
    }
  }

  return {
    '鉄道中心線ZL4-10': simplifiedStyle,

    // Background lines
    鉄道中心線0: backgroundStyle,
    鉄道中心線橋ククリ黒0: backgroundStyle,
    鉄道中心線1: backgroundStyle,
    鉄道中心線橋ククリ黒1: backgroundStyle,
    鉄道中心線2: backgroundStyle,
    鉄道中心線橋ククリ黒2: backgroundStyle,
    鉄道中心線3: backgroundStyle,
    鉄道中心線橋ククリ黒3: backgroundStyle,
    鉄道中心線4: backgroundStyle,
    鉄道中心線橋ククリ黒4: backgroundStyle,

    // Centerlines
    railwayCenterline0: lineStyle,
    鉄道中心線橋0: lineStyle,
    railwayCenterline1: lineStyle,
    鉄道中心線橋1: lineStyle,
    railwayCenterline2: lineStyle,
    鉄道中心線橋2: lineStyle,
    railwayCenterline3: lineStyle,
    鉄道中心線橋3: lineStyle,
    railwayCenterline4: lineStyle,
    鉄道中心線橋4: lineStyle,

    // Dashes
    railwayDash0: dashStyle,
    鉄道中心線橋ククリ白0: {
      ...dashStyle,
      filter: filters.鉄道中心線橋ククリ白0
    },
    railwayDash1: dashStyle,
    鉄道中心線橋ククリ白1: {
      ...dashStyle,
      filter: filters.鉄道中心線橋ククリ白1
    },
    railwayDash2: dashStyle,
    鉄道中心線橋ククリ白2: {
      ...dashStyle,
      filter: filters.鉄道中心線橋ククリ白2
    },
    railwayDash3: dashStyle,
    鉄道中心線橋ククリ白3: {
      ...dashStyle,
      filter: filters.鉄道中心線橋ククリ白3
    },
    railwayDash4: dashStyle,
    鉄道中心線橋ククリ白4: {
      ...dashStyle,
      filter: filters.鉄道中心線橋ククリ白4
    },

    // JR dashes
    鉄道中心線旗竿0: jrDashStyle,
    鉄道中心線旗竿橋0: jrDashStyle,
    鉄道中心線旗竿1: jrDashStyle,
    鉄道中心線旗竿橋1: jrDashStyle,
    鉄道中心線旗竿2: jrDashStyle,
    鉄道中心線旗竿橋2: jrDashStyle,
    鉄道中心線旗竿3: jrDashStyle,
    鉄道中心線旗竿橋3: jrDashStyle,
    鉄道中心線旗竿4: jrDashStyle,
    鉄道中心線旗竿橋4: jrDashStyle,

    // Detailed centerlines and dashes
    軌道の中心線: centerlineStyle,
    railwayTrackCenterlineDash: centerlineDashStyle,

    // Stations
    鉄道中心線駅ククリ0: stationStyle,
    鉄道中心線橋駅ククリ0: stationStyle,
    鉄道中心線駅ククリ1: stationStyle,
    鉄道中心線橋駅ククリ1: stationStyle,
    鉄道中心線駅ククリ2: stationStyle,
    鉄道中心線橋駅ククリ2: stationStyle,
    鉄道中心線駅ククリ3: stationStyle,
    鉄道中心線橋駅ククリ3: stationStyle,
    鉄道中心線駅ククリ4: stationStyle,
    鉄道中心線橋駅ククリ4: stationStyle
  }
}
