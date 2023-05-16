import { useAtomValue, type PrimitiveAtom } from 'jotai'
import { type FC, type ReactNode } from 'react'

import { layerComponents } from './layerComponents'
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

export interface LayersRendererProps {
  components?: LayerComponents
  children?: ReactNode
}

export const LayersRenderer: FC<LayersRendererProps> = ({
  components = layerComponents
}) => {
  const { layerAtomsAtom } = useLayers()
  const layerAtoms = useAtomValue(layerAtomsAtom)
  return (
    <>
      {layerAtoms.map(layerAtom => (
        <LayerRenderer
          key={`${layerAtom}`}
          components={components as LayerComponents}
          layerAtom={layerAtom}
        />
      ))}
    </>
  )
}
