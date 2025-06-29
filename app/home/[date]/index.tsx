import { useTopbar } from '@/contexts/Topbar';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import RecordsList from "../components/RecordsList";

export default function DatePage() {
  const { date: dateParam } = useLocalSearchParams()
  const date = new Date(dateParam as string || Date.now());
  const { setTopBarOptions } = useTopbar();

  useFocusEffect(useCallback(() => {
  setTopBarOptions({
      title: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      isBackButtonVisible: true,
      rightActions: undefined
    })
  }, []))
  
  return (
    <RecordsList dateString={dateParam} />
  )
}