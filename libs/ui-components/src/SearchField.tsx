import SearchIcon from '@ant-design/icons/SearchOutlined'
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import { forwardRef } from 'react'

import { AntIcon } from './AntIcon'

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
              <AntIcon IconComponent={SearchIcon} />
            </InputAdornment>
          ),
          ...props.InputProps
        }}
      />
    )
  }
)
