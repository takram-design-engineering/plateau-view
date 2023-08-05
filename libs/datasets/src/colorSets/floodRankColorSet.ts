import chroma from 'chroma-js'

import { atomsWithQualitativeColorSet } from '../atomsWithQualitativeColorSet'

export const floodRankColorSet = atomsWithQualitativeColorSet({
  name: '浸水ランク',
  colors: [
    { value: 6, color: chroma.rgb(220, 122, 220).hex(), name: '6: 20m〜' },
    { value: 5, color: chroma.rgb(242, 133, 201).hex(), name: '5: 10m〜20m' },
    { value: 4, color: chroma.rgb(255, 145, 145).hex(), name: '4: 5m〜10m' },
    { value: 3, color: chroma.rgb(255, 183, 183).hex(), name: '3: 3m〜5m' },
    { value: 2, color: chroma.rgb(255, 216, 192).hex(), name: '2: 0.5m〜3m' },
    { value: 1, color: chroma.rgb(247, 245, 169).hex(), name: '1: 〜0.5m' }
  ]
})
