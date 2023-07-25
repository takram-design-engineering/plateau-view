import { type AnyLayer, type Style } from 'mapbox-gl'

import rawStyle from './assets/std.json'

// appends layers below to 'layers' array of the style json.

const layersToInsert: Array<{
  // 'layer' will be inserted after the layer with ID 'insertAfter'.
  // if insertAfter is null, it will be inserted at the head of layers.
  insertAfter: string | null
  layer: AnyLayer
}> = [
  {
    insertAfter: '鉄道中心線0',
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
    insertAfter: '鉄道中心線1',
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
    insertAfter: '鉄道中心線2',
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
    insertAfter: '鉄道中心線3',
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
    insertAfter: '鉄道中心線4',
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
    insertAfter: '鉄道中心線旗竿0',
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
    insertAfter: '鉄道中心線旗竿1',
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
    insertAfter: '鉄道中心線旗竿2',
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
    insertAfter: '鉄道中心線旗竿3',
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
    insertAfter: '鉄道中心線旗竿4',
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
    insertAfter: '軌道の中心線',
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
        // ['==', ['get', 'vt_rtcode'], 'JR']
      ],
      layout: {
        'line-sort-key': ['get', 'vt_drworder']
      }
    }
  }
]

export function createBaseStyle(): Style {
  const style = rawStyle as Style
  const layers = [...style.layers]
  layersToInsert.forEach(layerToInsert => {
    layers.splice(
      layerToInsert.insertAfter === null
        ? 0
        : layers.findIndex(l => l.id === layerToInsert.insertAfter) + 1,
      0,
      layerToInsert.layer
    )
  })
  return {
    ...style,
    layers
  }
}
