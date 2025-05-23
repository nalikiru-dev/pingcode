import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEditorStore } from '@/store/editorStore';

const FileTree = () => {
  const { currentProject } = useEditorStore();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.fileItem}>
      <Text style={styles.fileName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Structure</Text>
      <FlatList
        data={currentProject?.files || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252526',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  fileItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  fileName: {
    color: '#FFFFFF',
  },
});

export default FileTree;