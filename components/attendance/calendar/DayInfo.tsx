import { usePreferences } from '@/contexts/Preferences'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Card, Icon, Text, useTheme } from 'react-native-paper'

export default function DayInfo({
  dateString,
  records
}: {
  dateString: string
  records: AttendanceRecord[]
}) {
  const router = useRouter()
  const theme = useTheme()
  const { attendanceThresholdPercentage } = usePreferences()

  const attendanceInfo = useMemo(() => {
    return getAttendancePercentage(records, attendanceThresholdPercentage)
  }, [records])

  return (
    <TouchableOpacity onPress={() => router.replace("/calendar/"+dateString as any)} activeOpacity={0.6}>
      <Card mode="contained" style={{
        minWidth: '90%',
        marginTop: 20
      }}>
        <Card.Title
          titleStyle={{
            fontSize: 20,
            marginBottom: -4
          }}
          subtitleStyle={{
            opacity: 0.7,
          }}
          title={new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          subtitle={"View More"}
          rightStyle={{
            marginRight: 20
          }}
          right={() => (
            <Icon
              source="chevron-right"
              size={24}
            />
          )}
        />
        
        <Card.Content style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
          marginRight: 'auto',
        }}>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8
          }}>
            <Icon color="rgba(38,255,38,0.4)" source="check-circle" size={20} />
            <Text style={{
              color: theme.colors.onSurfaceVariant
            }}>
              Present
            </Text>
            <Text>
              {attendanceInfo.totalPresent}
            </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8
          }}>
            <Icon color="rgba(255,38,38,0.5)" source="close-circle" size={20} />
            <Text style={{
              color: theme.colors.onSurfaceVariant
            }}>
              Absent
            </Text>
            <Text>
              {attendanceInfo.totalClasses - attendanceInfo.totalPresent}
            </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8
          }}>
            <Icon color="rgba(255,156,38,0.5)" source="cancel" size={20} />
            <Text style={{
              color: theme.colors.onSurfaceVariant
            }}>
              Cancelled
            </Text>
            <Text>
              {attendanceInfo.totalCancelled}
            </Text>
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
            gap: 8
          }}>
            <Icon color="rgba(56, 223, 235, 0.5)" source="eye-off" size={20} />
            <Text style={{
              color: theme.colors.onSurfaceVariant
            }}>
              Unmarked
            </Text>
            <Text>
              {attendanceInfo.totalUnmarked}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}