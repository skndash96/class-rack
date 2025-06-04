import { useTopbar } from '@/contexts/Topbar';
import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';

export default function Subjects() {
  const { setTopBarOptions } = useTopbar();
  
  useEffect(() => {
    setTopBarOptions({
      title: "Account"
    })
  }, [])

  return (
    <ScrollView>
      <Text>Subjects</Text>
    </ScrollView>
  )
}