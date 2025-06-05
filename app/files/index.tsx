import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";

export default function Files() {
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Files"
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
        <Text>Files page</Text>
      </View>
    </>
  );
}
