import { Divider, Stack } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { type FC } from 'react'

import { showTilesetTextureAtom } from '@takram/plateau-datasets'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import {
  atomWithResettableAtoms,
  colorModeAtom
} from '@takram/plateau-shared-states'
import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SliderParameterItem,
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
  terrainElevationHeightRangeAtom,
  terrainTypeAtom
} from '../states/app'

const resetAtom = atomWithResettableAtoms([
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  enableTerrainLightingAtom,
  environmentTypeAtom,
  plateauDataSourceAtom,
  showAreaEntitiesAtom,
  showDataFormatsAtom,
  showSelectionBoundingSphereAtom,
  showTilesetTextureAtom,
  terrainElevationHeightRangeAtom,
  terrainTypeAtom
])

export const AppPanel: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const selection = useAtomValue(screenSpaceSelectionAtom)

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
              ['elevation', 'Elevation'],
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
          <SliderParameterItem
            label='Terrain Elevation Height'
            min={-10}
            max={4000}
            step={1}
            unit='m'
            logarithmic
            atom={terrainElevationHeightRangeAtom}
            disabled={environmentType !== 'elevation'}
          />
          <SwitchParameterItem
            label='Tileset Texture'
            atom={showTilesetTextureAtom}
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
