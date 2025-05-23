import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEditorStore } from '@/store/editorStore';
import CodeMirror from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript'; // Import the mode you need

const CodeEditor = () => {
  const { currentFile, updateFileContent } = useEditorStore();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (currentFile) {
      setContent(currentFile.content);
    }
  }, [currentFile]);

  const handleChange = (editor, data, value) => {
    setContent(value);
    updateFileContent(currentFile.id, value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editing: {currentFile?.name}</Text>
      <CodeMirror
        value={content}
        options={{
          lineNumbers: true,
          mode: 'javascript',
          theme: 'material', // Change to your preferred theme
        }}
        onBeforeChange={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    color: '#FFFFFF',
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
});

export default CodeEditor;