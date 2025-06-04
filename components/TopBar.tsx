import { useTopbar } from '@/contexts/Topbar'
import { Appbar } from 'react-native-paper'

export default function TopBar() {
  const { topBarOptions } = useTopbar()

  return (
    <Appbar.Header>
      <Appbar.Content title={topBarOptions.title || "Class Rack"} />
    </Appbar.Header>
  )
}