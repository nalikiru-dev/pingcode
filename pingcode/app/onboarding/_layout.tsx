import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="project-choice" />
      <Stack.Screen name="github-clone" />
      <Stack.Screen name="mode-theme" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}