import { useTopbar } from '@/contexts/Topbar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import SubjectsList from './components/SubjectsList';

export default function Subjects() {
  const { setTopBarOptions } = useTopbar()
  const theme = useTheme()
  const router = useRouter()

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Subjects",
      rightActions: [
        <IconButton
          onPress={() => router.push("/subjects/edit" as Href)}
          icon={({size, color}) => <AntDesign name={"edit"} color={color} size={size} />} />,
      ]
    })
  }, []))

  return (
    <ScrollView style={{
      backgroundColor: theme.colors.background,
      flex: 1
    }}>
      <SubjectsList />
    </ScrollView>
  )
}