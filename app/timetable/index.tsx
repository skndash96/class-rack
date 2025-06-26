import { useTopbar } from "@/contexts/Topbar";
import AntDesign from "@expo/vector-icons/AntDesign";
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
      rightActions: [
        <IconButton
          icon={({ color, size }: { color: string; size: number }) => <AntDesign name="edit" size={size} color={color} />}
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
