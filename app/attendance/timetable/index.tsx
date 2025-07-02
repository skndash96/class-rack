import TableView from "@/components/timetable/TableView";
import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

export default function Timetable() {
  const { setTopBarOptions } = useTopbar();
  const router = useRouter();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Timetable",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => {
            router.push('/attendance/timetable/edit' as any);
          }}
        />
      ]
    })
  }, []))

  return (
    <View style={{
      flex: 1
    }}>
      <TableView />
    </View>
  );
}
