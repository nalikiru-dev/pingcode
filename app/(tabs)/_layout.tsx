import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Code, FolderClosed, Settings } from 'lucide-react-native';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Platform.select({
            ios: isDark ? '#0A84FF' : '#007AFF',
            android: isDark ? '#BB86FC' : '#6200EE',
          }),
          tabBarInactiveTintColor: isDark ? '#8E8E93' : '#3C3C43',
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: Platform.OS === 'ios' ? 50 + insets.bottom : 60,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFill}>
              {Platform.OS === 'ios' ? (
                <BlurView
                  tint={isDark ? 'dark' : 'light'}
                  intensity={95}
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View 
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                      borderTopWidth: 1,
                      borderTopColor: isDark ? '#3C3C3C' : '#E5E5EA',
                    }
                  ]} 
                />
              )}
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            paddingBottom: Platform.OS === 'ios' ? 0 : 4,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="editor"
          options={{
            title: 'Editor',
            tabBarIcon: ({ color, size }) => (
              <Code size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size }) => (
              <FolderClosed size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}