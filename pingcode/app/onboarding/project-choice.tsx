import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const ProjectChoiceScreen = () => {
  const router = useRouter();

  const handleNewProject = () => {
    router.push('/onboarding/mode-theme');
  };

  const handleCloneRepo = () => {
    router.push('/onboarding/github-clone');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PingCode!</Text>
      <Text style={styles.subtitle}>Choose an option to get started:</Text>

      <TouchableOpacity style={styles.button} onPress={handleNewProject}>
        <Text style={styles.buttonText}>Create a New Project</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCloneRepo}>
        <Text style={styles.buttonText}>Clone a GitHub Repository</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ProjectChoiceScreen;