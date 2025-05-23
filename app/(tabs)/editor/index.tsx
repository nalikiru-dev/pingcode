import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import EditorHeader from '@/components/editor/EditorHeader';
import CodeEditor from '@/components/editor/CodeEditor';
import FileTree from '@/components/editor/FileTree';
import TerminalPanel from '@/components/editor/TerminalPanel';
import EditorTabs from '@/components/editor/EditorTabs';
import StatusBar from '@/components/editor/StatusBar';
import { useEditorStore } from '@/store/editorStore';
import { sampleProjects } from '@/data/sampleProjects';

export default function EditorScreen() {
  const dimensions = useWindowDimensions();
  const isTablet = dimensions.width >= 768;
  const [showFileTree, setShowFileTree] = useState(isTablet);
  const [showTerminal, setShowTerminal] = useState(false);
  const { currentProject, setCurrentProject, addFile, setCurrentFile } = useEditorStore();
  
  // Initialize with sample project on first load
  useEffect(() => {
    if (!currentProject) {
      const demoProject = sampleProjects[0];
      setCurrentProject(demoProject);
      
      if (demoProject.files.length > 0) {
        setCurrentFile(demoProject.files[0].id);
      }
    }
  }, []);
  
  // Update file tree visibility when screen size changes
  useEffect(() => {
    setShowFileTree(isTablet);
  }, [isTablet]);

  const toggleFileTree = () => {
    setShowFileTree(!showFileTree);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  return (
    <SafeAreaView style={styles.container}>
      <EditorHeader 
        toggleFileTree={toggleFileTree} 
        toggleTerminal={toggleTerminal}
      />
      
      <View style={styles.mainContainer}>
        {showFileTree && (
          <View style={[styles.fileTreeContainer, isTablet ? styles.fileTreeTablet : styles.fileTreeMobile]}>
            <FileTree />
          </View>
        )}
        
        <View style={styles.editorContainer}>
          <EditorTabs />
          <CodeEditor />
        </View>
      </View>
      
      {showTerminal && (
        <View style={styles.terminalContainer}>
          <TerminalPanel />
        </View>
      )}
      
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
  fileTreeContainer: {
    backgroundColor: '#252526',
    borderRightWidth: 1,
    borderRightColor: '#3C3C3C',
  },
  fileTreeMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 10,
  },
  fileTreeTablet: {
    width: 250,
  },
  editorContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  terminalContainer: {
    height: 200,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
  },
});