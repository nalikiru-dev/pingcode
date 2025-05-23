import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditorStore } from '@/store/editorStore';
import CodeEditor from '@/components/editor/CodeEditor';
import { ChevronLeft, Save } from 'lucide-react-native';

export default function FileViewScreen() {
  const { fileId } = useLocalSearchParams();
  const router = useRouter();
  const { getFileById, updateFileContent } = useEditorStore();
  const [file, setFile] = useState<any>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (fileId) {
      const currentFile = getFileById(fileId as string);
      if (currentFile) {
        setFile(currentFile);
        setContent(currentFile.content);
      }
    }
  }, [fileId]);

  const handleSave = () => {
    if (file) {
      updateFileContent(file.id, content);
      router.back();
    }
  };

  if (!file) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>File not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.fileName}>{file.name}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Save size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.editorContainer}>
        <CodeEditor
          file={file}
          content={content}
          onChangeContent={setContent}
          standalone
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  backButton: {
    padding: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  saveButton: {
    padding: 8,
  },
  editorContainer: {
    flex: 1,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});