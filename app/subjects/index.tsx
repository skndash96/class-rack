import SubjectsList from '@/components/subjects/SubjectsList';
import { useTopbar } from '@/contexts/Topbar';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

export default function Subjects() {
  const { setTopBarOptions } = useTopbar()
  const [moreMenuVisible, setMoreMenuVisible] = useState(false)
  const router = useRouter()

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Subjects",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          onPress={() => router.push("/subjects/edit" as Href)}
          icon="pencil"
        />,
        <Menu
          visible={moreMenuVisible}
          onDismiss={() => setMoreMenuVisible(false)}
          anchorPosition='bottom'
          anchor={<IconButton
            icon="dots-vertical"
            onPress={() => setMoreMenuVisible(!moreMenuVisible)}
            size={24}
          />}>
          <Menu.Item onPress={() => {
            setMoreMenuVisible(false)
            router.push("/subjects/archived")
          }} title="Archived" />
        </Menu>
      ]
    })
  }, [moreMenuVisible]))

  return (
    <View style={{
      flex: 1,
    }}>
      <SubjectsList />
    </View>
  )
}