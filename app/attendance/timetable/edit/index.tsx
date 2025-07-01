import EditView from "@/components/timetable/edit/EditView";
import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

export default function Timetable() {
  const router = useRouter();
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Timetable",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          mode="contained-tonal"
          icon="check"
          onPress={() => router.back()}
        />
      ]
    })
  }, []))

  return (
    <View style={{
      flex: 1
    }}>
      <EditView />
    </View>
  );
}
