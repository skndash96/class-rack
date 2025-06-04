import LayoutWrapper from "@/components/LayoutWrapper";
import { database } from "@/db";
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <DatabaseProvider database={database}>
      <PaperProvider>
        <LayoutWrapper>
          <Stack screenOptions={{
            animation: "ios_from_right",
            animationDuration: 100,
            headerShown: false,
            contentStyle: { flex: 1 },
          }} />
        </LayoutWrapper>
      </PaperProvider>
    </DatabaseProvider>
  )
}
