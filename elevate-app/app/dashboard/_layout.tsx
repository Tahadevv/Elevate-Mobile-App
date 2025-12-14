import { Stack } from 'expo-router';
import React from 'react';

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="announcements"
        options={{
          title: 'Announcements',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Help Center',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: 'Account Settings',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="current-subscription"
        options={{
          title: 'Subscribed Domains',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
