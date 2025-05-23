import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

const ModeThemeScreen = ({ navigation }) => {
  const { theme, setTheme, vimMode, toggleVimMode } = useThemeStore();

  const handleNext = () => {
    navigation.navigate('summary');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Editing Mode and Theme</Text>

      <View style={styles.modeContainer}>
        <Text style={styles.label}>Editing Mode:</Text>
        <View style={styles.modeOptions}>
          <TouchableOpacity
            style={[styles.modeButton, !vimMode && styles.selectedMode]}
            onPress={() => toggleVimMode(false)}
          >
            <Text style={styles.modeText}>VSCode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, vimMode && styles.selectedMode]}
            onPress={() => toggleVimMode(true)}
          >
            <Text style={styles.modeText}>Vim</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.themeContainer}>
        <Text style={styles.label}>Select Theme:</Text>
        <View style={styles.themeOptions}>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'light' && styles.selectedTheme]}
            onPress={() => setTheme('light')}
          >
            <Text style={styles.themeText}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'dark' && styles.selectedTheme]}
            onPress={() => setTheme('dark')}
          >
            <Text style={styles.themeText}>Dark</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modeContainer: {
    marginBottom: 20,
  },
  modeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#3C3C3C',
    marginRight: 10,
  },
  selectedMode: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  themeContainer: {
    marginBottom: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#3C3C3C',
    marginRight: 10,
  },
  selectedTheme: {
    backgroundColor: '#007AFF',
  },
  themeText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default ModeThemeScreen;