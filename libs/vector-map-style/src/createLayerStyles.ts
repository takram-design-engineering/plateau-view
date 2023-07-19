import { type Expression } from 'mapbox-gl'

import { type LayerStyles, type LineLayerStyle } from './createStyle'
import { filters } from './filters'

type Color = string

export interface LayerStylesOptions {
  landColor: Color
  waterColor: Color
  coastlineColor: Color
  seaRouteColor?: Color
  boundaryColor: Color
  municipalityBoundaryColor?: Color
  prefectureBoundaryColor?: Color
  roadColor: Color
  majorRoadColor?: Color
  highwayColor?: Color
  roadOutlineColor: Color
  majorRoadOutlineColor?: Color
  highwayOutlineColor?: Color
  railwayColor: Color
  railwayPhysicalWidthColor: Color
  railwayJRDashColor: Color
}

function createBoundaryStyles(options: LayerStylesOptions): LayerStyles {
  const dasharray = [2, 2, 0.01, 2]
  return {
    '行政区画界線25000所属界（所属を明示する境界線）': {
      paint: {
        'line-color':
          options.municipalityBoundaryColor ?? options.boundaryColor,
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
        'line-color':
          options.municipalityBoundaryColor ?? options.boundaryColor,
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
        'line-color': options.prefectureBoundaryColor ?? options.boundaryColor,
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
        'line-color': options.prefectureBoundaryColor ?? options.boundaryColor,
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
    水部構造物面: {
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
    海岸線: {
      minZoom: null,
      maxZoom: null,
      paint: {
        'line-color': options.coastlineColor,
        'line-width': 2
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
    ...(options.seaRouteColor != null && {
      水部表記線line: {
        paint: {
          'line-color': options.seaRouteColor,
          'line-width': 1
        }
      }
    })
  }
}

const roadOpacity: Expression = [
  'match',
  ['get', 'vt_code'],
  [2704, 2714, 2724, 2734], // Tunnels
  0.5,
  1
]

const simplifiedRoadWidth: Expression = [
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

const roadWidth: Expression = [
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
      'line-opacity': roadOpacity,
      'line-width': [
        'let',
        'width',
        simplifiedRoadWidth,
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
      'line-opacity': roadOpacity,
      'line-width': [
        'let',
        'width',
        roadWidth,
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
  const outlineStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': outlineColor,
      'line-opacity': roadOpacity,
      'line-width': [
        'let',
        'width',
        roadWidth,
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
    道路中心線ククリ0: outlineStyle,
    道路中心線ククリ1: outlineStyle,
    道路中心線ククリ2: outlineStyle,
    道路中心線ククリ3: outlineStyle,
    道路中心線ククリ4: outlineStyle,
    道路中心線ククリ橋0: outlineStyle,
    道路中心線ククリ橋1: outlineStyle,
    道路中心線ククリ橋2: outlineStyle,
    道路中心線ククリ橋3: outlineStyle,
    道路中心線ククリ橋4: outlineStyle,
    道路中心線色0: {
      ...style,
      filter: filters.道路中心線色0
    },
    道路中心線色1: style,
    道路中心線色2: style,
    道路中心線色3: style,
    道路中心線色4: style,
    道路中心線色橋0: style,
    道路中心線色橋1: style,
    道路中心線色橋2: style,
    道路中心線色橋3: style,
    道路中心線色橋4: style
  }
}

const railwayOpacity: Expression = [
  'match',
  ['get', 'vt_rtcode'],
  '地下鉄',
  0.5,
  1
]

const simplifiedRailwayWidth: Expression = [
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

const railwayWidth: Expression = [
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
  const simplifiedStyle: LineLayerStyle = {
    minZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': railwayOpacity,
      'line-width': [
        'let',
        'width',
        simplifiedRailwayWidth,
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
  const physicalWidthLineStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayPhysicalWidthColor,
      'line-opacity': railwayOpacity,
      'line-width': [
        'let',
        'width',
        railwayWidth,
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
      'line-color': options.railwayPhysicalWidthColor,
      'line-opacity': railwayOpacity,
      'line-width': [
        'let',
        'width',
        ['*', railwayWidth, 3],
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
  const constantWidthLineStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayColor,
      'line-opacity': railwayOpacity,
      'line-width': [
        'let',
        'width',
        railwayWidth,
        [
          'interpolate',
          ['exponential', 2],
          ['zoom'],
          10,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 10)],
          14,
          ['*', ['var', 'width'], 1 / 2 ** (23 - 14)],
          15,
          6,
          23,
          6
        ]
      ]
    }
  }
  const jrDashStyle: LineLayerStyle = {
    minZoom: null,
    maxZoom: null,
    paint: {
      'line-color': options.railwayJRDashColor ?? options.railwayColor,
      'line-opacity': 1,
      'line-width': [
        'let',
        'width',
        railwayWidth,
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

  return {
    '鉄道中心線ZL4-10': simplifiedStyle,
    鉄道中心線0: physicalWidthLineStyle,
    鉄道中心線橋ククリ黒0: physicalWidthLineStyle,
    鉄道中心線1: physicalWidthLineStyle,
    鉄道中心線橋ククリ黒1: physicalWidthLineStyle,
    鉄道中心線2: physicalWidthLineStyle,
    鉄道中心線橋ククリ黒2: physicalWidthLineStyle,
    鉄道中心線3: physicalWidthLineStyle,
    鉄道中心線橋ククリ黒3: physicalWidthLineStyle,
    鉄道中心線4: physicalWidthLineStyle,
    鉄道中心線橋ククリ黒4: physicalWidthLineStyle,
    鉄道中心線ククリ0: constantWidthLineStyle,
    鉄道中心線橋0: constantWidthLineStyle,
    鉄道中心線ククリ1: constantWidthLineStyle,
    鉄道中心線橋1: constantWidthLineStyle,
    鉄道中心線ククリ2: constantWidthLineStyle,
    鉄道中心線橋2: constantWidthLineStyle,
    鉄道中心線ククリ3: constantWidthLineStyle,
    鉄道中心線橋3: constantWidthLineStyle,
    鉄道中心線ククリ4: constantWidthLineStyle,
    鉄道中心線橋4: constantWidthLineStyle,
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
