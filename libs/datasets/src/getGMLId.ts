import { type Cesium3DTileFeature } from '@cesium/engine'

export function getGMLId(feature: Cesium3DTileFeature): string | undefined {
  try {
    // Version 2020 stores GML id in "_gml_id" while 2022 stores in "gml_id".
    return feature.getProperty('gml_id') ?? feature.getProperty('_gml_id')
  } catch (error) {
    return undefined
  }
}
