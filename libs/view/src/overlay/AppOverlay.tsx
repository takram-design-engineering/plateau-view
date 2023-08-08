import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { Suspense, type FC } from 'react'

import { AppOverlayLayout } from '@takram/plateau-ui-components'

import { DeveloperPanels } from '../developer/DeveloperPanels'
import { hideAppOverlayAtom } from '../states/app'
import { SelectionPanel } from './SelectionPanel'

const MainPanel = dynamic(async () => (await import('./MainPanel')).MainPanel, {
  ssr: false
})

export const AppOverlay: FC = () => {
  const hidden = useAtomValue(hideAppOverlayAtom)
  return (
    <AppOverlayLayout
      hidden={hidden}
      main={
        <Suspense>
          <MainPanel />
        </Suspense>
      }
      aside={<SelectionPanel />}
      developer={<DeveloperPanels />}
    />
  )
}