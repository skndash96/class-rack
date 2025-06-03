import { RouteKey, routes } from '@/constants/routes'
import { usePathname } from 'expo-router'
import React, { useMemo } from 'react'
import { Appbar } from 'react-native-paper'
import BottomBar from './BottomBar'


export default function LayoutWrapper(
  props: React.PropsWithChildren,
) {
  const pathname = usePathname()

  const currentRoute = useMemo(() => {
    return routes[pathname as RouteKey] || routes["default"]
  }, [pathname])

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={currentRoute.title} />
      </Appbar.Header>

      {props.children}

      <BottomBar />
    </>
  )
}