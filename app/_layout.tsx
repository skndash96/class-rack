import BottomBar from "@/components/BottomBar";
import TopBar from "@/components/TopBar";
import { darkTheme } from "@/constants/theme";
import { PreferencesProvider } from "@/contexts/Preferences";
import { TopbarProvider } from "@/contexts/Topbar";
import { Stack } from "expo-router";
import { View } from "react-native";
import { PaperProvider, useTheme } from "react-native-paper";

const Wrapper = () => {
  const theme = useTheme();

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background
    }}>
      <Stack
        screenOptions={{
          animation: "fade",
          animationDuration: 100,
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background
          }
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <PaperProvider theme={darkTheme}>
        <TopbarProvider>
          <TopBar />
          <Wrapper />
          <BottomBar />
        </TopbarProvider>
      </PaperProvider>
    </PreferencesProvider>
  )
}
