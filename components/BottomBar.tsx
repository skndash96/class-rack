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
      {tabs.map(({ icon, path }) => {
        const isActive = path === "/" ? pathname.startsWith("/home") || pathname === path : pathname.startsWith(path);
        return (
          <IconButton
            key={path}
            icon={icon}
            size={28}
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
    path: "/"
  },
  {
    title: 'Timetable',
    icon: 'clock-time-four-outline',
    path: "/attendance"
  },
  {
    title: 'Tasks',
    icon: 'note-multiple-outline',
    path: "/tasks"
  },
  {
    title: 'Account',
    icon: 'account-outline',
    path: "/account"
  }
]