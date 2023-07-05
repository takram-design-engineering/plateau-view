import { useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'
import { isNotFalse } from '@takram/plateau-type-helpers'
import {
  formatPercent,
  ParameterList,
  SliderParameterItem
} from '@takram/plateau-ui-components'

export interface LayerOpacitySectionProps {
  layers: readonly LayerModel[]
}

export const LayerOpacitySection: FC<LayerOpacitySectionProps> = ({
  layers
}) => {
  const opacityAtoms = useMemo(
    () =>
      layers
        .map(layer => 'opacityAtom' in layer && layer.opacityAtom)
        .filter(isNotFalse),
    [layers]
  )

  if (opacityAtoms.length === 0) {
    return null
  }
  return (
    <ParameterList>
      <SliderParameterItem
        label='不透明度'
        atom={opacityAtoms}
        min={0}
        max={1}
        format={formatPercent}
      />
    </ParameterList>
  )
}
