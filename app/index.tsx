import { useTopbar } from "@/contexts/Topbar";
import { database } from "@/db";
import { AttendanceRecord } from "@/db/models/AttendanceRecord";
import { Preference } from "@/db/models/Preference";
import { Timetable } from "@/db/models/Timetable";
import { Q } from "@nozbe/watermelondb";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Button, Icon, Text, useTheme } from "react-native-paper";
import Toast from "react-native-simple-toast";
import RecordsList from "./home/components/RecordsList";

export default function Index() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.getTime();
  const { setTopBarOptions } = useTopbar();
  const router = useRouter();
  const theme = useTheme()

  useFocusEffect(useCallback(() => {
    setTopBarOptions({
      title: (
        <Button
          icon={({ color }) => <Icon source="calendar-outline" color={color} size={24} />}
          mode='text'
          textColor={theme.colors.onSurface}
          compact
          style={{
            flex: 0,
            margin: 0,
            alignSelf: 'flex-start',
            marginRight: 'auto',
          }}
          labelStyle={{
            fontSize: 20
          }}
          onPress={() => {
            router.push('/home/calendar');
          }}
        >
          {today.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
          })}
        </Button>
      ),
      isBackButtonVisible: false,
      rightActions: undefined
    })
  }, []))

  useEffect(() => {
    database.get<Preference>('preferences').query(
      Q.where('name', 'last_date_attendance_recorded')
    ).fetch()
      .then(async (prefs) => {
        const pref = prefs[0]
        let lastDate = parseInt(pref?.value || "-1", 10)

        if (lastDate && !isNaN(lastDate) && lastDate >= startOfDay) return

        const batchWriter = [] as any[]

        // TODO: serious case if device's time zone changes

        if (new Date(lastDate).setHours(0, 0, 0, 0) === lastDate) {
          const diff = startOfDay - lastDate

          if (diff >= 7 * 24 * 60 * 60 * 1000) {
            Toast.show('More than a week since last attendance!!', Toast.SHORT)
            return
          }

          while (lastDate < startOfDay) {
            lastDate += 24 * 60 * 60 * 1000

            const date = new Date(lastDate)
            const dayOfWeek = date.getDay()

            const timetables = await database.get<Timetable>('timetable').query(
              Q.where('day_of_week', dayOfWeek)
            ).fetch()

            batchWriter.push(...timetables.map(timetable => {
              return database.get<AttendanceRecord>('attendance_records').prepareCreate(record => {
                record._setRaw("date", lastDate)
                record.subjectId = timetable.subjectId
              })
            }))
          }
        }

        batchWriter.push(
          pref ? (
            pref.prepareUpdate(p => {
              p.value = startOfDay.toString()
            })
          ) : (
            database.get<Preference>('preferences').prepareCreate(p => {
              p.name = 'last_date_attendance_recorded'
              p.value = startOfDay.toString()
            })
          )
        )

        await database.write(async () => {
          await database.batch(...batchWriter)
        })

        console.log('Created attendance records for today', batchWriter.length)
      })
      .catch(err => {
        console.error('Error fetching preferences or creating records:', err)
        Toast.show('Something went wrong while creating today\'s records', Toast.SHORT)
      })
  }, [])

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Text style={{
        margin: 16,
        fontSize: 18
      }}>
        Today's Classes
      </Text>

      <RecordsList dateString={startOfDay} />
    </View>
  );
}
