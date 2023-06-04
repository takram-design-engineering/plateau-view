import { type FC } from 'react'
import invariant from 'tiny-invariant'

import { Environment, type EnvironmentProps } from '@takram/plateau-cesium'
import { GooglePhotorealisticTileset } from '@takram/plateau-datasets'

export const GooglePhotorealisticEnvironment: FC<EnvironmentProps> = props => {
  invariant(
    process.env.NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY != null,
    'Missing environment variable: NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY'
  )
  return (
    <>
      <Environment showGlobe={false} shadowDarkness={0.7} {...props} />
      <GooglePhotorealisticTileset
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY}
      />
    </>
  )
}
