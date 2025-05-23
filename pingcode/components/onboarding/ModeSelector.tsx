import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

const ModeSelector = ({ onSelectMode }) => {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>
        Select Your Editing Mode
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMode('vscode')}>
          <Text style={styles.buttonText}>VSCode Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMode('vim')}>
          <Text style={styles.buttonText}>Vim Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default ModeSelector;