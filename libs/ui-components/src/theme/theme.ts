import { createTheme, type ThemeOptions } from '@mui/material'
import { cyan, grey } from '@mui/material/colors'
import { type Shadows } from '@mui/material/styles/shadows'
import { merge } from 'lodash'

import { MuiButton } from './components/MuiButton'
import { MuiChip } from './components/MuiChip'
import { MuiFilledInput } from './components/MuiFilledInput'
import { MuiFormControlLabel } from './components/MuiFormControlLabel'
import { MuiIconButton } from './components/MuiIconButton'
import { MuiLink } from './components/MuiLink'
import { MuiMenu } from './components/MuiMenu'
import { MuiMenuItem } from './components/MuiMenuItem'
import { MuiOutlinedInput } from './components/MuiOutlinedInput'
import { MuiSelect } from './components/MuiSelect'
import { MuiSlider } from './components/MuiSlider'
import { MuiSvgIcon } from './components/MuiSvgIcon'
import { MuiSwitch } from './components/MuiSwitch'
import { MuiTab } from './components/MuiTab'
import { MuiTextField } from './components/MuiTextField'
import { MuiToggleButton } from './components/MuiToggleButton'
import { MuiTooltip } from './components/MuiTooltip'

// TODO: Transition to MUI Joy when it's released.

const theme = createTheme()

export const themeOptions: ThemeOptions = {
  shadows: [
    'none',
    '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 12px 0 rgba(0, 0, 0, 0.05)',
    ...Array<string>(23).fill(
      '0 0 2px 0 rgba(0, 0, 0, 0.15), 0 4px 32px rgba(0, 0, 0, 0.2)'
    )
  ] as Shadows,
  shape: {
    borderRadius: 10
  },
  palette: {
    primary: cyan,
    secondary: grey,
    text: {
      secondary: grey[600]
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'system-ui, Hiragino Sans, sans-serif',
    h1: {
      fontWeight: 600
    },
    // Major second typographic scale of 15px base.
    // https://typescale.com
    h2: {
      fontSize: theme.typography.pxToRem(25.23),
      fontWeight: 600
    },
    h3: {
      fontSize: theme.typography.pxToRem(22.43),
      fontWeight: 600
    },
    h4: {
      fontSize: theme.typography.pxToRem(19.93),
      fontWeight: 600
    },
    h5: {
      fontSize: theme.typography.pxToRem(17.72),
      fontWeight: 600
    },
    h6: {
      fontSize: theme.typography.pxToRem(15.75),
      fontWeight: 600
    },
    body1: {
      fontSize: theme.typography.pxToRem(14)
    },
    body2: {
      fontSize: theme.typography.pxToRem(12.44)
    },
    subtitle1: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 600
    },
    subtitle2: {
      fontSize: theme.typography.pxToRem(12.44),
      fontWeight: 600
    },
    caption: {
      fontSize: theme.typography.pxToRem(11.06)
    }
  },
  components: {
    MuiButton,
    MuiChip,
    MuiFilledInput,
    MuiFormControlLabel,
    MuiIconButton,
    MuiLink,
    MuiMenu,
    MuiMenuItem,
    MuiOutlinedInput,
    MuiSelect,
    MuiSlider,
    MuiSvgIcon,
    MuiSwitch,
    MuiTab,
    MuiTextField,
    MuiTooltip,
    MuiToggleButton
  }
}

export const lightThemeOptions = merge<unknown, unknown, ThemeOptions>(
  {},
  themeOptions,
  {
    palette: {
      mode: 'light',
      background: {
        default: '#ffffff'
      }
    }
  }
)

export const darkThemeOptions = merge<unknown, unknown, ThemeOptions>(
  {},
  themeOptions,
  {
    palette: {
      mode: 'dark',
      background: {
        default: grey[900]
      }
    }
  }
)

export const lightTheme = createTheme(lightThemeOptions)
export const darkTheme = createTheme(darkThemeOptions)
