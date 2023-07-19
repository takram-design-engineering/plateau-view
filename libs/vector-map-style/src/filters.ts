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
  ]
}
