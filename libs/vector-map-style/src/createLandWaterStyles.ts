import { type LayerStyles } from './createStyle'

export interface LandWaterStylesOptions {
  landColor: string
  waterColor: string
  coastlineColor: string
  seaRouteColor?: string
}

export function createLandWaterStyles(
  options: LandWaterStylesOptions
): LayerStyles {
  return {
    background: {
      paint: {
        'background-color': [
          'step',
          ['zoom'],
          options.landColor,
          4,
          options.waterColor,
          8,
          options.landColor
        ]
      }
    },
    行政区画: {
      paint: {
        'fill-color': options.landColor
      }
    },
    水部構造物面: {
      paint: {
        'fill-color': options.landColor
      }
    },
    水域: {
      maxZoom: null,
      paint: {
        'fill-color': options.waterColor
      }
    },
    海岸線: {
      minZoom: null,
      maxZoom: null,
      paint: {
        'line-color': options.coastlineColor,
        'line-width': 2
      }
    },
    河川中心線人工水路地下: {
      paint: {
        'line-color': options.waterColor,
        'line-width': 1,
        'line-opacity': 0.5
      }
    },
    河川中心線枯れ川部: {
      paint: {
        'line-color': options.waterColor,
        'line-width': 1,
        'line-opacity': 0.5
      }
    },
    ...(options.seaRouteColor != null && {
      水部表記線line: {
        paint: {
          'line-color': options.seaRouteColor,
          'line-width': 1
        }
      }
    })
  }
}
