import { featureCollection } from '@turf/turf'
import { saveAs } from 'file-saver'
import { atom, useAtomValue } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'
import {
  ButtonParameterItem,
  ParameterList
} from '@takram/plateau-ui-components'
import { SKETCH_LAYER } from '@takram/plateau-view-layers'

export interface LayerSketchSectionProps {
  layers: readonly LayerModel[]
}

export const LayerSketchSection: FC<LayerSketchSectionProps> = ({ layers }) => {
  const sketchLayers = useMemo(
    () =>
      layers.filter(
        (layer): layer is LayerModel<typeof SKETCH_LAYER> =>
          layer.type === SKETCH_LAYER
      ),
    [layers]
  )

  const features = useAtomValue(
    useMemo(
      () => atom(get => sketchLayers.flatMap(layer => get(layer.featuresAtom))),
      [sketchLayers]
    )
  )

  const handleExport = useCallback(() => {
    saveAs(
      new Blob([JSON.stringify(featureCollection(features), undefined, '  ')], {
        type: 'text/plain'
      }),
      'sketch.json'
    )
  }, [features])

  if (sketchLayers.length === 0) {
    return null
  }
  return (
    <ParameterList>
      <ButtonParameterItem
        disabled={features.length === 0}
        onClick={handleExport}
      >
        {sketchLayers.length > 1 ? `${sketchLayers.length}個の` : ''}
        作図をエキスポート
      </ButtonParameterItem>
    </ParameterList>
  )
}
