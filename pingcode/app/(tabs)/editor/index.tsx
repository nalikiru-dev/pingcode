import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import EditorHeader from '@/components/editor/EditorHeader';
import CodeEditor from '@/components/editor/CodeEditor';
import FileTree from '@/components/editor/FileTree';
import TerminalPanel from '@/components/editor/TerminalPanel';
import EditorTabs from '@/components/editor/EditorTabs';
import StatusBar from '@/components/editor/StatusBar';

export default function EditorScreen() {
  const [showFileTree, setShowFileTree] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const { currentProject, setCurrentProject } = useEditorStore();

  useEffect(() => {
    // Initialize with a sample project or user-selected project
    if (!currentProject) {
      // Logic to set a default or sample project
    }
  }, [currentProject]);

  const toggleFileTree = () => {
    setShowFileTree(!showFileTree);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <EditorHeader toggleFileTree={toggleFileTree} toggleTerminal={toggleTerminal} />
      <View style={styles.mainContainer}>
        {showFileTree && <FileTree />}
        <View style={styles.editorContainer}>
          <EditorTabs />
          <CodeEditor />
        </View>
      </View>
      {showTerminal && <TerminalPanel />}
      <StatusBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  editorContainer: {
    flex: 1,
  },
});