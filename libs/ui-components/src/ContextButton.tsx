import AddOutlined from '@mui/icons-material/AddOutlined'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import { Button, buttonClasses, styled, type ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

const StyledButton = styled(Button)(({ theme }) => ({
  flexGrow: 0,
  flexShrink: 0,
  height: theme.spacing(5),
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1),
  // borderRadius: 0,
  [`& .${buttonClasses.startIcon}`]: {
    marginRight: theme.spacing(0.75)
  }
}))

export interface ContextButtonProps extends Omit<ButtonProps, 'startIcon'> {
  selected?: boolean
}

export const ContextButton = forwardRef<HTMLButtonElement, ContextButtonProps>(
  ({ selected = false, children, ...props }, ref) => (
    <StyledButton
      ref={ref}
      variant='text'
      size='small'
      color={selected ? 'primary' : 'inherit'}
      {...props}
      startIcon={
        selected ? (
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
