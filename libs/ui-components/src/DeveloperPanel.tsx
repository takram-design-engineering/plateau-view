import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { Button, buttonClasses, Stack, styled, Typography } from '@mui/material'
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react'

const Root = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary
}))

const ResetButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(-1.25),
  marginLeft: theme.spacing(-1),
  paddingRight: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  [`& .${buttonClasses.endIcon}`]: {
    marginLeft: theme.spacing(0.5)
  }
}))

export interface DeveloperPanelProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'title'> {
  title?: ReactNode
  onReset?: () => void
}

export const DeveloperPanel = forwardRef<HTMLDivElement, DeveloperPanelProps>(
  ({ title, onReset, children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      {(title != null || onReset != null) && (
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          justifyContent='space-between'
          marginBottom={1}
        >
          <Typography variant='subtitle1'>{title}</Typography>
          <div>
            {onReset != null && (
              <ResetButton
                variant='text'
                size='small'
                endIcon={<RestartAltIcon color='secondary' />}
                onClick={onReset}
              >
                Reset
              </ResetButton>
            )}
          </div>
        </Stack>
      )}
      {children}
    </Root>
  )
)
