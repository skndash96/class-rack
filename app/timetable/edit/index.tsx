import { useTopbar } from "@/contexts/Topbar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import EditView from "../components/EditView";

export default function Timetable() {
  const router = useRouter();
  const { setTopBarOptions } = useTopbar();
  const theme = useTheme();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Timetable",
      rightActions: [
        <IconButton
          mode="contained-tonal"
          icon={({ color, size }: { color: string; size: number }) => <AntDesign name="check" size={size} color={color} />}
          onPress={() => router.back()}
        />
      ]
    })
  }, []))

  return (
    <View style={{
      backgroundColor: theme.colors.background,
      flex: 1
    }}>
      <EditView />
    </View>
  );
}
