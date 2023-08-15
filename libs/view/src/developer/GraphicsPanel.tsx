import { Divider, Stack } from '@mui/material'
import { atom, useAtomValue, type SetStateAction } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { type FC } from 'react'

import { AmbientOcclusionOutputType } from '@takram/plateau-cesium-hbao'
import { atomWithResettableAtoms } from '@takram/plateau-shared-states'
import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SliderParameterItem,
  SwitchParameterItem
} from '@takram/plateau-ui-components'

import {
  ambientOcclusionAccurateNormalReconstructionAtom,
  ambientOcclusionBiasAtom,
  ambientOcclusionBlackPointAtom,
  ambientOcclusionDenoiseAtom,
  ambientOcclusionDirectionsAtom,
  ambientOcclusionEnabledAtom,
  ambientOcclusionGammaAtom,
  ambientOcclusionIntensityAtom,
  ambientOcclusionMaxRadiusAtom,
  ambientOcclusionOutputTypeAtom,
  ambientOcclusionStepsAtom,
  ambientOcclusionTextureScaleAtom,
  ambientOcclusionWhitePointAtom,
  antialiasTypeAtom,
  explicitRenderingEnabledAtom,
  nativeResolutionEnabledAtom,
  shadowMapEnabledAtom,
  shadowMapSizeAtom,
  shadowMapSoftShadowsAtom
} from '../states/graphics'

const ambientOcclusionReduceScaleAtom = atom(
  get => get(ambientOcclusionTextureScaleAtom) < 1,
  (get, set, value: SetStateAction<boolean>) => {
    set(
      ambientOcclusionTextureScaleAtom,
      (
        typeof value === 'function'
          ? value(get(ambientOcclusionReduceScaleAtom))
          : value
      )
        ? 0.5
        : 1
    )
  }
)

const resetAtom = atomWithResettableAtoms([
  ambientOcclusionAccurateNormalReconstructionAtom,
  ambientOcclusionBiasAtom,
  ambientOcclusionBlackPointAtom,
  ambientOcclusionDenoiseAtom,
  ambientOcclusionDirectionsAtom,
  ambientOcclusionEnabledAtom,
  ambientOcclusionGammaAtom,
  ambientOcclusionIntensityAtom,
  ambientOcclusionMaxRadiusAtom,
  ambientOcclusionOutputTypeAtom,
  ambientOcclusionStepsAtom,
  ambientOcclusionTextureScaleAtom,
  ambientOcclusionWhitePointAtom,
  antialiasTypeAtom,
  explicitRenderingEnabledAtom,
  nativeResolutionEnabledAtom,
  shadowMapEnabledAtom,
  shadowMapSizeAtom,
  shadowMapSoftShadowsAtom
])

export const GraphicsPanel: FC = () => {
  const nativeResolutionEnabled = useAtomValue(nativeResolutionEnabledAtom)
  const shadowMapEnabled = useAtomValue(shadowMapEnabledAtom)
  const ambientOcclusionEnabled = useAtomValue(ambientOcclusionEnabledAtom)
  const ambientOcclusionDenoise = useAtomValue(ambientOcclusionDenoiseAtom)

  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='Graphics' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <SwitchParameterItem
            labelFontSize='small'
            label='Native Resolution'
            atom={nativeResolutionEnabledAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Explicit Rendering'
            atom={explicitRenderingEnabledAtom}
          />
          <SelectParameterItem
            labelFontSize='small'
            label='Antialias'
            atom={antialiasTypeAtom}
            items={[
              ['none', 'None'],
              ['fxaa', 'FXAA'],
              ['msaa2x', 'MSAA 2x'],
              ['msaa4x', 'MSAA 4x'],
              ['msaa8x', 'MSAA 8x']
            ]}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            labelFontSize='small'
            label='Shadow Map'
            atom={shadowMapEnabledAtom}
          />
          <SelectParameterItem
            labelFontSize='small'
            label='Resolution'
            disabled={!shadowMapEnabled}
            atom={shadowMapSizeAtom}
            items={[
              [1024, '1024 px'],
              [2048, '2048 px'],
              [4096, '4096 px']
            ]}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Soft Shadows'
            disabled={!shadowMapEnabled}
            atom={shadowMapSoftShadowsAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            labelFontSize='small'
            label='Ambient Occlusion'
            atom={ambientOcclusionEnabledAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Intensity'
            disabled={!ambientOcclusionEnabled}
            min={0}
            max={200}
            atom={ambientOcclusionIntensityAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Max Radius'
            step={1}
            min={1}
            max={100}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionMaxRadiusAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Bias'
            min={0}
            max={1}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionBiasAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Reduce Resolution'
            disabled={!ambientOcclusionEnabled || !nativeResolutionEnabled}
            atom={ambientOcclusionReduceScaleAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Accurate Normal Reconstruction'
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionAccurateNormalReconstructionAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Denoise'
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionDenoiseAtom}
          />
          <SelectParameterItem
            labelFontSize='small'
            label='Output Type'
            displayEmpty
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionOutputTypeAtom}
            items={[
              [null, 'Final'],
              [AmbientOcclusionOutputType.Occlusion, 'AO Only'],
              [AmbientOcclusionOutputType.Normal, 'Normal'],
              [AmbientOcclusionOutputType.Depth, 'Depth'],
              [
                AmbientOcclusionOutputType.Weight,
                'Bilateral Weight',
                { disabled: !ambientOcclusionDenoise }
              ],
              [AmbientOcclusionOutputType.Shade, 'Shade']
            ]}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Number of Sample Directions'
            disabled={!ambientOcclusionEnabled}
            step={1}
            min={1}
            max={16}
            atom={ambientOcclusionDirectionsAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Number of Sample Steps'
            step={1}
            min={1}
            max={16}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionStepsAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Shade Black Point'
            min={0}
            max={1}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionBlackPointAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Shade White Point'
            min={0}
            max={1}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionWhitePointAtom}
          />
          <SliderParameterItem
            labelFontSize='small'
            label='Shade Gamma'
            min={1}
            max={3}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionGammaAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
