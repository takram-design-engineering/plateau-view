import {
  InputAdornment,
  styled,
  TextField,
  type TextFieldProps
} from '@mui/material'
import { forwardRef } from 'react'

import { SearchIcon } from './icons'

const StyledTextField = styled(TextField)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: theme.spacing(6),
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`
}))

export type SearchFieldProps = TextFieldProps

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (props, ref) => {
    return (
      <StyledTextField
        ref={ref}
        variant='standard'
        fullWidth
        {...props}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon sx={{ fontSize: 26 }} />
            </InputAdornment>
          ),
          ...props.InputProps
        }}
      />
    )
  }
)
