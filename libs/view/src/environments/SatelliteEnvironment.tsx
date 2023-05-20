import { Cartesian3 } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { Environment, type EnvironmentProps } from '@takram/plateau-cesium'

import { enableTerrainLightingAtom } from '../states/app'

// TODO: Create time-based interpolation of sky atmosphere.
// Spherical harmonic coefficients generated from a modified version of:
// https://polyhaven.com/a/teufelsberg_ground_2
const L00 = new Cartesian3(
  1.221931219100952,
  1.266084671020508,
  1.019550442695618
)
const L1_1 = new Cartesian3(
  0.800345599651337,
  0.841745376586914,
  0.723761379718781
)
const L10 = new Cartesian3(
  0.912390112876892,
  0.922998011112213,
  0.649103164672852
)
const L11 = new Cartesian3(
  -0.843475937843323,
  -0.853787302970886,
  -0.601324439048767
)
const L2_2 = new Cartesian3(
  -0.495116978883743,
  -0.5034259557724,
  -0.360104471445084
)
const L2_1 = new Cartesian3(
  0.497776478528976,
  0.507052302360535,
  0.364346027374268
)
const L20 = new Cartesian3(
  0.082192525267601,
  0.082608506083488,
  0.056836795061827
)
const L21 = new Cartesian3(
  -0.925247848033905,
  -0.940086245536804,
  -0.678709805011749
)
const L22 = new Cartesian3(
  0.114833705127239,
  0.114355310797691,
  0.067587599158287
)
const coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22]

export const SatelliteEnvironment: FC<EnvironmentProps> = props => {
  const enableTerrainLighting = useAtomValue(enableTerrainLightingAtom)
  return (
    <Environment
      enableGlobeLighting={enableTerrainLighting}
      lightIntensity={1}
      shadowDarkness={0.5}
      sphericalHarmonicCoefficients={coefficients}
      {...props}
    />
  )
}
