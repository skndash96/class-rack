import BottomBar from "@/components/BottomBar";
import TopBar from "@/components/TopBar";
import { TopbarProvider } from "@/contexts/Topbar";
import { database } from "@/db";
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <DatabaseProvider database={database}>
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
    </DatabaseProvider>
  )
}
