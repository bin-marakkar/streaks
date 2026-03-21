import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAttendanceStore } from './src/store/attendanceStore';
import { useNotifications } from './src/hooks/useNotifications';
import { AppNavigator } from './src/navigation/AppNavigator';
import { lightPaperTheme, Colors } from './src/constants/theme';

/**
 * Root app component.
 * - Hydrates the attendance store from AsyncStorage on mount.
 * - Wraps the app with PaperProvider (theming) and GestureHandlerRootView.
 */
function AppContent() {
  const hydrate = useAttendanceStore((state) => state.hydrate);

  // Initialize and observe notifications
  useNotifications();

  useEffect(() => {
    // Load all persisted logged dates on app launch
    hydrate();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={lightPaperTheme}>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <AppContent />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
