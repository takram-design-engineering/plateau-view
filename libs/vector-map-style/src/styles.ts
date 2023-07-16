import { darken, lighten } from '@mui/system'

import { createLayerStyles } from './createLayerStyles'
import { createStyle } from './createStyle'

const primaryColor = '#00b3db'
const accentColor = '#ebf000'
const subColor = '#463c64'

function gray(value: number): string {
  const component = Math.min(Math.max(Math.round(0xff * value), 0), 0xff)
  return `rgb(${component}, ${component}, ${component})`
}

export const standardStyle = createStyle({
  layerStyles: createLayerStyles({
    landColor: '#f4f4f4',
    waterColor: lighten(primaryColor, 0.4),
    seaRouteColor: lighten(primaryColor, 0.2),
    municipalityBoundaryColor: subColor,
    prefectureBoundaryColor: subColor,
    highwayColor: '#acacac',
    majorRoadColor: '#dfdfdf',
    minorRoadColor: '#ffffff',
    railwayColor: darken(accentColor, 0.4)
  })
})

export const lightStyle = createStyle({
  layerStyles: createLayerStyles({
    landColor: gray(1),
    waterColor: gray(0.75),
    seaRouteColor: gray(0.675),
    municipalityBoundaryColor: gray(0.33),
    prefectureBoundaryColor: gray(0.33),
    highwayColor: gray(0.66),
    majorRoadColor: gray(0.9),
    minorRoadColor: gray(0.9),
    railwayColor: gray(0.66)
  })
})

export const darkStyle = createStyle({
  layerStyles: createLayerStyles({
    landColor: gray(0.1),
    waterColor: gray(0),
    seaRouteColor: gray(0.05),
    municipalityBoundaryColor: gray(0.66),
    prefectureBoundaryColor: gray(0.66),
    highwayColor: gray(0.4),
    majorRoadColor: gray(0.2),
    minorRoadColor: gray(0.2),
    railwayColor: gray(0.4)
  })
})
