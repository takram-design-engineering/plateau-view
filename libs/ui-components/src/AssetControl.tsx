import AddOutlined from '@mui/icons-material/AddOutlined'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import { Button, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

const StyledButton = styled(Button)(({ theme }) => ({
  height: '100%',
  paddingRight: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  borderRadius: 0
}))

export interface AssetControlProps extends Omit<ButtonProps, 'startIcon'> {
  active?: boolean
}

export const AssetControl = forwardRef<HTMLButtonElement, AssetControlProps>(
  ({ active = false, children, ...props }, ref) => (
    <StyledButton
      ref={ref}
      variant='text'
      size='small'
      color={active ? 'primary' : 'inherit'}
      {...props}
      startIcon={
        active ? (
          <CheckOutlined color='primary' fontSize='small' />
        ) : (
          <AddOutlined color='action' fontSize='small' />
        )
      }
    >
      {children}
    </StyledButton>
  )
)
