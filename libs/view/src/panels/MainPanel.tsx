import { Divider, Stack, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, useRef, useState, type FC } from 'react'

import { useWindowEvent } from '@plateau/react-helpers'
import { FloatingPanel, SearchField, Shortcut } from '@plateau/ui-components'

import { MainMenuButton } from '../containers/MainMenuButton'
import { platformAtom } from '../states/app'

const Root = styled(FloatingPanel)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: theme.spacing(6)
}))

export const MainPanel: FC = () => {
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])
  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [])

  const textFieldRef = useRef<HTMLInputElement>(null)

  useWindowEvent('keydown', event => {
    if (event.key === 'k' && event.metaKey && textFieldRef.current != null) {
      event.preventDefault()
      textFieldRef.current.select()
    }
  })

  const platform = useAtomValue(platformAtom)
  return (
    <Root>
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
    </Root>
  )
}
