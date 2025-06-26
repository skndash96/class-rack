import { numDayMap } from '@/constants/dayNum';
import { database } from '@/db';
import { Timetable } from '@/db/models/Timetable';
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import React, { useMemo } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import EnhancedCell from './TableCell';

const TableView = ({
  entries
}: {
  entries: Timetable[]
}) => {
  const window = useWindowDimensions()
  const cellWidth = Math.max(40, (window.width - 32) / 7)

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
    <View>
      <ScrollView style={{
        marginBottom: 12
      }} horizontal>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          {numDayMap.map(day => (
            <View key={day} style={[{
              width: cellWidth,
            }]}>
              <Text style={{
                textAlign: 'center'
              }}>
                {day.substring(0, 3)}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {mappedEntries.map((dayEntries, dayIdx) => (
        <View key={dayIdx} style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          {dayEntries.map((entry, entryIdx) => (
            entry ? (
              <EnhancedCell entry={entry} subject={entry.subject.observe()} />
            ) : (
              <View key={entryIdx} style={{
                width: cellWidth,
                height: 48,
                borderWidth: 1,
                borderColor: '#444',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#999' }}>-</Text>
              </View>
            )
          ))}
        </View>
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