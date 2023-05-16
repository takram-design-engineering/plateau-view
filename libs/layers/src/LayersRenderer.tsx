import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { type FC, type ReactNode } from 'react'

import { type LayerComponents, type LayerModel } from './types'
import { useLayers } from './useLayers'

interface LayerRendererProps {
  components: LayerComponents
  layerAtom: PrimitiveAtom<LayerModel>
}

const LayerRenderer: FC<LayerRendererProps> = ({ components, layerAtom }) => {
  const layer = useAtomValue(layerAtom)
  const Component = components[layer.type]
  return <Component layerAtom={layerAtom} />
}

export interface LayersRendererProps<T extends LayerComponents> {
  components: T
  children?: ReactNode
}

export function LayersRenderer<T extends LayerComponents>({
  components
}: LayersRendererProps<T>): JSX.Element {
  const { layerAtomsAtom } = useLayers()
  const layerAtoms = useAtomValue(layerAtomsAtom)
  return (
    <>
      {layerAtoms.map(layerAtom => (
        <LayerRenderer
          key={`${layerAtom}`}
          components={components}
          layerAtom={layerAtom}
        />
      ))}
    </>
  )
}
