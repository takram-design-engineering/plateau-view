import {
  IconButton,
  ListItem,
  Popover,
  Stack,
  styled,
  Typography
} from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useCallback, useId, useRef, useState, type FC } from 'react'
import { ChromePicker, type ColorChangeHandler } from 'react-color'

import { type QualitativeColor } from '@takram/plateau-datasets'

import { ColorIcon } from './ColorIcon'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginTop: theme.spacing(-1),
  marginBottom: theme.spacing(-1),
  marginLeft: theme.spacing(-1)
}))

export interface ColorSetListItemProps {
  colorAtom: PrimitiveAtom<QualitativeColor>
  continuous?: boolean
  onChange?: () => void
}

export const ColorSetListItem: FC<ColorSetListItemProps> = ({
  colorAtom,
  continuous = false,
  onChange
}) => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const popoverProps = bindPopover(popupState)

  const [color, setColor] = useAtom(colorAtom)
  const [indeterminateColor, setIndeterminateColor] = useState(color.color)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const handleChange: ColorChangeHandler = useCallback(
    result => {
      setIndeterminateColor(result.hex)
      if (continuous) {
        setColor(color => ({
          ...color,
          color: result.hex
        }))
        onChangeRef.current?.()
      }
    },
    [continuous, setColor]
  )

  const handleChangeComplete: ColorChangeHandler = useCallback(
    result => {
      setColor(color => ({
        ...color,
        color: result.hex
      }))
      onChangeRef.current?.()
    },
    [setColor]
  )

  return (
    <>
      <ListItem disableGutters>
        <Stack direction='row' spacing={0.5} alignItems='center'>
          <StyledIconButton {...bindTrigger(popupState)}>
            <ColorIcon color={indeterminateColor} />
          </StyledIconButton>
          <Typography variant='body2'>{color.name}</Typography>
        </Stack>
      </ListItem>
      <Popover
        {...popoverProps}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top'
        }}
      >
        <ChromePicker
          color={indeterminateColor}
          disableAlpha
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
        />
      </Popover>
    </>
  )
}
