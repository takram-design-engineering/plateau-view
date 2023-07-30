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
import { useCallback, useId, useState, type FC } from 'react'
import { ChromePicker, type ColorChangeHandler } from 'react-color'

import { type QualitativeColor } from '@takram/plateau-color-schemes'

import { ColorIcon } from './ColorIcon'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginTop: theme.spacing(-1),
  marginBottom: theme.spacing(-1),
  marginLeft: theme.spacing(-1)
}))

export interface ColorListItemProps {
  atom: PrimitiveAtom<QualitativeColor>
}

export const ColorListItem: FC<ColorListItemProps> = ({ atom }) => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const popoverProps = bindPopover(popupState)

  const [item, setItem] = useAtom(atom)
  const [color, setColor] = useState(item.color)

  const handleChange: ColorChangeHandler = useCallback(color => {
    setColor(color.hex)
  }, [])

  const handleChangeComplete: ColorChangeHandler = useCallback(
    color => {
      setItem(item => ({
        ...item,
        color: color.hex
      }))
    },
    [setItem]
  )

  return (
    <>
      <ListItem disableGutters>
        <Stack direction='row' spacing={0.5} alignItems='center'>
          <StyledIconButton {...bindTrigger(popupState)}>
            <ColorIcon color={color} />
          </StyledIconButton>
          <Typography variant='body2'>{item.name}</Typography>
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
          color={color}
          disableAlpha
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
        />
      </Popover>
    </>
  )
}
