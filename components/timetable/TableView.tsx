import { numDayMap } from '@/constants/dayNum';
import { database } from '@/db';
import { Timetable } from '@/db/models/Timetable';
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import React, { useMemo } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import EnhancedCell from './TableCell';

const TableView = ({
  entries
}: {
  entries: Timetable[]
}) => {
  const theme = useTheme()
  const window = useWindowDimensions()
  const padding = 16
  const gap = 4
  const cellStyle = {
    width: Math.max(40, (window.width - padding * 2 - gap * 6) / 7),
    height: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: 4
  }

  const mappedEntries = useMemo(() => {
    const maxSlots = Math.max(0, ...entries.map(entry => entry.slotNumber))

    const out = new Array(maxSlots).fill(null).map(() => new Array(7).fill(null)) as (Timetable | null)[][];

    entries.forEach(entry => {
      if (out[entry.slotNumber - 1][entry.dayOfWeek] === null) {
        out[entry.slotNumber - 1][entry.dayOfWeek] = entry;
      } else {
        console.warn(`Duplicate entry found for slot ${entry.slotNumber} on day ${entry.dayOfWeek}`);
      }
    });

    return out;
  }, [entries]);

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={{
        padding
      }}
    >
      <ScrollView style={{
        marginBottom: 12
      }} horizontal>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap
        }}>
          {numDayMap.map(day => (
            <Text key={day} style={[
              cellStyle,
              {
                backgroundColor: "transparent",
                height: undefined,
                textAlign: 'center',
              }
            ]}>
              {day.substring(0, 3)}
            </Text>
          ))}
        </View>
      </ScrollView>

      {mappedEntries.map((dayEntries, dayIdx) => (
        <View key={dayIdx} style={{
          display: 'flex',
          flexDirection: 'row',
          gap,
          marginBottom: gap
        }}>
          {dayEntries.map((entry, entryIdx) => (
            entry ? (
              <EnhancedCell
                key={entryIdx}
                entry={entry}
                subject={entry.subject.observe()}
                style={cellStyle}
              />
            ) : (
              <Surface key={entryIdx} style={cellStyle}>
                <Text style={{ color: '#999' }}>-</Text>
              </Surface>
            )
          ))}
        </View>
      ))}
    </Animated.View>
  )
}

const enhanceTableView = withObservables([], () => ({
  entries: database.get<Timetable>('timetable').query(
    Q.sortBy('slot_number', Q.asc),
    Q.sortBy('day_of_week', Q.asc),
  ).observe()
}))

export default enhanceTableView(TableView)