import { type Expression } from 'mapbox-gl'

import { type LayerStyles, type LineLayerStyle } from './createStyle'

type Color = string

export interface LayerStylesOptions {
  landColor: Color
  waterColor: Color
  seaRouteColor: Color
  municipalityBoundaryColor: Color
  prefectureBoundaryColor: Color
  minorRoadColor: Color
  majorRoadColor: Color
  highwayColor: Color
  railwayColor: Color
}

function createBoundaryStyles(options: LayerStylesOptions): LayerStyles {
  const dasharray = [2, 2, 0.01, 2]
  return {
    '行政区画界線25000所属界（所属を明示する境界線）': {
      paint: {
        'line-color': options.municipalityBoundaryColor,
        'line-width': 1,
        'line-dasharray': dasharray
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    行政区画界線25000市区町村界: {
      paint: {
        'line-color': options.municipalityBoundaryColor,
        'line-width': 1,
        'line-dasharray': dasharray
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    '行政区画界線25000都府県界及び北海道総合振興局・振興局界': {
      paint: {
        'line-color': options.prefectureBoundaryColor,
        'line-width': 1,
        'line-dasharray': dasharray
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    行政区画界線地方界: {
      paint: {
        'line-color': options.prefectureBoundaryColor,
        'line-width': 1,
        'line-opacity': 0.5
      }
    }
  }
}

function createLandWaterStyles(options: LayerStylesOptions): LayerStyles {
  return {
    background: {
      paint: {
        'background-color': [
          'step',
          ['zoom'],
          options.landColor,
          4,
          options.waterColor,
          8,
          options.landColor
        ]
      }
    },
    行政区画: {
      paint: {
        'fill-color': options.landColor
      }
    },
    水域: {
      maxZoom: null,
      paint: {
        'fill-color': options.waterColor
      }
    },
    河川中心線人工水路地下: {
      paint: {
        'line-color': options.waterColor,
        'line-width': 1,
        'line-opacity': 0.5
      }
    },
    河川中心線枯れ川部: {
      paint: {
        'line-color': options.waterColor,
        'line-width': 1,
        'line-opacity': 0.5
      }
    },
    水部表記線line: {
      paint: {
        'line-color': options.seaRouteColor,
        'line-width': 1
      }
    },
    水部構造物面: {
      paint: {
        'fill-color': options.landColor
      }
    }
  }
}

const roadOpacity: Expression = [
  'match',
  ['get', 'vt_code'],
  [2704, 2714, 2724, 2734], // Tunnels
  0.5,
  1
]

const majorRoadWidth: Expression = [
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

const minorRoadWidth: Expression = [
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

function createRoadStyles(options: LayerStylesOptions): LayerStyles {
  const color: Expression = [
    'case',
    ['==', ['get', 'vt_motorway'], 1],
    options.highwayColor,
    [
      'match',
      ['get', 'vt_rdctg'],
      '高速自動車国道等',
      options.highwayColor,
      ['国道', '主要道路', '都道府県道'],
      options.majorRoadColor,
      options.minorRoadColor
    ]
  ]
  const majorStyle: LineLayerStyle = {
    minZoom: null,
    paint: {
      'line-color': color,
      'line-opacity': roadOpacity,
      'line-width': [
        'let',
        'width',
        majorRoadWidth,
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
  const minorStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': color,
      'line-opacity': roadOpacity,
      'line-width': [
        'let',
        'width',
        minorRoadWidth,
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
      'line-cap': 'round'
    }
  }

  return {
    '道路中心線ZL4-10国道': majorStyle,
    '道路中心線ZL4-10高速': majorStyle,
    道路中心線ククリ0: minorStyle,
    道路中心線ククリ1: minorStyle,
    道路中心線ククリ2: minorStyle,
    道路中心線ククリ3: minorStyle,
    道路中心線ククリ4: minorStyle,
    道路中心線ククリ橋0: minorStyle,
    道路中心線ククリ橋1: minorStyle,
    道路中心線ククリ橋2: minorStyle,
    道路中心線ククリ橋3: minorStyle,
    道路中心線ククリ橋4: minorStyle
  }
}

const railwayOpacity: Expression = [
  'match',
  ['get', 'vt_rtcode'],
  '地下鉄',
  0.5,
  1
]

const majorRailwayWidth: Expression = [
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

const minorRailwayWidth: Expression = [
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

function createRailwayStyles(options: LayerStylesOptions): LayerStyles {
  const majorStyle: LineLayerStyle = {
    minZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': railwayOpacity,
      'line-width': [
        'let',
        'width',
        majorRailwayWidth,
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
  const minorStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': railwayOpacity,
      'line-width': [
        'let',
        'width',
        minorRailwayWidth,
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

  return {
    '鉄道中心線ZL4-10': majorStyle,
    鉄道中心線0: minorStyle,
    鉄道中心線橋0: minorStyle,
    鉄道中心線1: minorStyle,
    鉄道中心線橋1: minorStyle,
    鉄道中心線2: minorStyle,
    鉄道中心線橋2: minorStyle,
    鉄道中心線3: minorStyle,
    鉄道中心線橋3: minorStyle,
    鉄道中心線4: minorStyle,
    鉄道中心線橋4: minorStyle

    // TODO: Maintain physical line widths.
    // 軌道の中心線トンネル: {
    //   minZoom: null,
    //   maxZoom: null,
    //   paint: {
    //     'line-color': options.railwayColor,
    //     'line-opacity': 0.5,
    //     'line-width': 2
    //   }
    // },
    // 軌道の中心線: {
    //   minZoom: null,
    //   maxZoom: null,
    //   paint: {
    //     'line-color': options.railwayColor,
    //     'line-width': 2
    //   }
    // }
  }
}

export function createLayerStyles(options: LayerStylesOptions): LayerStyles {
  return {
    ...createBoundaryStyles(options),
    ...createLandWaterStyles(options),
    ...createRoadStyles(options),
    ...createRailwayStyles(options)
  }
}
