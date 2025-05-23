import { useEditorStore } from '@/store/editorStore';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
// @ts-ignore
import SyntaxHighlighter from 'react-native-syntax-highlighter';
// @ts-ignore

interface CodeEditorProps {
  file?: any;
  content?: string;
  onChangeContent?: (content: string) => void;
  standalone?: boolean;
  mode?: 'vscode' | 'vim';
  accentColor?: string;
}

export default function CodeEditor({ 
  file, 
  content: externalContent, 
  onChangeContent,
  standalone = false,
  mode = 'vscode',
  accentColor = '#007ACC',
}: CodeEditorProps) {
  const { currentFile, files, updateFileContent } = useEditorStore();
  const { vimMode } = useThemeStore();
  const [activeFile, setActiveFile] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<TextInput>(null);

  // Determine which file to show
  useEffect(() => {
    if (standalone && file) {
      setActiveFile(file);
      setEditorContent(externalContent || '');
    } else if (currentFile) {
      const fileObj = files.find(f => f.id === currentFile);
      if (fileObj) {
        setActiveFile(fileObj);
        setEditorContent(fileObj.content);
      }
    } else {
      setActiveFile(null);
      setEditorContent('');
    }
  }, [currentFile, files, file, externalContent, standalone]);

  const handleChangeText = (text: string) => {
    setEditorContent(text);

    if (standalone && onChangeContent) {
      onChangeContent(text);
    } else if (activeFile) {
      updateFileContent(activeFile.id, text);
    }
  };

  // Handle tab key for indentation
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Tab') {
      e.preventDefault();
      const newText = editorContent.substring(0, selection.start) + '  ' +
                      editorContent.substring(selection.end);
      handleChangeText(newText);

      // Update cursor position
      setTimeout(() => {
        const newPosition = selection.start + 2;
        inputRef.current?.setNativeProps({
          selection: { start: newPosition, end: newPosition }
        });
      }, 0);
    }
  };

  if (!activeFile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No file selected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: accentColor + '55', shadowColor: accentColor }]}>
      {/* Vim mode indicator in the top left, like VSCode status bar */}
      {mode === 'vim' && (
        <View style={[styles.vimModeIndicator, { borderColor: accentColor }]}>
          <Text style={[styles.vimModeText, { color: accentColor }]}>VIM</Text>
        </View>
      )}

      <ScrollView horizontal style={styles.editorScroll} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.editorRow}>
          <View style={styles.lineNumbers}>
            {editorContent.split('\n').map((_, index) => (
              <Text key={index} style={styles.lineNumber}>
                {index + 1}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {isFocused ? (
              <TextInput
                ref={inputRef}
                style={styles.codeInput}
                value={editorContent}
                onChangeText={handleChangeText}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                onKeyPress={Platform.OS === 'web' ? handleKeyPress : undefined}
                keyboardType="ascii-capable"
                placeholder="Start coding..."
                placeholderTextColor="#444"
                textAlignVertical="top"
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
              />
            ) : (
              <TouchableWithoutFeedback onPress={() => setIsFocused(true)}>
                <View pointerEvents="box-only">
                  <SyntaxHighlighter
                    language={activeFile?.language || 'javascript'}
                   
                    highlighter="hljs"
                    customStyle={{
                      backgroundColor: 'transparent',
                      padding: 10,
                      minHeight: 300,
                      fontSize: 14.5,
                      fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
                    }}
                  >
                    {editorContent || '// Start coding...'}
                  </SyntaxHighlighter>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1.5,
    margin: 0,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#007ACC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
  editorScroll: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  editorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    minHeight: '100%',
    paddingBottom: 16,
  },
  lineNumbers: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 8,
    paddingLeft: 8,
    backgroundColor: '#23272e',
    alignItems: 'flex-end',
    minWidth: 44,
    borderRightWidth: 1,
    borderRightColor: '#222c',
  },
  lineNumber: {
    color: '#858585',
    fontSize: 13,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
  codeInput: {
    flex: 1,
    color: '#d4d4d4',
    backgroundColor: 'transparent',
    padding: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 14.5,
    lineHeight: 22,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  vimModeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#181A1B',
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 3,
    zIndex: 10,
  },
  vimModeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
});