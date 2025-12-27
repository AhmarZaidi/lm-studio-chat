/**
 * src/app/(tabs)/_layout.tsx
 * Tab layout configuration
 */

import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tint,
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Hide tab bar for now
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}