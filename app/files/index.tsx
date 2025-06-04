import { useTopbar } from "@/contexts/Topbar";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Account() {
  const { setTopBarOptions } = useTopbar();
  
  useEffect(() => {
    setTopBarOptions({
      title: "Files"
    })
  }, [])

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
