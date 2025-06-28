import { useTopbar } from "@/contexts/Topbar";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { IconButton } from "react-native-paper";
import TableView from "./components/TableView";

export default function Timetable() {
  const router = useRouter();
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Timetable",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          icon="pencil"
          onPress={() => router.push("/timetable/edit" as Href)}
        />
      ]
    })
  }, []))

  return (
    <ScrollView style={{
      flex: 1
    }}>
      <TableView />
    </ScrollView>
  );
}
