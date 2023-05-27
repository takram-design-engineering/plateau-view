import { Divider, Stack } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { type FC } from 'react'

import { showTexturesAtom } from '@takram/plateau-datasets'
import { selectionAtom } from '@takram/plateau-screen-space-selection'
import { colorModeAtom } from '@takram/plateau-shared-states'
import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SwitchParameterItem,
  ValueParameterItem
} from '@takram/plateau-ui-components'

import {
  debugSphericalHarmonicsAtom,
  enableTerrainLightingAtom,
  environmentTypeAtom,
  plateauDataSourceAtom,
  showAreaEntitiesAtom,
  showDataFormatsAtom,
  showSelectionBoundingSphereAtom,
  terrainTypeAtom
} from '../states/app'
import { atomWithResettableAtoms } from '../states/atomWithResettableAtoms'

const resetAtom = atomWithResettableAtoms([
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  enableTerrainLightingAtom,
  environmentTypeAtom,
  plateauDataSourceAtom,
  showAreaEntitiesAtom,
  showDataFormatsAtom,
  showSelectionBoundingSphereAtom,
  showTexturesAtom,
  terrainTypeAtom
])

export const AppPanel: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const selection = useAtomValue(selectionAtom)

  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='App' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <SelectParameterItem
            label='Environment Type'
            atom={environmentTypeAtom}
            items={[
              ['map', 'Map'],
              ['satellite', 'Satellite'],
              ['google-photorealistic', 'Google Photorealistic']
            ]}
          />
          <SelectParameterItem
            label='Terrain Type'
            atom={terrainTypeAtom}
            items={[
              ['ellipsoid', 'Ellipsoid'],
              ['plateau', 'Plateau'],
              ['cesium-world', 'Cesium World']
            ]}
          />
          <SelectParameterItem
            label='Color Mode'
            atom={colorModeAtom}
            disabled={environmentType === 'satellite'}
            items={[
              ['light', 'Light'],
              ['dark', 'Dark']
            ]}
          />
          <SwitchParameterItem
            label='Terrain Lighting'
            atom={enableTerrainLightingAtom}
          />
          <SwitchParameterItem
            label='Tileset Textures'
            atom={showTexturesAtom}
          />
          <SwitchParameterItem
            label='Debug Spherical Harmonics'
            atom={debugSphericalHarmonicsAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SelectParameterItem
            label='Plateau Data Source'
            atom={plateauDataSourceAtom}
            items={[
              ['2020', 'Hosted 2020'],
              ['2022', 'Hosted 2022'],
              ['cms', 'CMS Assets']
            ]}
          />
          <SwitchParameterItem
            label='Show Data Formats'
            atom={showDataFormatsAtom}
          />
          <SwitchParameterItem
            label='Show Area Entities'
            atom={showAreaEntitiesAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <ValueParameterItem
            label='Selection Count'
            value={selection.length.toLocaleString()}
          />
          <SwitchParameterItem
            label='Selection Bounding Sphere'
            atom={showSelectionBoundingSphereAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
