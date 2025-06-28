import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import RecordsList from "./home/components/RecordsList";

export default function Index() {
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      isBackButtonVisible: false,
      rightActions: undefined
    })
  }, []))

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <RecordsList />
    </View>
  );
}
