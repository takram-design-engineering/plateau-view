import { useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'
import { isNotFalse } from '@takram/plateau-type-helpers'
import {
  ParameterList,
  SwitchParameterItem
} from '@takram/plateau-ui-components'

export interface LayerShowWireframeSectionProps {
  layers: readonly LayerModel[]
}

export const LayerShowWireframeSection: FC<LayerShowWireframeSectionProps> = ({
  layers
}) => {
  const showWireframeAtoms = useMemo(
    () =>
      layers
        .map(layer => 'showWireframeAtom' in layer && layer.showWireframeAtom)
        .filter(isNotFalse),
    [layers]
  )

  if (showWireframeAtoms.length === 0) {
    return null
  }
  return (
    <ParameterList>
      <SwitchParameterItem
        label='ワイヤフレーム表示'
        atom={showWireframeAtoms}
      />
    </ParameterList>
  )
}
