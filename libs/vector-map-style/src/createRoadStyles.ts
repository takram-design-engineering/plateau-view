import { type Expression } from 'mapbox-gl'

import { type LayerStyles, type LineLayerStyle } from './createStyle'
import { sequenceKeys } from './helpers'

const opacity: Expression = [
  'match',
  ['get', 'vt_code'],
  [2704, 2714, 2724, 2734], // Tunnels
  0.5,
  1
]

const simplifiedWidth: Expression = [
  'case',
  ['==', ['get', 'vt_motorway'], 1],
  2,
  [
    'match',
    ['get', 'vt_rdctg'],
    '高速自動車国道等',
    2,
    ['国道', '主要道路'],
    1.5,
    '都道府県道',
    1.5,
    1
  ]
]

const width: Expression = [
  'case',
  ['has', 'vt_width'],
  ['get', 'vt_width'],
  [
    'case',
    ['has', 'vt_rnkwidth'],
    [
      'match',
      ['get', 'vt_rnkwidth'],
      '3m未満',
      300,
      '3m-5.5m未満',
      450,
      '5.5m-13m未満',
      900,
      '13m-19.5m未満',
      1800,
      '19.5m以上',
      2700,
      0
    ],
    3000
  ]
]

export interface RoadStylesOptions {
  roadColor: string
  majorRoadColor?: string
  highwayColor?: string
  roadOutlineColor: string
  majorRoadOutlineColor?: string
  highwayOutlineColor?: string
}

export function createRoadStyles(options: RoadStylesOptions): LayerStyles {
  const color: Expression = [
    'case',
    ['==', ['get', 'vt_motorway'], 1],
    options.highwayColor ?? options.roadColor,
    [
      'match',
      ['get', 'vt_rdctg'],
      '高速自動車国道等',
      options.highwayColor ?? options.roadColor,
      ['国道', '主要道路', '都道府県道'],
      options.majorRoadColor ?? options.roadColor,
      options.roadColor
    ]
  ]
  const outlineColor: Expression = [
    'case',
    ['==', ['get', 'vt_motorway'], 1],
    options.highwayOutlineColor ?? options.roadOutlineColor,
    [
      'match',
      ['get', 'vt_rdctg'],
      '高速自動車国道等',
      options.highwayOutlineColor ?? options.roadOutlineColor,
      ['国道', '主要道路', '都道府県道'],
      options.majorRoadOutlineColor ?? options.roadOutlineColor,
      options.roadOutlineColor
    ]
  ]
  const simplifiedStyle: LineLayerStyle = {
    minZoom: null,
    paint: {
      'line-color': color,
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
  const style: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': color,
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
    },
    layout: {
      'line-cap': 'butt'
    }
  }
  const outlineStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': outlineColor,
      'line-opacity': opacity,
      'line-width': [
        'let',
        'width',
        width,
        'outlineWidth',
        3,
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          [
            '+',
            ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
            ['var', 'outlineWidth']
          ],
          23,
          ['+', ['var', 'width'], ['var', 'outlineWidth']]
        ]
      ]
    },
    layout: {
      'line-cap': 'butt'
    }
  }

  return {
    '道路中心線ZL4-10国道': simplifiedStyle,
    '道路中心線ZL4-10高速': simplifiedStyle,
    ...sequenceKeys(5, {
      道路中心線ククリ: outlineStyle,
      道路中心線ククリ橋: outlineStyle,
      道路中心線色: style,
      道路中心線色橋: style
    })
  }
}
