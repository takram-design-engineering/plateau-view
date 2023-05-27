import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { Suspense, type FC, type ReactNode } from 'react'

import { layerAtomsAtom, layerIdsAtom, layerSelectionAtom } from './states'
import { type LayerComponents, type LayerModel } from './types'

interface LayerRendererProps {
  components: LayerComponents
  index: number
  layerAtom: PrimitiveAtom<LayerModel>
}

const LayerRenderer: FC<LayerRendererProps> = ({
  components,
  index,
  layerAtom
}) => {
  const layer = useAtomValue(layerAtom)
  const selection = useAtomValue(layerSelectionAtom)
  const Component = components[layer.type]
  return (
    <Suspense>
      <Component
        {...layer}
        index={index}
        selected={selection.includes(layer.id)}
      />
    </Suspense>
  )
}

export interface LayersRendererProps<T extends LayerComponents> {
  components: T
  children?: ReactNode
}

export function LayersRenderer<T extends LayerComponents>({
  components
}: LayersRendererProps<T>): JSX.Element {
  const layerAtoms = useAtomValue(layerAtomsAtom)
  const layerIds = useAtomValue(layerIdsAtom)
  return (
    <>
      {layerAtoms.map((layerAtom, index) => (
        <LayerRenderer
          key={layerIds[index]}
          components={components}
          index={index}
          layerAtom={layerAtom}
        />
      ))}
    </>
  )
}
