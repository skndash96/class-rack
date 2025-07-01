import SubjectsList from "@/components/subjects/SubjectsList";
import TableView from "@/components/timetable/TableView";
import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";
import { IconButton, Menu, SegmentedButtons } from "react-native-paper";

export default function AttendanceTracker() {
  const { setTopBarOptions } = useTopbar();
  const router = useRouter();
  const [tab, setTab] = React.useState<"timetable" | "subjects">("subjects");
  const [moreMenuVisible, setMoreMenuVisible] = React.useState(false);

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: tab === "subjects" ? "Subjects" : "Timetable",
      isBackButtonVisible: false,
      rightActions: [
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => {
            if (tab === "subjects") {
              router.push('/attendance/subjects/edit' as any);
            } else {
              router.push('/attendance/timetable/edit' as any);
            }
          }}
        />,
        tab === "subjects" && (
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
        )
      ]
    })
  }, [tab, moreMenuVisible]))

  return (
    <View style={{
      flex: 1
    }}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        style={{
          marginHorizontal: 16,
          marginBottom: 24
        }}
        buttons={[
          {
            icon: 'note-multiple',
            value: 'subjects',
            label: 'Subjects',
          },
          {
            icon: 'clock-time-four',
            value: 'timetable',
            label: 'Timetable',
          }
        ]}
      />

      {tab === "timetable" ? (
        <TableView />
      ) : (tab === "subjects") ? (
        <SubjectsList />
      ) : null}
    </View>
  );
}
