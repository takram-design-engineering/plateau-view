import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { Suspense, type FC, type ReactNode } from 'react'

import { type LayerComponents, type LayerModel } from './types'
import { useLayers } from './useLayers'

interface LayerRendererProps {
  components: LayerComponents
  layerAtom: PrimitiveAtom<LayerModel>
}

const LayerRenderer: FC<LayerRendererProps> = ({ components, layerAtom }) => {
  const layer = useAtomValue(layerAtom)
  const Component = components[layer.type]
  return (
    <Suspense>
      <Component {...layer} />
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
  const { layerAtomsAtom, layerIdsAtom } = useLayers()
  const layerAtoms = useAtomValue(layerAtomsAtom)
  const layerIds = useAtomValue(layerIdsAtom)
  return (
    <>
      {layerAtoms.map((layerAtom, index) => (
        <LayerRenderer
          key={layerIds[index]}
          components={components}
          layerAtom={layerAtom}
        />
      ))}
    </>
  )
}
