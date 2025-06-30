import { useTopbar } from '@/contexts/Topbar'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Appbar, IconButton } from 'react-native-paper'

export default function TopBar() {
  const router = useRouter()
  const { topBarOptions } = useTopbar()

  return (
    <Appbar.Header>
      {topBarOptions.isBackButtonVisible && (
        <IconButton
          onPress={() => router.back()}
          icon="chevron-left"
          size={24}
          accessibilityLabel="Back"
        />
      )}

      <Appbar.Content title={topBarOptions.title || "Class Rack"} />

      {topBarOptions.rightActions?.map((el, index) => (
        <View key={index}>
          {el}
        </View>
      ))}
    </Appbar.Header>
  )
}