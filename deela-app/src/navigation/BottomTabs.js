import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AlertScreen from '../screens/AlertScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductScreen from '../screens/ProductScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    Home: '🏠',
    Search: '🔍',
    Alerts: '🔔',
    Profile: '👤',
  };
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icons[name]}</Text>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.purple,
          tabBarInactiveTintColor: COLORS.textGray,
          tabBarStyle: {
            height: 68,
            paddingTop: 8,
            paddingBottom: 12,
            backgroundColor: COLORS.white,
            borderTopColor: COLORS.cardBorder,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Search" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={AlertScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Alerts" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: { alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 20 },
  tabIconActive: {},
});