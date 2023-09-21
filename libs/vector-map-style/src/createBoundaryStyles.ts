import { type LayerStyles } from './createStyle'

export interface BoundaryStylesOptions {
  boundaryColor: string
  municipalityBoundaryColor?: string
  prefectureBoundaryColor?: string
}

export function createBoundaryStyles(
  options: BoundaryStylesOptions
): LayerStyles {
  const dasharray = [2, 2, 0.01, 2]
  return {
    '行政区画界線25000所属界（所属を明示する境界線）': {
      paint: {
        'line-color':
          options.municipalityBoundaryColor ?? options.boundaryColor,
        'line-width': 1,
        'line-dasharray': dasharray
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    行政区画界線25000市区町村界: {
      paint: {
        'line-color':
          options.municipalityBoundaryColor ?? options.boundaryColor,
        'line-width': 1,
        'line-dasharray': dasharray
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    '行政区画界線25000都府県界及び北海道総合振興局・振興局界': {
      paint: {
        'line-color': options.prefectureBoundaryColor ?? options.boundaryColor,
        'line-width': 1,
        'line-dasharray': dasharray
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    行政区画界線地方界: {
      paint: {
        'line-color': options.prefectureBoundaryColor ?? options.boundaryColor,
        'line-width': 1,
        'line-opacity': 0.5
      }
    }
  }
}
