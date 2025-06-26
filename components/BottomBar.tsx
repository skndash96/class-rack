import AntDesign from '@expo/vector-icons/AntDesign';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

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
        const isActive = path === "/" ? pathname === path : pathname.startsWith(path);
        return (
          <Button
            key={path}
            disabled={isActive}
            mode={isActive ? 'contained-tonal' : 'text'}
            onPress={() => router.replace(path as any)}
            style={styles.button}
          >
            <AntDesign name={icon as any} size={24} color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant} />
          </Button>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  button: {
    borderRadius: 20,
  },
});

const tabs = [
  {
    title: 'Home',
    icon: 'home',
    path: "/"
  },
  {
    title: 'Files',
    icon: 'folderopen',
    path: "/subjects"
  },
  {
    title: 'Timetable',
    icon: 'table',
    path: "/timetable"
  },
  {
    title: 'Account',
    icon: 'user',
    path: "/account"
  }
]