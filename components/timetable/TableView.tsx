import { numDayMap } from '@/constants/dayNum';
import { database } from '@/db';
import { Timetable } from '@/db/models/Timetable';
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
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
  const DAY_OFFSET = 1
  const cellStyle = {
    width: Math.max(40, (window.width - padding * 2 - gap * 6) / 7),
    height: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: 4
  }

  const mappedEntries = useMemo(() => {
    const maxSlots = Math.max(2, ...entries.map(entry => entry.slotNumber))

    const out = new Array(maxSlots).fill(null).map(() => new Array(7).fill(null)) as (Timetable | null)[][];

    entries.forEach(entry => {
      if (out[entry.slotNumber - 1][(entry.dayOfWeek + 7 - DAY_OFFSET) % 7] === null) {
        out[entry.slotNumber - 1][(entry.dayOfWeek + 7 - DAY_OFFSET) % 7] = entry;
      } else {
        console.warn(`Duplicate entry found for slot ${entry.slotNumber} on day ${entry.dayOfWeek}`);
      }
    });

    return out;
  }, [entries]);

  return (
    <View
      style={{
        paddingHorizontal: padding
      }}
    >
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap,
        marginBottom: gap,
      }}>
        {new Array(7).fill(null).map((_, i) => numDayMap[(i+DAY_OFFSET)%7]).map(day => (
          <Animated.Text
            entering={FadeIn}
            key={day}
            style={[
              cellStyle,
              {
                color: theme.colors.onSecondaryContainer,
                backgroundColor: theme.colors.elevation.level5,
                height: undefined,
                paddingVertical: 8,
                textAlign: 'center',
              }
            ]}
          >
            {day.substring(0, 3)}
          </Animated.Text>
        ))}
      </View>

      {mappedEntries.map((dayEntries, dayIdx) => (
        <Animated.View
          entering={FadeIn}
          key={dayIdx}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap,
            marginBottom: gap
          }}
        >
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
        </Animated.View>
      ))}
    </View>
  )
}

const enhanceTableView = withObservables([], () => ({
  entries: database.get<Timetable>('timetable').query(
    Q.sortBy('slot_number', Q.asc),
    Q.sortBy('day_of_week', Q.asc),
  ).observe()
}))

export default enhanceTableView(TableView)