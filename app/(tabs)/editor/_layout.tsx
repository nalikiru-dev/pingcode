import { Stack } from 'expo-router';

export default function EditorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="file-view" 
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'File View'
        }} 
      />
    </Stack>
  );
}