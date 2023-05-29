import { InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'

import { SearchIcon } from './icons'

export type SearchFieldProps = TextFieldProps

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (props, ref) => {
    return (
      <TextField
        ref={ref}
        {...props}
        InputProps={{
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
