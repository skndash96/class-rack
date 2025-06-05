import BottomBar from "@/components/BottomBar";
import TopBar from "@/components/TopBar";
import { TopbarProvider } from "@/contexts/Topbar";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <TopbarProvider>
        <TopBar />
        <Stack screenOptions={{
          animation: "ios_from_right",
          animationDuration: 100,
          headerShown: false,
          contentStyle: { flex: 1 },
        }} />
        <BottomBar />
      </TopbarProvider>
    </PaperProvider>
  )
}
