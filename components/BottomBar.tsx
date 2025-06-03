import { routes } from '@/constants/routes';
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
      {[
        routes['/'],
        routes['/files'],
        routes['/exams'],
        routes['/account'],
      ].map(({ icon, path }) => {
        const isActive = pathname === path;
        return (
          <Button
            key={path}
            disabled={isActive}
            mode={isActive ? 'contained-tonal' : 'text'}
            onPress={() => router.push(path as any)}
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
