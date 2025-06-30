import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Account() {
  const { setTopBarOptions } = useTopbar();
  
  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Account",
      isBackButtonVisible: false
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
        <Text>Account page</Text>
      </View>
    </>
  );
}
