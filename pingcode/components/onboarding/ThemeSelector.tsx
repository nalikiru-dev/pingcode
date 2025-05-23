import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'System', value: 'system' },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Theme</Text>
      {themes.map((themeOption) => (
        <TouchableOpacity
          key={themeOption.value}
          style={[styles.themeButton, theme === themeOption.value && styles.selectedButton]}
          onPress={() => setTheme(themeOption.value)}
        >
          <Text style={styles.themeText}>{themeOption.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  themeButton: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#252526',
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: '#0D72D1',
  },
  themeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ThemeSelector;