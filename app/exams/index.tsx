import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";

export default function Exams() {
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Exams"
    })
  }, []))

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Exams page</Text>
      </View>
    </>
  );
}
