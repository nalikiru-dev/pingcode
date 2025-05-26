import CodeEditor from '@/components/editor/CodeEditor';
import FileTree from '@/components/editor/FileTree';
import TerminalPanel from '@/components/editor/TerminalPanel';
import { sampleProjects } from '@/data/sampleProjects';
import { useEditorStore } from '@/store/editorStore';
import { Folder, Terminal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditorScreen() {
  const dimensions = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isTablet = dimensions.width >= 768;
  const insets = useSafeAreaInsets();
  const [showFileTree, setShowFileTree] = useState(isTablet);
  const [showTerminal, setShowTerminal] = useState(false);
  const { currentProject, setCurrentProject, setCurrentFile } = useEditorStore();

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

  const toggleFileTree = () => setShowFileTree(!showFileTree);
  const toggleTerminal = () => setShowTerminal(!showTerminal);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}>
      <View style={styles.mainContainer}>
        {showFileTree && (
          <View style={[
            styles.fileTreeContainer, 
            isTablet ? styles.fileTreeTablet : styles.fileTreeMobile,
            { backgroundColor: isDark ? '#252526' : '#FFFFFF' }
          ]}>
            <FileTree />
          </View>
        )}

        <View style={styles.editorArea}>
          <View style={[
            styles.editorWrapper,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}>
            <CodeEditor />
          </View>
          {showTerminal && (
            <View style={[
              styles.terminalContainer,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}>
              <TerminalPanel toggleTerminal={toggleTerminal}/>
            </View>
          )}
        </View>
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fabButton,
            { backgroundColor: isDark ? '#252526' : '#FFFFFF' }
          ]}
          onPress={toggleFileTree}
        >
          <Folder size={22} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.fabButton,
            { backgroundColor: isDark ? '#252526' : '#FFFFFF' }
          ]}
          onPress={toggleTerminal}
        >
          <Terminal size={22} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fileTreeContainer: {
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
  editorArea: {
    flex: 1,
    flexDirection: 'column',
  },
  editorWrapper: {
    flex: 1,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  terminalContainer: {
    height: 200,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    margin: 8,
    marginTop: 0,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 100 : 76, // Account for tab bar height
    gap: 12,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});