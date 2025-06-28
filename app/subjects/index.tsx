import { useTopbar } from '@/contexts/Topbar';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import SubjectsList from './components/SubjectsList';

export default function Subjects() {
  const { setTopBarOptions } = useTopbar()
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
      ]
    })
  }, []))

  return (
    <View style={{
      flex: 1,
    }}>
      <SubjectsList />
    </View>
  )
}