import LayoutWrapper from "@/components/LayoutWrapper";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
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
  )
}
