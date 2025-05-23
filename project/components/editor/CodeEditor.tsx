import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useThemeStore } from '@/store/themeStore';
import SyntaxHighlighter from '@/components/editor/SyntaxHighlighter';

interface CodeEditorProps {
  file?: any;
  content?: string;
  onChangeContent?: (content: string) => void;
  standalone?: boolean;
}

export default function CodeEditor({ 
  file, 
  content: externalContent, 
  onChangeContent,
  standalone = false 
}: CodeEditorProps) {
  const { currentFile, files, updateFileContent } = useEditorStore();
  const { vimMode } = useThemeStore();
  const [activeFile, setActiveFile] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
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
    <View style={styles.container}>
      {vimMode && (
        <View style={styles.vimModeIndicator}>
          <Text style={styles.vimModeText}>VIM</Text>
        </View>
      )}
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.editorContainer}>
          <View style={styles.lineNumbers}>
            {editorContent.split('\n').map((_, index) => (
              <Text key={index} style={styles.lineNumber}>
                {index + 1}
              </Text>
            ))}
          </View>
          
          <View style={styles.codeContainer}>
            <SyntaxHighlighter 
              code={editorContent} 
              language={activeFile.language} 
            />
            
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
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100%',
  },
  lineNumbers: {
    width: 40,
    backgroundColor: '#252526',
    paddingTop: 8,
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  lineNumber: {
    color: '#858585',
    fontSize: 12,
    lineHeight: 20,
  },
  codeContainer: {
    flex: 1,
    position: 'relative',
  },
  codeInput: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: 'transparent',
    backgroundColor: 'transparent',
    caretColor: '#FFFFFF',
    padding: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 14,
    lineHeight: 20,
  },
  vimModeIndicator: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: '#CF6679',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  vimModeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});