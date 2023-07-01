import AddOutlined from '@mui/icons-material/AddOutlined'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import {
  Button,
  buttonClasses,
  Divider,
  filledInputClasses,
  Select,
  selectClasses,
  Stack,
  styled,
  type ButtonProps,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { forwardRef, useCallback, useState, type ReactNode } from 'react'
import invariant from 'tiny-invariant'

import { DropDownIcon } from './icons/DropDownIcon'

const StyledButton = styled(Button)(({ theme }) => ({
  height: theme.spacing(5),
  paddingRight: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  [`& .${buttonClasses.startIcon}`]: {
    marginRight: theme.spacing(0.75)
  }
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  height: theme.spacing(5),
  [`& .${selectClasses.select}`]: {
    // Increase specificity
    [`&.${selectClasses.select}`]: {
      height: '100%',
      [`&.${filledInputClasses.input}`]: {
        paddingRight: theme.spacing(2)
      }
    }
  },
  [`& .${selectClasses.icon}`]: {
    left: '50%',
    transform: 'translate(-50%, 0)'
  }
})) as unknown as typeof Select // For generics

const StyledDivider = styled(Divider)(({ theme }) => ({
  height: theme.spacing(2),
  marginRight: -1
}))

const renderValue = (): null => null

export interface ContextButtonSelectProps
  extends Omit<SelectProps<string>, 'onClick'> {
  label: ReactNode
  onClick?: ButtonProps['onClick']
}

export const ContextButtonSelect = forwardRef<
  HTMLDivElement,
  ContextButtonSelectProps
>(({ label, value, onChange, onClick, children, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>, value: ReactNode) => {
      const values = event.target.value
      invariant(Array.isArray(values))
      event.target.value = values[values.length - 1] ?? ''
      onChange?.(event as SelectChangeEvent<string>, value)
      setOpen(false)
    },
    [onChange]
  )

  const selected = value != null && value !== ''

  return (
    <Stack ref={forwardedRef} direction='row' alignItems='center' height='100%'>
      <StyledButton
        variant='text'
        size='small'
        color={selected ? 'primary' : 'inherit'}
        startIcon={
          selected ? (
            <CheckOutlined color='primary' fontSize='small' />
          ) : (
            <AddOutlined color='action' fontSize='small' />
          )
        }
        onClick={onClick}
      >
        {label}
      </StyledButton>
      <StyledDivider orientation='vertical' variant='middle' light />
      <StyledSelect
        open={open}
        variant='filled'
        size='small'
        multiple
        value={value != null && value !== '' ? [value] : []}
        IconComponent={DropDownIcon}
        {...(props as SelectProps<string[]>)}
        renderValue={renderValue}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={handleChange}
      >
        {children}
      </StyledSelect>
    </Stack>
  )
})
