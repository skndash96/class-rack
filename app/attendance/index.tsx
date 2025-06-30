import SubjectsList from "@/components/subjects/SubjectsList";
import TableView from "@/components/timetable/TableView";
import { useTopbar } from "@/contexts/Topbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";

export default function AttendanceTracker() {
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: "Attendance Tracker",
      isBackButtonVisible: false
    })
  }, []))

  return (
    <ScrollView style={{
      flex: 1
    }}>
      <TableView />
      <SubjectsList />
    </ScrollView>
  );
}
