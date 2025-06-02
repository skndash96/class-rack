import { usePathname, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Appbar } from 'react-native-paper'
import BottomBar from './BottomBar'

const routes = {
  "/": {
    title: "Home"
  },
  "/account": {
    title: "Account"
  },
  "/files": {
    title: "Files"
  },
  "/exams": {
    title: "Exams"
  },
  "default": {
    title: "My App"
  }
}

type RouteKey = keyof typeof routes;

export default function LayoutWrapper(
  props: React.PropsWithChildren,
) {
  const router = useRouter()
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