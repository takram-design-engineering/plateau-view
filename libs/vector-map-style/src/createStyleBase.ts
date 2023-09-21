import { type AnyLayer, type Style } from 'mapbox-gl'

import rawStyle from './assets/std.json'

const layersToInsert: Array<{
  after: string
  layer: AnyLayer
}> = [
  {
    after: '鉄道中心線0',
    layer: {
      id: '鉄道中心線ククリ0',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['==', ['get', 'vt_lvorder'], 0]
      ]
    }
  },
  {
    after: '鉄道中心線1',
    layer: {
      id: '鉄道中心線ククリ1',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['==', ['get', 'vt_lvorder'], 1]
      ]
    }
  },
  {
    after: '鉄道中心線2',
    layer: {
      id: '鉄道中心線ククリ2',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['==', ['get', 'vt_lvorder'], 2]
      ]
    }
  },
  {
    after: '鉄道中心線3',
    layer: {
      id: '鉄道中心線ククリ3',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['==', ['get', 'vt_lvorder'], 3]
      ]
    }
  },
  {
    after: '鉄道中心線4',
    layer: {
      id: '鉄道中心線ククリ4',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['==', ['get', 'vt_lvorder'], 4]
      ]
    }
  },
  {
    after: '鉄道中心線旗竿0',
    layer: {
      id: '鉄道中心線点線0',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        ['!=', ['get', 'vt_rtcode'], 'JR'],
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['!=', ['get', 'vt_sngldbl'], '駅部分'],
        ['==', ['get', 'vt_lvorder'], 0]
      ]
    }
  },
  {
    after: '鉄道中心線旗竿1',
    layer: {
      id: '鉄道中心線点線1',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        ['!=', ['get', 'vt_rtcode'], 'JR'],
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['!=', ['get', 'vt_sngldbl'], '駅部分'],
        ['==', ['get', 'vt_lvorder'], 1]
      ]
    }
  },
  {
    after: '鉄道中心線旗竿2',
    layer: {
      id: '鉄道中心線点線2',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        ['!=', ['get', 'vt_rtcode'], 'JR'],
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['!=', ['get', 'vt_sngldbl'], '駅部分'],
        ['==', ['get', 'vt_lvorder'], 2]
      ]
    }
  },
  {
    after: '鉄道中心線旗竿3',
    layer: {
      id: '鉄道中心線点線3',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        ['!=', ['get', 'vt_rtcode'], 'JR'],
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['!=', ['get', 'vt_sngldbl'], '駅部分'],
        ['==', ['get', 'vt_lvorder'], 3]
      ]
    }
  },
  {
    after: '鉄道中心線旗竿4',
    layer: {
      id: '鉄道中心線点線4',
      minzoom: 11,
      maxzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailCL',
      filter: [
        'all',
        ['!=', ['get', 'vt_rtcode'], 'JR'],
        [
          '!',
          [
            'in',
            ['get', 'vt_railstate'],
            ['literal', ['トンネル', '雪覆い', '地下', '橋・高架']]
          ]
        ],
        ['!=', ['get', 'vt_sngldbl'], '駅部分'],
        ['==', ['get', 'vt_lvorder'], 4]
      ]
    }
  },
  {
    after: '軌道の中心線',
    layer: {
      id: '軌道の中心線点線',
      minzoom: 17,
      type: 'line',
      source: 'v',
      'source-layer': 'RailTrCL',
      filter: [
        'all',
        [
          'in',
          ['get', 'vt_code'],
          [
            'literal',
            [
              2801, 2803, 2806, 2811, 2813, 2816, 2821, 2823, 2826, 2831, 2833,
              2836, 2841, 2843, 2846, 2888, 2899
            ]
          ]
        ]
      ],
      layout: {
        'line-sort-key': ['get', 'vt_drworder']
      }
    }
  }
]

export function createStyleBase(): Style {
  const style = rawStyle as Style
  const layers = [...style.layers]
  layersToInsert.forEach(layerToInsert => {
    layers.splice(
      layers.findIndex(({ id }) => id === layerToInsert.after) + 1,
      0,
      layerToInsert.layer
    )
  })
  return {
    ...style,
    layers
  }
}
