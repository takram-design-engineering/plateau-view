import {
  Box,
  Stack,
  styled,
  type BoxProps,
  type StackProps
} from '@mui/material'
import { forwardRef, type PropsWithoutRef } from 'react'

export interface FlexProps
  extends PropsWithoutRef<BoxProps>,
    PropsWithoutRef<StackProps> {
  constrained?: boolean
  stack?: boolean
}

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'constrained'
})<{
  constrained?: boolean
}>(({ constrained = false }) => ({
  ...(constrained
    ? { flexGrow: 0, flexShrink: 0 }
    : { flexGrow: 1, flexShrink: 1 })
}))

const StyledStack = styled(Stack, {
  shouldForwardProp: prop => prop !== 'constrained'
})<{
  constrained?: boolean
}>(({ constrained = false }) => ({
  ...(constrained
    ? { flexGrow: 0, flexShrink: 0 }
    : { flexGrow: 1, flexShrink: 1 })
}))

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ stack = false, children, ...props }, ref) =>
    stack ? (
      <StyledStack ref={ref} {...props}>
        {children}
      </StyledStack>
    ) : (
      <StyledBox ref={ref} {...props}>
        {children}
      </StyledBox>
    )
)
