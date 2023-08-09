import {
  Divider,
  IconButton,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  type IconButtonProps
} from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import {
  bindMenu,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { forwardRef, useCallback, useId, useRef, type MouseEvent } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'
import {
  PlateauLogotype,
  PlateauSymbol,
  SelectItem,
  Shortcut
} from '@takram/plateau-ui-components'

import { hideAppOverlayAtom, showDeveloperPanelsAtom } from '../states/app'

export interface MainMenuButtonProps extends Omit<IconButtonProps, 'onClick'> {
  onClick?: (event: MouseEvent<HTMLElement>, name: string) => void
}

export const MainMenuButton = forwardRef<
  HTMLButtonElement,
  MainMenuButtonProps
>(({ onClick, ...props }, ref) => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })

  const [hideAppOverlay, setHideAppOverlay] = useAtom(hideAppOverlayAtom)
  const [showDeveloperPanels, setShowDeveloperPanels] = useAtom(
    showDeveloperPanelsAtom
  )

  const onClickRef = useRef(onClick)
  onClickRef.current = onClick
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const name = event.currentTarget.dataset.name
      if (name == null) {
        popupState.close()
        return
      }
      switch (name) {
        case 'hide-ui':
          setHideAppOverlay(value => !value)
          break
        case 'developer':
          setShowDeveloperPanels(value => !value)
          break
      }
      onClickRef.current?.(event, name)
      popupState.close()
    },
    [popupState, setHideAppOverlay, setShowDeveloperPanels]
  )

  const platform = useAtomValue(platformAtom)
  return (
    <>
      <IconButton
        ref={ref}
        aria-label='メインメニュー'
        {...bindTrigger(popupState)}
        {...props}
      >
        <PlateauSymbol sx={{ fontSize: 24 }} />
      </IconButton>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top'
        }}
      >
        <MenuItem
          component='a'
          href='https://www.mlit.go.jp/plateau/'
          target='_blank'
          rel='noopener noreferrer'
          onClick={handleClick}
        >
          <PlateauLogotype sx={{ height: 32, marginX: 2, marginY: 1 }} />
        </MenuItem>
        <Divider />
        <SelectItem
          component='a'
          href='https://www.geospatial.jp/ckan/dataset/plateau'
          target='_blank'
          rel='noopener noreferrer'
          onClick={handleClick}
        >
          3D都市モデルダウンロード
        </SelectItem>
        <SelectItem disabled data-name='help' onClick={handleClick}>
          ヘルプ
        </SelectItem>
        <SelectItem disabled data-name='feedback' onClick={handleClick}>
          フィードバック
        </SelectItem>
        <Divider />
        <SelectItem
          selected={showDeveloperPanels}
          data-name='hide-ui'
          onClick={handleClick}
        >
          UIを{hideAppOverlay ? '表示' : '隠す'}
          <ListItemSecondaryAction>
            <Shortcut platform={platform} shortcutKey='/' commandKey />
          </ListItemSecondaryAction>
        </SelectItem>
        <SelectItem
          selected={showDeveloperPanels}
          data-name='developer'
          onClick={handleClick}
        >
          開発者パネル
          <ListItemSecondaryAction>
            <Shortcut platform={platform} shortcutKey='\' commandKey />
          </ListItemSecondaryAction>
        </SelectItem>
      </Menu>
    </>
  )
})
