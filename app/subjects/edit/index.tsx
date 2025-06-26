import { useTopbar } from '@/contexts/Topbar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import SubjectsList from '../components/SubjectsList';

export default function Subjects() {
  const { setTopBarOptions } = useTopbar()
  const theme = useTheme()
  const router = useRouter()

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Subjects",
      rightActions: [
        <IconButton
          onPress={() => router.back()}
          mode={"contained"}
          icon={({ size, color }) => <AntDesign name={"check"} color={color} size={size} />} />,
      ]
    })
  }, []))

  return (
    <View style={{
      backgroundColor: theme.colors.background,
      flex: 1
    }}>
      <SubjectsList editMode={true} />
    </View>
  )
}