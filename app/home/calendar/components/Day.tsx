import { AttendanceRecord } from '@/db/models/AttendanceRecord'
import { getAttendancePercentage } from '@/utils/getAttendancePercentage'
import React, { useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { DateData } from 'react-native-calendars'
import { DayProps } from 'react-native-calendars/src/calendar/day'
import { useTheme } from 'react-native-paper'

export default function DayComponent({
  date,
  state,
  marking,
  records,
  onPress
}: DayProps & {
  date?: DateData;
  records: AttendanceRecord[]
  onPress: (date: DateData) => void
}) {
  const theme = useTheme()

  const type = useMemo(() => {
    return getAttendancePercentage(records).markingColor
  }, [records])

  return (
    <TouchableOpacity style={{
      aspectRatio: 1,
      borderRadius: 100,
      backgroundColor: marking?.selected ? theme.colors.primary : 'transparent',
    }} activeOpacity={0.7} onPress={() => onPress(date!)}>
      <Text style={{
        color: marking?.selected ? theme.colors.onPrimary : state === 'today' ? theme.colors.primary : state === 'disabled' ? theme.colors.onSurfaceDisabled : theme.colors.onSurface,
        fontWeight: state === 'selected' ? 'bold' : 'normal',
        textAlign: 'center',
        padding: 8,
        borderRadius: 4,
        verticalAlign: 'middle',
      }}>
        {date!.day}
      </Text>
      
      <View style={{
        width: 5,
        aspectRatio: 1,
        borderRadius: 5,
        marginHorizontal: 'auto',
        backgroundColor: type,
        transform: [{ translateY: -4 }],
      }} />
    </TouchableOpacity>
  )
}