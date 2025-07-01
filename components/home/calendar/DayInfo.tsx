import { usePreferences } from '@/contexts/Preferences'
import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Button, Icon, Text, useTheme } from 'react-native-paper'

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
    <View style={{
      width: '100%',
      paddingHorizontal: 20,
      marginTop: 20
    }}>
      <Button
        onPress={() => {
          const today = new Date().setHours(0, 0, 0, 0)
          if (new Date(dateString).setHours(0, 0, 0, 0) !== today) {
            router.replace(`/home/${dateString}` as any)
          } else {
            router.back()
          }
        }}
        style={{
          marginBottom: 20
        }}
        contentStyle={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text variant='titleLarge' style={{
          color: theme.colors.onSurface
        }}>
          {new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>

        <View style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 100,
          aspectRatio: 1,
          transform: [{ translateX: 10 }, { translateY: 2 }],
        }}>
          <Icon
            source="arrow-right"
            color={theme.colors.onPrimary}
            size={24}
          />
        </View>
      </Button>

      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
      </View>
    </View>
  )
}