import {
  createBoundaryStyles,
  type BoundaryStylesOptions
} from './createBoundaryStyles'
import {
  createLandWaterStyles,
  type LandWaterStylesOptions
} from './createLandWaterStyles'
import {
  createRailwayStyles,
  type RailwayStylesOptions
} from './createRailwayStyles'
import { createRoadStyles, type RoadStylesOptions } from './createRoadStyles'
import { type LayerStyles } from './createStyle'

export interface LayerStylesOptions
  extends BoundaryStylesOptions,
    LandWaterStylesOptions,
    RoadStylesOptions,
    RailwayStylesOptions {}

export function createLayerStyles(options: LayerStylesOptions): LayerStyles {
  return {
    ...createBoundaryStyles(options),
    ...createLandWaterStyles(options),
    ...createRoadStyles(options),
    ...createRailwayStyles(options)
  }
}
