import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEditorStore } from '@/store/editorStore';

const EditorHeader = () => {
  const { currentProject } = useEditorStore();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.projectName}>{currentProject ? currentProject.name : 'Untitled Project'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#252526',
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  projectName: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EditorHeader;