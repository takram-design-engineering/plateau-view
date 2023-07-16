import { darken, lighten } from '@mui/system'

import { createLayerStyles } from './createLayerStyles'
import { createStyle } from './createStyle'

const primaryColor = '#00b3db'
const accentColor = '#ebf000'
const subColor = '#463c64'

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
