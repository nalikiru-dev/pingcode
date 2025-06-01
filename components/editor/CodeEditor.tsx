import { useEditorStore } from '@/store/editorStore';
import { useThemeStore } from '@/store/themeStore';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Register commonly used languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('bash', bash);

// VSCode theme colors
const THEME_COLORS = {
  keyword: '#569CD6',
  builtin: '#4EC9B0',
  type: '#4EC9B0',
  literal: '#569CD6',
  number: '#B5CEA8',
  regexp: '#D16969',
  string: '#CE9178',
  subst: '#D4D4D4',
  symbol: '#D4D4D4',
  class: '#4EC9B0',
  function: '#DCDCAA',
  title: '#DCDCAA',
  params: '#D4D4D4',
  comment: '#6A9955',
  doctag: '#608B4E',
  meta: '#9B9B9B',
  'meta-keyword': '#9B9B9B',
  'meta-string': '#CE9178',
  section: '#D4D4D4',
  tag: '#569CD6',
  name: '#569CD6',
  attr: '#9CDCFE',
  attribute: '#9CDCFE',
  variable: '#9CDCFE',
  bullet: '#D4D4D4',
  code: '#D4D4D4',
  emphasis: '#D4D4D4',
  strong: '#D4D4D4',
  formula: '#D4D4D4',
  link: '#569CD6',
  quote: '#6A9955',
  'selector-tag': '#D7BA7D',
  'selector-id': '#D7BA7D',
  'selector-class': '#D7BA7D',
  'selector-attr': '#9CDCFE',
  'selector-pseudo': '#D7BA7D',
  'template-tag': '#569CD6',
  'template-variable': '#9CDCFE',
  addition: '#6A9955',
  deletion: '#F44747',
  operator: '#D4D4D4',
  default: '#D4D4D4',
} as const;

type ThemeColorKey = keyof typeof THEME_COLORS;

interface CodeEditorProps {
  file?: any;
  content?: string;
  onChangeContent?: (content: string) => void;
  standalone?: boolean;
}

export default function CodeEditor({
  file,
  content: externalContent = '',
  onChangeContent,
  standalone = false,
}: CodeEditorProps) {
  const { currentFile, files, updateFileContent } = useEditorStore();
  const { vimMode } = useThemeStore();
  const [activeFile, setActiveFile] = useState<any>(null);
  const [editorContent, setEditorContent] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [vimState, setVimState] = useState<'normal' | 'insert' | 'visual'>('normal');
  const [commandBuffer, setCommandBuffer] = useState('');
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

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
    if (vimMode && vimState === 'normal') {
      return;
    }
    
    setEditorContent(text);
    if (standalone && onChangeContent) {
      onChangeContent(text);
    } else if (activeFile) {
      updateFileContent(activeFile.id, text);
    }
  };

  const handleVimCommand = (command: string) => {
    switch (command) {
      case 'i':
        if (vimState === 'normal') {
          setVimState('insert');
        }
        break;
      case 'esc':
        setVimState('normal');
        break;
      case 'v':
        if (vimState === 'normal') {
          setVimState('visual');
        }
        break;
      default:
        if (command.startsWith(':')) {
          handleExCommand(command.substring(1));
        }
    }
  };

  const handleExCommand = (command: string) => {
    switch (command) {
      case 'w':
        // Save file
        if (activeFile) {
          updateFileContent(activeFile.id, editorContent);
        }
        break;
      case 'q':
        // Quit
        break;
      case 'wq':
        // Save and quit
        if (activeFile) {
          updateFileContent(activeFile.id, editorContent);
        }
        break;
    }
  };

  const handleKeyPress = (e: any) => {
    if (!vimMode) {
      if (e.nativeEvent.key === 'Tab') {
        e.preventDefault();
        const newText = editorContent.substring(0, selection.start) + '  ' +
          editorContent.substring(selection.end);
        handleChangeText(newText);
        
        setTimeout(() => {
          const newPosition = selection.start + 2;
          inputRef.current?.setNativeProps({
            selection: { start: newPosition, end: newPosition }
          });
        }, 0);
      }
      return;
    }

    // Vim mode key handling
    const key = e.nativeEvent.key;
    if (vimState === 'normal') {
      setCommandBuffer(prev => {
        const newBuffer = prev + key;
        handleVimCommand(newBuffer);
        return newBuffer;
      });
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
    <View style={[styles.container, vimMode && styles.vimContainer]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.editorContainer}>
          <View style={styles.codeContainer}>
            <TextInput
              ref={inputRef}
              style={[
                styles.codeInput,
                vimMode && styles.vimCodeInput
              ]}
              value={editorContent}
              onChangeText={handleChangeText}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
              onKeyPress={handleKeyPress}
              keyboardType="ascii-capable"
              editable={!vimMode || vimState === 'insert'}
            />
          </View>
        </View>
      </ScrollView>
      
      {vimMode && (
        <View style={styles.vimStatusBar}>
          <Text style={styles.vimStatusText}>
            {vimState === 'normal' ? 'NORMAL' :
             vimState === 'insert' ? 'INSERT' :
             vimState === 'visual' ? 'VISUAL' : ''}
          </Text>
          {commandBuffer && (
            <Text style={styles.vimCommandText}>{commandBuffer}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  vimContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
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
  codeContainer: {
    flex: 1,
    position: 'relative',
  },
  codeInput: {
    flex: 1,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    padding: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 14,
    lineHeight: 20,
  },
  vimCodeInput: {
    backgroundColor: '#1E1E1E',
  },
  vimStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 24,
    backgroundColor: '#252526',
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
  },
  vimStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
  vimCommandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
});