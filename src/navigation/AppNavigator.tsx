import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { Colors, Typography } from '../constants/theme';

type TabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/** Tab icon font size */
const ICON_SIZE = 22;

const tabIcon = (name: string) => name;

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            ...Typography.headlineMedium,
            color: Colors.textPrimary,
          },
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopWidth: 0,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textDisabled,
          tabBarLabelStyle: {
            ...Typography.labelMedium,
            marginTop: 2,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Today',
            headerTitle: 'Streak Counter',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="🏠" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            title: 'Calendar',
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="📅" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: 'Stats',
            tabBarLabel: 'Stats',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="📊" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Simple emoji-based tab icon since @expo/vector-icons is already available
import { Text } from 'react-native';
const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji }) => (
  <Text style={{ fontSize: ICON_SIZE }}>{emoji}</Text>
);
