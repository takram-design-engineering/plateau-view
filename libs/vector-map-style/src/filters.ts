import type { Expression } from 'mapbox-gl'

export const filters: Record<string, Expression> = {
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
