// components/BottomBar.tsx
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const tabs = [
  { label: 'Home', path: '/' },
  { label: 'Account', path: '/account' },
  { label: 'Files', path: '/files' },
  { label: 'Tasks', path: '/tasks' },
];

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
      {tabs.map(({ label, path }) => {
        const isActive = pathname === path;
        return (
          <Button
            key={path}
            mode={isActive ? 'contained-tonal' : 'text'}
            onPress={() => router.push(path as any)}
            textColor={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
            style={styles.button}
          >
            {label}
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
