import AddIcon from '@mui/icons-material/AddOutlined'
import {
  filledInputClasses,
  Select,
  selectClasses,
  Stack,
  styled,
  Typography,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { mergeRefs } from 'react-merge-refs'
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
  ({ label, children, onChange, ...props }, forwardedRef) => {
    const [open, setOpen] = useState(false)

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

    // WORKAROUND: https://github.com/mui/material-ui/issues/25578#issuecomment-1104779355
    const ref = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLUListElement>(null)
    useEffect(() => {
      const handler = (event: MouseEvent): void => {
        if (!(event.target instanceof Node)) {
          return
        }
        if (ref.current?.contains(event.target) === true) {
          setOpen(true)
        } else if (menuRef.current?.contains(event.target) !== true) {
          setOpen(false)
        }
      }
      window.addEventListener('mouseup', handler)
      return () => {
        window.removeEventListener('mouseup', handler)
      }
    }, [])

    return (
      <StyledSelect
        ref={mergeRefs([ref, forwardedRef])}
        open={open}
        variant='filled'
        size='small'
        multiple
        displayEmpty
        renderValue={renderValue}
        {...props}
        onChange={handleChange}
        MenuProps={{
          ...props.MenuProps,
          MenuListProps: {
            ...props.MenuProps?.MenuListProps,
            ref: menuRef
          }
        }}
      >
        {children}
      </StyledSelect>
    )
  }
)
