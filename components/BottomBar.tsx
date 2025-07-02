import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant },
      ]}
    >
      {tabs.map(({ icon, path, iconSize }) => {
        const isActive = path === "/" ? pathname.startsWith("/home") || pathname === path : pathname.startsWith(path);
        return (
          <IconButton
            key={path}
            icon={icon}
            size={iconSize}
            mode={isActive ? 'contained-tonal' : undefined}
            onPress={() => router.replace(path as any)}
            iconColor={isActive ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
            containerColor={isActive ? theme.colors.primaryContainer : undefined}
            style={styles.button}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  button: {
    borderRadius: 20,
    color: 'red'
  },
});

const tabs = [
  {
    title: 'Home',
    icon: 'home-outline',
    path: "/",
    iconSize: 28
  },
  {
    title: 'Timetable',
    icon: 'clock-outline',
    path: "/attendance/timetable",
    iconSize: 24
  },
  {
    title: 'Subjects',
    icon: 'calendar-check-outline',
    path: "/attendance/subjects",
    iconSize: 24
  },
  {
    title: 'Settings',
    icon: 'cog-outline',
    path: "/settings",
    iconSize: 24
  }
]