import { intersection } from 'lodash'
import { useMemo, type FC } from 'react'

import { type PLATEAU_TILE_FEATURE } from '@takram/plateau-datasets'
import { isNotNullish } from '@takram/plateau-type-helpers'
import {
  ParameterList,
  PropertyParameterItem
} from '@takram/plateau-ui-components'

import {
  type SCREEN_SPACE_SELECTION,
  type SelectionGroup
} from '../../states/selection'

export interface TileFeaturePropertiesSectionProps {
  values: (SelectionGroup & {
    type: typeof SCREEN_SPACE_SELECTION
    subtype: typeof PLATEAU_TILE_FEATURE
  })['values']
}

interface PropertySet {
  name: string
  values: string[] | number[] | object[]
}

export const TileFeaturePropertiesSection: FC<
  TileFeaturePropertiesSectionProps
> = ({ values }) => {
  const features = useMemo(
    () =>
      values
        .map(value => value.featureIndex.find(value.key)?.[0])
        .filter(isNotNullish),
    [values]
  )

  const properties: PropertySet[] = useMemo(
    () =>
      intersection(...features.map(feature => feature.getPropertyIds()))
        .filter(name => !name.startsWith('_'))
        .map(name => ({
          name,
          values: features
            .map(feature => feature.getProperty(name))
            .filter(isNotNullish)
        }))
        .filter(({ values }) => {
          if (values.length === 0) {
            return false
          }
          const type = typeof values[0]
          if (type !== 'string' && type !== 'number' && type !== 'object') {
            return false
          }
          return (
            values.length === features.length &&
            // eslint-disable-next-line valid-typeof
            values.slice(1).every(value => typeof value === type)
          )
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [features]
  )

  return (
    <ParameterList>
      <PropertyParameterItem properties={properties} />
    </ParameterList>
  )
}
