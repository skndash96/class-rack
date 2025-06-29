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
  const attendanceInfo = useMemo(() => {
    return getAttendancePercentage(records)
  }, [records])

  return (
    <View style={{
      width: '100%',
      paddingHorizontal: 20,
      marginTop: 20
    }}>
      <Button
        onPress={() => {
          router.replace(`/home/${dateString}` as any)
        }}
        contentStyle={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 'auto',
          transform: [{ translateX: -10 }],
        }}
      >
        <Text variant='titleLarge' style={{
          color: theme.colors.onSurfaceVariant
        }}>
          {new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
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
          <Text>
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
          <Text>
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
          <Icon color="rgba(255,156,38,0.5)" source="eye-off" size={20} />
          <Text>
            Cancelled
          </Text>
          <Text>
            {attendanceInfo.totalCancelled}
          </Text>
        </View>
      </View>
    </View>
  )
}