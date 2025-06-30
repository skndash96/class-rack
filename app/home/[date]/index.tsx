import RecordsList from "@/components/home/RecordsList";
import { useTopbar } from '@/contexts/Topbar';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';

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