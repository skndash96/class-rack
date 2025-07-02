import { useRouter } from 'expo-router';
import React from 'react';
import { FAB, Portal } from 'react-native-paper';

export default function FABComponent() {
  const [fabOpen, setFabOpen] = React.useState(false);
  const router = useRouter()

  return ( 
    <Portal>
      <FAB.Group
        open={fabOpen}
        style={{
          bottom: 80
        }}
        visible
        icon={fabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'calendar-check',
            label: 'Task',
            size: 'medium',
            onPress: () => {
              router.push('/calendar');
            },
          },
          {
            icon: 'school',
            label: 'Extra Class',
            size: 'medium',
            onPress: () => {
              router.push('/attendance/extra-class');
            }
          },
        ]}
        onStateChange={({ open }) => setFabOpen(!fabOpen)}
        onPress={() => {
          setFabOpen(!fabOpen);
        }}
      />
    </Portal>
  )
}