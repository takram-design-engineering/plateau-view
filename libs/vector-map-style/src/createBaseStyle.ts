import { type AnyLayer, type Style } from 'mapbox-gl'

import rawStyle from './assets/std.json'

// TODO: fast refesh does not work after editing this file
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
  }
]

export function createBaseStyle(): Style {
  const style = rawStyle as Style
  layersToInsert.forEach(layerToInsert => {
    style.layers.splice(
      layerToInsert.insertAfter === null
        ? 0
        : style.layers.findIndex(l => l.id === layerToInsert.insertAfter) + 1,
      0,
      layerToInsert.layer
    )
  })
  return style
}
