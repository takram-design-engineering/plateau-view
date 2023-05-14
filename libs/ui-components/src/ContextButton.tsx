import AddOutlined from '@mui/icons-material/AddOutlined'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import { Button, buttonClasses, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

const StyledButton = styled(Button)(({ theme }) => ({
  height: `calc(100% - ${theme.spacing(1)})`,
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1),
  // borderRadius: 0,
  [`& .${buttonClasses.startIcon}`]: {
    marginRight: theme.spacing(0.75)
  }
}))

export interface ContextButtonProps extends Omit<ButtonProps, 'startIcon'> {
  active?: boolean
}

export const ContextButton = forwardRef<HTMLButtonElement, ContextButtonProps>(
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
