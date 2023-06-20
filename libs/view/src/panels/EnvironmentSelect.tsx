import { alpha, styled, useTheme } from '@mui/material'
import { useAtom } from 'jotai'
import {
  bindMenu,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import NextImage from 'next/image'
import { useCallback, useId, type FC } from 'react'

import { colorModeAtom } from '@takram/plateau-shared-states'
import {
  FloatingButton,
  FloatingPanel,
  OverlayPopover,
  SelectItem,
  type SelectItemProps
} from '@takram/plateau-ui-components'

import darkMapImage from '../assets/dark_map.webp'
import elevationImage from '../assets/elevation.webp'
import lightMapImage from '../assets/light_map.webp'
import satelliteImage from '../assets/satellite.webp'
import { environmentTypeAtom } from '../states/app'

const inset = 2

const Root = styled(FloatingButton)({
  padding: 0,
  minWidth: 0
})

const StyledSelectItem = styled(SelectItem)(({ theme }) => ({
  padding: `calc(${theme.spacing(0.5)} - ${inset}px) ${theme.spacing(1)}`,
  '&:first-of-type': {
    marginTop: `calc(${theme.spacing(1)} - ${inset}px)`
  },
  '&:last-of-type': {
    marginBottom: `calc(${theme.spacing(1)} - ${inset}px)`
  }
}))

const Image = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  margin: inset,
  borderRadius: theme.shape.borderRadius - inset,
  '& img': {
    display: 'block',
    width: `calc(${theme.spacing(6)} - ${inset * 2}px)`,
    height: `calc(${theme.spacing(6)} - ${inset * 2}px)`
  },
  '&:after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    inset: 0,
    boxShadow: `inset 0 0 0 1px ${alpha('#808080', 0.1)}`,
    borderRadius: theme.shape.borderRadius - inset
  }
}))

const Label = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1)
}))

const environmentItems = {
  'light-map': {
    image: lightMapImage,
    label: '白地図'
  },
  'dark-map': {
    image: darkMapImage,
    label: '黒地図'
  },
  satellite: {
    image: satelliteImage,
    label: '衛星写真'
  },
  elevation: {
    image: elevationImage,
    label: '標高'
  }
}

const Item: FC<
  SelectItemProps & {
    item: keyof typeof environmentItems
    selectedItem?: keyof typeof environmentItems
  }
> = ({ item, selectedItem, ...props }) => (
  <StyledSelectItem {...props} selected={item === selectedItem}>
    <Image>
      <NextImage
        src={environmentItems[item].image}
        alt={environmentItems[item].label}
        placeholder='blur'
        quality={100}
        unselectable='on'
      />
    </Image>
    <Label>{environmentItems[item].label}</Label>
  </StyledSelectItem>
)

export const EnvironmentSelect: FC = () => {
  const [environmentType, setEnvironmentType] = useAtom(environmentTypeAtom)
  const [colorMode, setColorMode] = useAtom(colorModeAtom)

  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const { close } = popupState

  const handleLightMap = useCallback(() => {
    setEnvironmentType('map')
    setColorMode('light')
    close()
  }, [setEnvironmentType, setColorMode, close])

  const handleDarkMap = useCallback(() => {
    setEnvironmentType('map')
    setColorMode('dark')
    close()
  }, [setEnvironmentType, setColorMode, close])

  const handleSatellite = useCallback(() => {
    setEnvironmentType('satellite')
    setColorMode('light')
    close()
  }, [setEnvironmentType, setColorMode, close])

  const handleElevation = useCallback(() => {
    setEnvironmentType('elevation')
    setColorMode('light')
    close()
  }, [setEnvironmentType, setColorMode, close])

  const selectedItem =
    environmentType === 'map' && colorMode === 'light'
      ? 'light-map'
      : environmentType === 'map' && colorMode === 'dark'
      ? 'dark-map'
      : environmentType === 'satellite'
      ? 'satellite'
      : environmentType === 'elevation'
      ? 'elevation'
      : undefined

  const theme = useTheme()
  return (
    <>
      <Root {...bindTrigger(popupState)}>
        <Image>
          {selectedItem != null && (
            <NextImage
              src={environmentItems[selectedItem].image}
              alt={environmentItems[selectedItem].label}
            />
          )}
        </Image>
      </Root>
      <OverlayPopover
        {...bindMenu(popupState)}
        anchorOrigin={{
          horizontal: parseFloat(theme.spacing(-3.5)),
          vertical: 'top'
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
      >
        <FloatingPanel>
          <Item
            item='light-map'
            selectedItem={selectedItem}
            onClick={handleLightMap}
          />
          <Item
            item='dark-map'
            selectedItem={selectedItem}
            onClick={handleDarkMap}
          />
          <Item
            item='satellite'
            selectedItem={selectedItem}
            onClick={handleSatellite}
          />
          <Item
            item='elevation'
            selectedItem={selectedItem}
            onClick={handleElevation}
          />
        </FloatingPanel>
      </OverlayPopover>
    </>
  )
}
