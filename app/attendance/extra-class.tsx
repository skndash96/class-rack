import { database } from '@/db';
import { AttendanceRecord } from '@/db/models/AttendanceRecord';
import { Subject } from '@/db/models/Subject';
import BottomSheet, {
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Button, Card, List, Portal, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-simple-toast';

const ExtraClassDrawer = ({
  subjects
}: {
  subjects: Subject[]
}) => {
  const router = useRouter();
  const theme = useTheme()
  const [date, setDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const dateComment = useMemo(() => {
    if (date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      return 'Today'
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [date])

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true)

    if (!selectedSubject) {
      setLoading(false)
      Alert.alert('Invalid Input', 'Please select a subject.')
      return
    }

    date.setHours(0, 0, 0, 0)
    try {
      await database.write(async () => {
        await database.get<AttendanceRecord>('attendance_records').create(record => {
          record.subject.set(selectedSubject)
          record.date = date
        })
      })

      Toast.show('Record added successfully', Toast.SHORT)
      router.back()
    } catch (error) {
      console.error('Error adding record:', error)
      Toast.show('Failed to add record', Toast.SHORT)
    }
  }

  return (
    <Portal>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet enablePanDownToClose onClose={router.back} backgroundStyle={{
          backgroundColor: theme.colors.elevation.level1,
        }} handleStyle={{
          backgroundColor: theme.colors.elevation.level1,
        }}>
          <BottomSheetView style={[styles.contentContainer, {
            paddingBottom: 60
          }]}>
            <Card mode='contained' style={{
              flex: 1,
              width: '100%',
              backgroundColor: 'transparent'
            }}>
              <Card.Title titleVariant='headlineSmall' title="Add Extra Class" />
              <Card.Content>
                <Text style={{
                  marginBottom: 10,
                  fontSize: 18
                }}>
                  Occurence Date:
                </Text>

                <Button
                  icon="calendar"
                  mode="elevated"
                  elevation={4}
                  style={{
                    backgroundColor: theme.colors.elevation.level4,
                  }}
                >
                  {dateComment}
                </Button>

                <Animated.View
                  entering={FadeInUp}
                >
                  <DatePicker
                    date={date || new Date()}
                    mode="date"
                    onDateChange={(date) => {
                      setDate(date)
                    }}
                    style={{
                      marginHorizontal: 'auto'
                    }}
                  />
                </Animated.View>

                <Text style={{
                  marginTop: 20,
                  marginBottom: 10,
                  fontSize: 18
                }}>
                  Select Subject: {' '}
                  <Text style={{
                    color: selectedSubject ? theme.colors.primary : theme.colors.onSurfaceDisabled,
                  }}>
                    {selectedSubject ? selectedSubject.name : 'None'}
                  </Text>
                </Text>

                <ScrollView style={{
                  backgroundColor: theme.colors.elevation.level4,
                  maxHeight: 200,
                  borderRadius: 20
                }}>
                  {subjects.map((subject) => (
                    <List.Item
                      title={subject.name}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.outlineVariant,
                        backgroundColor: selectedSubject && selectedSubject.id === subject.id ? theme.colors.primaryContainer : 'transparent',
                      }}
                      description={subject.code}
                      left={props => <List.Icon {...props} icon={(selectedSubject && selectedSubject.id === subject.id) ? "check-circle" : 'circle'} />}
                      onPress={() => setSelectedSubject(subject)}
                      key={subject.id}
                    />
                  ))}
                </ScrollView>
              </Card.Content>
              <Card.Actions style={{ marginTop: 12 }}>
                <Button onPress={() => router.back()}>Cancel</Button>
                <Button disabled={loading} mode="contained" onPress={handleSubmit}>Add</Button>
              </Card.Actions>
            </Card>
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
  }
});

const enhance = withObservables([], () => ({
  subjects: database.get<Subject>('subjects').query(Q.where("is_archived", false)).observe()
}))

const EnhancedExtraClassDrawer = enhance(ExtraClassDrawer);

export default EnhancedExtraClassDrawer;