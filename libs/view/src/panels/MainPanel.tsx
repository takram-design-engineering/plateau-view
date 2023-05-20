import { Divider, Stack, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, useRef, useState, type FC, type ReactNode } from 'react'

import { useWindowEvent } from '@takram/plateau-react-helpers'
import {
  FloatingPanel,
  SearchField,
  Shortcut
} from '@takram/plateau-ui-components'

import { platformAtom } from '../states/app'
import { MainMenuButton } from './MainPanel/MainMenuButton'

const Root = styled(FloatingPanel)(({ theme }) => ({}))

const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: theme.spacing(6)
}))

export interface MainPanelProps {
  children?: ReactNode
}

export const MainPanel: FC<MainPanelProps> = ({ children }) => {
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])
  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [])

  const textFieldRef = useRef<HTMLInputElement>(null)

  useWindowEvent('keydown', event => {
    // TODO: Manage shortcut globally
    if (event.key === 'k' && event.metaKey && textFieldRef.current != null) {
      event.preventDefault()
      textFieldRef.current.select()
    }
  })

  const platform = useAtomValue(platformAtom)
  return (
    <Root>
      <Search>
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <MainMenuButton />
          <Divider orientation='vertical' light />
          <SearchField
            inputRef={textFieldRef}
            variant='standard'
            fullWidth
            placeholder='データ、エリア、場所を検索'
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputProps={{
              disableUnderline: true,
              ...(!focused && {
                endAdornment: (
                  <Shortcut
                    variant='outlined'
                    platform={platform}
                    shortcutKey='K'
                    commandKey
                  />
                )
              })
            }}
            sx={{ marginX: 1.5 }}
          />
        </Stack>
      </Search>
      {children != null && (
        <>
          <Divider light />
          {children}
        </>
      )}
    </Root>
  )
}
