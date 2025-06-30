import SubjectsList from '@/components/subjects/SubjectsList';
import { useTopbar } from '@/contexts/Topbar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function Subjects() {
  const { setTopBarOptions } = useTopbar()
  const router = useRouter()

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Subjects",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          onPress={() => router.back()}
          mode={"contained"}
          icon="check"
        />
      ]
    })
  }, []))

  return (
    <View style={{
      flex: 1
    }}>
      <SubjectsList editMode={true} />
    </View>
  )
}