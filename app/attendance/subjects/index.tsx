import SubjectsList from "@/components/subjects/SubjectsList";
import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";
import { IconButton, Menu } from "react-native-paper";

export default function AttendanceTracker() {
  const { setTopBarOptions } = useTopbar();
  const router = useRouter();
  const [moreMenuVisible, setMoreMenuVisible] = React.useState(false);

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Subjects",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => {
            router.push('/attendance/subjects/edit' as any);
          }}
        />,
        <Menu
          visible={moreMenuVisible}
          onDismiss={() => setMoreMenuVisible(false)}
          anchorPosition='bottom'
          anchor={<IconButton
            icon="dots-vertical"
            onPress={() => setMoreMenuVisible(!moreMenuVisible)}
            size={24}
          />}>

          <Menu.Item onPress={() => {
            setMoreMenuVisible(false)
            router.push("/attendance/subjects/archived")
          }} title="Archived" />
        </Menu>
      ]
    })
  }, [moreMenuVisible]))

  return (
    <View style={{
      flex: 1
    }}>
      <SubjectsList />
    </View>
  );
}
