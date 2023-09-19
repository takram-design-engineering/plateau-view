import { keyframes, Stack, styled } from '@mui/material'
import { motion } from 'framer-motion'
import { type FC } from 'react'

// Taken from https://www.mlit.go.jp/plateau/assets/img/common/loading_sprite.png
import sprite from './assets/loading_sprite.webp'
import loadingText from './assets/loading_text.svg'

const Root = styled(motion.div)({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white'
})

const originalHeight = 20000
const originalStride = 500
const originalSteps = originalHeight / originalStride - 1

const height = 14042
const stride = 413
const steps = height / stride - 1
const top = 49

const Logo = styled('div', {
  shouldForwardProp: prop => prop !== 'size'
})<{ size: number }>(({ size }) => {
  const scale = size / originalStride
  const height = size * (stride / originalStride)
  return {
    width: size,
    height,
    marginTop: top * scale,
    marginBottom: (originalStride - stride - top) * scale,
    backgroundImage: `url(${sprite.src})`,
    backgroundSize: '100% auto',
    backgroundRepeat: 'no-repeat',
    animation: keyframes({
      '0%': {
        backgroundPositionY: 0
      },
      '100%': {
        backgroundPositionY: -height * steps
      }
    }),
    animationDuration: `${1.5 * (steps / originalSteps)}s`,
    animationTimingFunction: `steps(${steps})`,
    animationIterationCount: 1,
    animationFillMode: 'forwards'
  }
})

const Name = styled(motion.div)({
  width: loadingText.width,
  height: loadingText.height,
  backgroundImage: `url("${loadingText.src}")`
})

export const LoadingScreen: FC = () => (
  <Root
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.75 }}
  >
    <motion.div
      exit={{ transform: 'translateY(-15%)' }}
      transition={{ duration: 0.75 }}
    >
      <Stack spacing={3} alignItems='center'>
        <Logo size={200} />
        <Name
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      </Stack>
    </motion.div>
  </Root>
)
