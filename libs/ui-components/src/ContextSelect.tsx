import AddIcon from '@mui/icons-material/AddOutlined'
import {
  Select,
  Stack,
  Typography,
  filledInputClasses,
  selectClasses,
  styled,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { forwardRef, useCallback, useState, type ReactNode } from 'react'
import invariant from 'tiny-invariant'

const StyledSelect = styled(Select)(({ theme }) => ({
  flexGrow: 0,
  flexShrink: 0,
  height: theme.spacing(5),
  [`& .${selectClasses.select}`]: {
    // Increase specificity
    [`&.${selectClasses.select}`]: {
      height: '100%',
      [`&.${filledInputClasses.input}`]: {
        paddingRight: theme.spacing(3.5)
      }
    }
  },
  [`& .${selectClasses.icon}`]: {
    right: 4
  }
})) as unknown as typeof Select // For generics

const Badge = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  marginRight: -1,
  marginLeft: -1,
  borderRadius: '999px',
  color: theme.palette.getContrastText(theme.palette.primary.dark),
  backgroundColor: theme.palette.primary.light,
  fontWeight: 700,
  lineHeight: 1
}))

const StyledAddIcon = styled(AddIcon)({
  fontSize: 16
})

export interface ContextSelectProps extends SelectProps<string[]> {
  label: ReactNode
}

export const ContextSelect = forwardRef<HTMLButtonElement, ContextSelectProps>(
  ({ label, children, onChange, ...props }, ref) => {
    const [open, setOpen] = useState(false)

    const handleOpen = useCallback(() => {
      setOpen(true)
    }, [])

    const handleClose = useCallback(() => {
      setOpen(false)
    }, [])

    const handleChange = useCallback(
      (event: SelectChangeEvent<string[]>, value: ReactNode) => {
        invariant(Array.isArray(event.target.value))
        onChange?.(event, value)
        setOpen(false)
      },
      [onChange]
    )

    const renderValue = useCallback(
      (value: string[]) =>
        value.length === 0 ? (
          <Stack direction='row' spacing={0.75} alignItems='center'>
            <StyledAddIcon color='action' />
            <Typography variant='body2'>{label}</Typography>
          </Stack>
        ) : (
          <Stack direction='row' spacing={0.75}>
            <Badge>{value.length}</Badge>
            <Typography variant='body2' color='primary'>
              {label}
            </Typography>
          </Stack>
        ),
      [label]
    )

    return (
      <StyledSelect
        ref={ref}
        open={open}
        variant='filled'
        size='small'
        multiple
        displayEmpty
        renderValue={renderValue}
        {...props}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={handleChange}
      >
        {children}
      </StyledSelect>
    )
  }
)
