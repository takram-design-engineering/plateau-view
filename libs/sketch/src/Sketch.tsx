import { ClassificationType, Color } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useContext, type FC } from 'react'

import { Entity } from '@takram/plateau-cesium'

import { PolygonEntity } from './PolygonEntity'
import { PolylineEntity } from './PolylineEntity'
import { SketchContext } from './SketchProvider'
import { SketchToolbar } from './SketchToolbar'
import { Union } from './Union'
import { useDrawingTool } from './useDrawingTool'
import { useHandTool } from './useHandTool'
import { useSendStateMachineEvents } from './useSendStateMachineEvents'

export const Sketch: FC = () => {
  useSendStateMachineEvents()
  useHandTool()
  const { polygonHierarchyProperty } = useDrawingTool()

  const { featuresAtom } = useContext(SketchContext)
  const features = useAtomValue(featuresAtom)

  const theme = useTheme()
  return (
    <>
      <SketchToolbar />
      <Union
        of={PolygonEntity}
        features={features}
        color={theme.palette.primary.main}
      />
      <Union
        of={PolylineEntity}
        features={features}
        color={theme.palette.primary.main}
        alpha={1}
      />
      {polygonHierarchyProperty != null && (
        <Entity
          polygon={{
            hierarchy: polygonHierarchyProperty,
            fill: true,
            material: Color.fromCssColorString('#808080').withAlpha(0.5),
            classificationType: ClassificationType.TERRAIN
          }}
        />
      )}
    </>
  )
}
