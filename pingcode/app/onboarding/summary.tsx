import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import { useEditorStore } from '@/store/editorStore';

const SummaryScreen = () => {
  const navigation = useNavigation();
  const { currentProject } = useEditorStore();

  const handleFinish = () => {
    // Logic to finalize project setup
    navigation.navigate('/editor');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Summary</Text>
      <Text style={styles.subtitle}>You are about to create a new project with the following settings:</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Project Name: {currentProject?.name}</Text>
        <Text style={styles.summaryText}>Mode: {currentProject?.mode}</Text>
        <Text style={styles.summaryText}>Theme: {currentProject?.theme}</Text>
        {currentProject?.isCloning && (
          <Text style={styles.summaryText}>Cloning from: {currentProject?.githubRepo}</Text>
        )}
      </View>
      <Button title="Finish Setup" onPress={handleFinish} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: '#252526',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default SummaryScreen;