import SubjectsList from "@/components/subjects/SubjectsList";
import TableView from "@/components/timetable/TableView";
import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import { Card, IconButton } from "react-native-paper";

export default function AttendanceTracker() {
  const { setTopBarOptions } = useTopbar();
  const router = useRouter();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Attendance Tracker",
      isBackButtonVisible: false,
      rightActions: []
    })
  }, []))

  return (
    <ScrollView style={{
      flex: 1
    }}>
      <Card mode="elevated" elevation={0}>
        <Card.Title
          title="Timetable"
          titleStyle={{
            fontSize: 18,
          }}
          style={{
            minHeight: 0
          }}
          right={() => (
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => {
                router.push('/attendance/timetable/edit' as any)
              }}
            />
          )}
        />
      </Card>

      <TableView />

      <Card mode="elevated" elevation={0} style={{
        marginTop: 32,
      }}>
        <Card.Title
          title="Subjects"
          titleStyle={{
            fontSize: 18
          }}
          style={{
            minHeight: 0,
          }}
          right={() => (
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => {
                router.push('/attendance/subjects/edit' as any)
              }}
            />
          )}
        />
      </Card>

      <SubjectsList />
    </ScrollView>
  );
}
