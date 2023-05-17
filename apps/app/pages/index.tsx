import { AnimatePresence } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type GetServerSideProps, type NextPage } from 'next'
import Head from 'next/head'
import { Suspense, type FC } from 'react'
import invariant from 'tiny-invariant'
import UAParser from 'ua-parser-js'

import { LoadingScreen, type Platform } from '@plateau/ui-components'
import { PlateauView, platformAtom, readyAtom } from '@plateau/view'

const Loading: FC = () => {
  const ready = useAtomValue(readyAtom)
  return <AnimatePresence>{!ready && <LoadingScreen />}</AnimatePresence>
}

interface PageProps {
  platform: Platform
}

const Page: NextPage<PageProps> = ({ platform }) => {
  useHydrateAtoms([[platformAtom, platform]])
  invariant(
    process.env.NEXT_PUBLIC_PLATEAU_TERRAIN_ACCESS_TOKEN != null,
    'Missing environment variable: NEXT_PUBLIC_PLATEAU_TERRAIN_ACCESS_TOKEN'
  )
  return (
    <>
      <Head>
        <title>PLATEAU VIEW 3.0 Design & Technology Preview</title>
        <link
          rel='preload'
          as='fetch'
          crossOrigin='anonymous'
          href={`https://api.cesium.com/v1/assets/770371/endpoint?access_token=${process.env.NEXT_PUBLIC_PLATEAU_TERRAIN_ACCESS_TOKEN}`}
        />
      </Head>
      <Suspense>
        <PlateauView />
      </Suspense>
      <Loading />
    </>
  )
}

export default Page

export const getServerSideProps: GetServerSideProps<
  PageProps
> = async context => {
  const parser = new UAParser(context.req.headers['user-agent'])
  const os = parser.getOS()
  return {
    props: {
      platform:
        os.name === 'Mac OS' || os.name === 'iOS'
          ? 'mac'
          : os.name?.startsWith('Windows') === true
          ? 'windows'
          : 'other'
    }
  }
}
