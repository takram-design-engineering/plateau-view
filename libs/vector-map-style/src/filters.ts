import type { Expression } from 'mapbox-gl'

import { type LayerId } from './createStyle'

export const filters: { [K in LayerId]?: Expression } = {
  道路中心線色0: [
    'all',
    ['==', ['get', 'vt_lvorder'], 0],
    [
      '!',
      [
        'in',
        ['get', 'vt_code'],
        ['literal', [2703, 2713, 2723, 2733, 2724, 2734]]
      ]
    ]
  ],
  鉄道中心線橋ククリ白0: [
    'all',
    ['!=', ['get', 'vt_rtcode'], 'JR'],
    ['in', ['get', 'vt_railstate'], '橋・高架'],
    ['!=', ['get', 'vt_sngldbl'], '駅部分'],
    ['==', ['get', 'vt_lvorder'], 0]
  ],
  鉄道中心線橋ククリ白1: [
    'all',
    ['!=', ['get', 'vt_rtcode'], 'JR'],
    ['in', ['get', 'vt_railstate'], '橋・高架'],
    ['!=', ['get', 'vt_sngldbl'], '駅部分'],
    ['==', ['get', 'vt_lvorder'], 1]
  ],
  鉄道中心線橋ククリ白2: [
    'all',
    ['!=', ['get', 'vt_rtcode'], 'JR'],
    ['in', ['get', 'vt_railstate'], '橋・高架'],
    ['!=', ['get', 'vt_sngldbl'], '駅部分'],
    ['==', ['get', 'vt_lvorder'], 2]
  ],
  鉄道中心線橋ククリ白3: [
    'all',
    ['!=', ['get', 'vt_rtcode'], 'JR'],
    ['in', ['get', 'vt_railstate'], '橋・高架'],
    ['!=', ['get', 'vt_sngldbl'], '駅部分'],
    ['==', ['get', 'vt_lvorder'], 3]
  ],
  鉄道中心線橋ククリ白4: [
    'all',
    ['!=', ['get', 'vt_rtcode'], 'JR'],
    ['in', ['get', 'vt_railstate'], '橋・高架'],
    ['!=', ['get', 'vt_sngldbl'], '駅部分'],
    ['==', ['get', 'vt_lvorder'], 4]
  ]
}
