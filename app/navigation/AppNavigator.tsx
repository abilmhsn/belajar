"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAuth } from "../../contexts/AuthContext"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

// Auth Screens
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"

// Main Screens
import HomeScreen from "../screens/HomeScreen"
import ScanScreen from "../screens/ScanScreen"
import ResultScreen from "../screens/ResultScreen"
import HistoryScreen from "../screens/HistoryScreen"
import MapScreen from "../screens/MapScreen"
import ProfileScreen from "../screens/ProfileScreen"

import { colors } from "../theme"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => <Icon name="history" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => <Icon name="camera" size={size} color={color} />,
          tabBarLabelStyle: {
            paddingBottom: 4,
          },
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Peta",
          tabBarIcon: ({ color, size }) => <Icon name="map-marker" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Icon name="account" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              headerShown: true,
              title: "Hasil Scan",
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: "#fff",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
