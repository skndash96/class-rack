import { database } from '@/db';
import { AttendanceRecord } from '@/db/models/AttendanceRecord';
import BottomSheet, {
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { withObservables } from '@nozbe/watermelondb/react';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon, Portal, useTheme } from 'react-native-paper';
import DayComponent from './components/Day';
import DayInfo from './components/DayInfo';

const CalendarPage = ({
  records
}: {
  records: AttendanceRecord[]
}) => {
  const router = useRouter();
  const { height } = useWindowDimensions()
  const theme = useTheme()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const groupedRecords = useMemo(() => {
    const grouped = new Map<string, AttendanceRecord[]>();

    records.forEach(record => {
      const d = new Date(record.date)
      const date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }

      grouped.get(date)!.push(record);
    });

    return grouped;
  }, [records])

  const handleDayPress = (date?: DateData | undefined) => {
    setSelectedDate(date!.dateString);
  }

  return (
    <Portal>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet enablePanDownToClose onClose={router.back} backgroundStyle={{
          backgroundColor: theme.colors.elevation.level5,
        }} handleStyle={{
          backgroundColor: theme.colors.elevation.level5,
        }}>
          <BottomSheetView style={[styles.contentContainer, {
            height: height * 0.9
          }]}>
            <Calendar
              firstDay={1}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                }
              }}
              renderArrow={(direction) => (
                <Icon
                  source={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                  color={theme.colors.primary}
                  size={24}
                />
              )}
              style={{
                minWidth: '100%',
                backgroundColor: theme.colors.elevation.level2
              }}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: theme.colors.onSurfaceVariant,
                dayTextColor: theme.colors.onSurface,
                textDisabledColor: theme.colors.onSurfaceDisabled,
                monthTextColor: theme.colors.onSurfaceVariant,
                todayTextColor: theme.colors.primary,
                selectedDayBackgroundColor: theme.colors.inversePrimary,
                selectedDayTextColor: theme.colors.onPrimaryContainer,
              }}
              dayComponent={(props) => (
                <DayComponent
                  {...props}
                  records={groupedRecords.get(props.date!.dateString) || []}
                  onPress={handleDayPress}
                />
              )}
            />

            <DayInfo
              dateString={selectedDate}
              records={groupedRecords.get(selectedDate) || []}
            />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center'
  },
});

const enhanceCalendar = withObservables([], () => ({
  records: database.get<AttendanceRecord>('attendance_records').query().observeWithColumns(['status'])
}))

const EnhancedCalendar = enhanceCalendar(CalendarPage);

export default EnhancedCalendar;