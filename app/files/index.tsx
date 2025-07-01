import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Files() {
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Files",
      isBackButtonVisible: false,
      rightActions: []
    })
  }, []))

  return (
    <View
      style={{
        flex: 1,
        padding: 20
      }}
    >
      <Text>Files page</Text>
    </View>
  );
}
