import { type AnyLayer, type Style } from 'mapbox-gl'

import rawStyle from './assets/std.json'

interface AdditionalLayer {
  after: string
  layer: AnyLayer
}

const additionalLayers: readonly AdditionalLayer[] = [
  ...[...Array(5)].map(
    (_, index): AdditionalLayer => ({
      after: `鉄道中心線${index}`,
      layer: {
        id: `railwayCenterline${index}`,
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
          ['==', ['get', 'vt_lvorder'], index]
        ]
      }
    })
  ),
  ...[...Array(5)].map(
    (_, index): AdditionalLayer => ({
      after: `鉄道中心線旗竿${index}`,
      layer: {
        id: `railwayDash${index}`,
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
          ['==', ['get', 'vt_lvorder'], index]
        ]
      }
    })
  ),
  {
    after: '軌道の中心線',
    layer: {
      id: 'railwayTrackCenterlineDash',
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
  additionalLayers.forEach(additionalLayer => {
    layers.splice(
      layers.findIndex(({ id }) => id === additionalLayer.after) + 1,
      0,
      additionalLayer.layer
    )
  })
  return {
    ...style,
    layers
  }
}
