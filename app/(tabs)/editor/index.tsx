import CodeEditor from '@/components/editor/CodeEditor';
import EditorHeader from '@/components/editor/EditorHeader';
import EditorTabs from '@/components/editor/EditorTabs';
import FileTree from '@/components/editor/FileTree';
import TerminalPanel from '@/components/editor/TerminalPanel';
import { sampleProjects } from '@/data/sampleProjects';
import { useEditorStore } from '@/store/editorStore';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MODES = {
  vscode: {
    name: 'VSCode',
    accent: '#007ACC',
    statusBar: '#007ACC',
    icon: 'code',
  },
  vim: {
    name: 'Vim',
    accent: '#019833',
    statusBar: '#019833',
    icon: 'terminal',
  },
};

export default function EditorScreen() {
  const dimensions = useWindowDimensions();
  const isTablet = dimensions.width >= 768;
  const [showFileTree, setShowFileTree] = useState(isTablet);
  const [showTerminal, setShowTerminal] = useState(false);
  const [mode, setMode] = useState<'vscode' | 'vim'>('vscode');
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

  // Mode switcher UI
  const ModeSwitcher = () => (
    <View style={styles.modeSwitcher}>
      {Object.entries(MODES).map(([key, val]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.modeButton,
            mode === key && { backgroundColor: val.accent + '33' },
          ]}
          onPress={() => setMode(key as 'vscode' | 'vim')}
        >
          <Text style={[styles.modeText, { color: mode === key ? val.accent : '#ccc' }]}>
            {val.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { borderTopColor: MODES[mode].statusBar }]}>
      <View style={styles.headerRow}>
        <EditorHeader 
          toggleFileTree={toggleFileTree} 
          toggleTerminal={toggleTerminal}
        />
        <ModeSwitcher />
      </View>

      <View style={styles.mainContainer}>
        {showFileTree && (
          <View style={[styles.fileTreeContainer, isTablet ? styles.fileTreeTablet : styles.fileTreeMobile]}>
            <FileTree />
          </View>
        )}

        <View style={styles.editorArea}>
          <EditorTabs  />
          <View style={styles.editorWrapper}>
            <CodeEditor  />
          </View>
          {showTerminal && (
            <View style={styles.terminalContainer}>
              <TerminalPanel toggleTerminal={toggleTerminal}/>
            </View>
          )}
        </View>
      </View>

      {/* Modern status bar always visible */}
      <View style={[styles.statusBar, { backgroundColor: MODES[mode].statusBar }]}>
        {mode === 'vim' ? (
          <>
            <Text style={styles.statusText}>-- NORMAL --</Text>
            <Text style={styles.statusHint}>:w to save | :q to quit | i to insert</Text>
          </>
        ) : (
          <Text style={styles.statusText}>VSCode Mode — Happy Coding!</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 4,
    backgroundColor: '#23272E',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    zIndex: 20,
  },
  modeSwitcher: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 8,
    alignItems: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  modeText: {
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#181A1B',
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
  editorArea: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#181A1B',
    borderRadius: 12,
    margin: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 24px #0008',
    borderWidth: 1,
    borderColor: '#23272E',
  },
  editorWrapper: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#23272E',
    boxShadow: '0 2px 8px #0004',
  },
  terminalContainer: {
    height: 120,
    backgroundColor: '#181A1B',
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  statusBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1118',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 13,
  },
  statusHint: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
});