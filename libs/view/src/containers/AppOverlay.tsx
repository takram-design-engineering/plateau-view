import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { Suspense, type FC } from 'react'

import { AppOverlayLayout } from '@takram/plateau-ui-components'

import { DeveloperPanels } from '../developer/DeveloperPanels'
import { SelectionPanel } from '../panels/SelectionPanel'
import { hideAppOverlayAtom } from '../states/app'

const MainPanel = dynamic(
  async () => (await import('../panels/MainPanel')).MainPanel,
  { ssr: false }
)

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
