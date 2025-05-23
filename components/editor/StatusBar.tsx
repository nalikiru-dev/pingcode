import { View, Text, StyleSheet } from 'react-native';
import { useEditorStore } from '@/store/editorStore';

export default function StatusBar() {
  const { currentFile, getFileById } = useEditorStore();
  
  const file = currentFile ? getFileById(currentFile) : null;
  const language = file?.language || 'plaintext';
  
  return (
    <View style={styles.container}>
      <Text style={styles.languageText}>{language.toUpperCase()}</Text>
      <Text style={styles.statusText}>Ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});