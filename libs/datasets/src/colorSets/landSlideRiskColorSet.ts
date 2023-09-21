import { atomsWithQualitativeColorSet } from '../atomsWithQualitativeColorSet'

export const landSlideRiskColorSet = atomsWithQualitativeColorSet({
  name: '土砂災害警戒区域',
  // Colors inherited from VIEW 2.0.
  // List of codes: https://www.mlit.go.jp/plateaudocument/#toc4_09_04
  // prettier-ignore
  colors: [
    { value: '1', color: '#ffed4c', name: '土砂災害警戒区域（指定済）' },
    { value: '2', color: '#fb684c', name: '土砂災害特別警戒区域（指定済）' },
    { value: '3', color: '#ffed4c', name: '土砂災害警戒区域（指定前）' },
    { value: '4', color: '#fb684c', name: '土砂災害特別警戒区域（指定前）' }
  ]
})
