import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screen/LoginScreen';
import HomeScreen from './screen/HomeScreen';
import ChatScreen from './screen/ChatScreen';
import { AuthContext } from './context/AuthContext';
import StatsScreen from './screen/StatsScreen';
import AchievementsScreen from './screen/AchievementsScreen';
import ProfileScreen from './screen/ProfileScreen';
import LobbiesScreen from './screen/LobbiesScreen';
import { ThemeProvider } from './context/ThemeContext';

const Stack = createStackNavigator();

export default () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // henüz session kontrolü yapılmadıysa hiçbir ekran gösterme

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Stats" component={StatsScreen} />
              <Stack.Screen name="Achievements" component={AchievementsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Lobbies" component={LobbiesScreen} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};
