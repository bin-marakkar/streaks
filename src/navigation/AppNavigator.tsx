import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { Colors, Typography } from '../constants/theme';
import { Text } from 'react-native';
import { useAttendanceStore } from '../store/attendanceStore';

export type RootStackParamList = {
  Activities: undefined;
  ActivityDetail: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const ICON_SIZE = 22;
const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji }) => (
  <Text style={{ fontSize: ICON_SIZE }}>{emoji}</Text>
);

const ActivityTabNavigator = () => {
  const { activities, selectedActivityId } = useAttendanceStore();
  const selectedActivity = activities.find(a => a.id === selectedActivityId);
  
  return (
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
          headerTitle: selectedActivity ? selectedActivity.name : 'Activity',
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
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📊" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Activities"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            ...Typography.headlineMedium,
            color: Colors.textPrimary,
          },
          headerTintColor: Colors.primary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Activities" 
          component={ActivitiesScreen} 
          options={{ title: 'Habits' }}
        />
        <Stack.Screen 
          name="ActivityDetail" 
          component={ActivityTabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
