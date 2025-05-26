import { useEditorStore } from '@/store/editorStore';
import { getLanguageFromFilename } from '@/utils/languages';
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
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Register commonly used languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml); // Register HTML as XML since they share syntax
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('bash', bash);

const VSCODE_ACCENT = '#007ACC';

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
};

interface CodeEditorProps {
  file?: any;
  content?: string;
  onChangeContent?: (content: string) => void;
  standalone?: boolean;
  mode?: 'vscode' | 'vim';
  accentColor?: string;
}

export default function EditorCodeEditor({
  file,
  content: externalContent = '',
  onChangeContent,
  standalone = false,
  mode = 'vscode',
  accentColor = VSCODE_ACCENT,
}: CodeEditorProps) {
  const { currentFile, files, updateFile } = useEditorStore();
  const [activeFile, setActiveFile] = useState<any>(null);
  const [editorContent, setEditorContent] = useState(externalContent);
  const [coloredLines, setColoredLines] = useState<React.ReactNode[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (standalone && file) {
      setActiveFile(file);
      setEditorContent(externalContent);
    } else if (currentFile) {
      const fileObj = files.find(f => f.id === currentFile);
      if (fileObj) {
        setActiveFile(fileObj);
        setEditorContent(fileObj.content || '');
      }
    } else {
      setActiveFile(null);
      setEditorContent('');
    }
  }, [currentFile, files, file, externalContent, standalone]);

  useEffect(() => {
    if (activeFile && editorContent) {
      const language = getLanguageFromFilename(activeFile.name);
      const lines = editorContent.split('\n');
      
      const coloredLines = lines.map((line, index) => {
        try {
          if (!line.trim()) {
            return (
              <Text key={index} style={styles.codeLine}>
                {'\u200B'}{'\n'}
              </Text>
            );
          }

          const highlighted = hljs.highlight(line, { language }).value;
          const tokens = highlighted.split(/(<\/?[^>]+>)/g).filter(Boolean);
          const spans = tokens.map((token, tokenIndex) => {
            if (token.startsWith('<span class="hljs-')) {
              return null;
            } else if (token === '</span>') {
              return null;
            } else {
              const classMatch = tokens[tokenIndex - 1]?.match(/class="hljs-([^"]+)"/);
              const colorKey = classMatch ? classMatch[1] : 'default';
              
              // Special handling for HTML tags
              if (language === 'html' || language === 'xml') {
                if (token.startsWith('<') || token.startsWith('</')) {
                  const parts = [];
                  let currentPart = '';
                  let inQuotes = false;
                  
                  for (let i = 0; i < token.length; i++) {
                    const char = token[i];
                    
                    if (char === '"') {
                      if (currentPart) {
                        parts.push({
                          text: currentPart,
                          type: inQuotes ? 'string' : 'tag'
                        });
                        currentPart = '';
                      }
                      parts.push({ text: char, type: 'string' });
                      inQuotes = !inQuotes;
                    } else if (char === '=' && !inQuotes) {
                      if (currentPart) {
                        parts.push({
                          text: currentPart,
                          type: 'attr'
                        });
                        currentPart = '';
                      }
                      parts.push({ text: char, type: 'tag' });
                    } else if (/\s/.test(char) && !inQuotes) {
                      if (currentPart) {
                        parts.push({
                          text: currentPart,
                          type: parts.length === 0 ? 'tag' : 'attr'
                        });
                        currentPart = '';
                      }
                      parts.push({ text: char, type: 'tag' });
                    } else {
                      currentPart += char;
                    }
                  }
                  
                  if (currentPart) {
                    parts.push({
                      text: currentPart,
                      type: parts.length === 0 ? 'tag' : (inQuotes ? 'string' : 'attr')
                    });
                  }

                  return (
                    <Text key={tokenIndex}>
                      {parts.map((part, i) => (
                        <Text
                          key={i}
                          style={{
                            color: part.type === 'string' ? THEME_COLORS.string :
                                  part.type === 'attr' ? THEME_COLORS.attr :
                                  THEME_COLORS.tag
                          }}
                        >
                          {part.text}
                        </Text>
                      ))}
                    </Text>
                  );
                }
              }

              const color = THEME_COLORS[colorKey as keyof typeof THEME_COLORS] || THEME_COLORS.default;
              return (
                <Text key={tokenIndex} style={{ color }}>
                  {token}
                </Text>
              );
            }
          }).filter(Boolean);

          return (
            <Text key={index} style={styles.codeLine}>
              {spans}
              {index < lines.length - 1 ? '\n' : ''}
            </Text>
          );
        } catch (error) {
          return (
            <Text key={index} style={[styles.codeLine, { color: THEME_COLORS.default }]}>
              {line}
              {index < lines.length - 1 ? '\n' : ''}
            </Text>
          );
        }
      });
      setColoredLines(coloredLines);
    } else {
      setColoredLines([]);
    }
  }, [activeFile, editorContent]);

  const handleChangeText = (text: string) => {
    setEditorContent(text);
    if (standalone && onChangeContent) {
      onChangeContent(text);
    } else if (activeFile) {
      updateFile(activeFile.id, text);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const now = Date.now();
    const { contentOffset } = event.nativeEvent;

    // Prevent scroll feedback loops and ensure smooth scrolling
    if (!isScrolling.current && now - lastScrollTime.current > 16) { // 60fps threshold
      isScrolling.current = true;
      lastScrollTime.current = now;

      // Update scroll position state
      setScrollPosition(contentOffset);

      // Sync scroll position between input and highlight layers
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: contentOffset.x,
          y: contentOffset.y,
          animated: false,
        });
      }

      // Clear previous timeout if it exists
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Reset scrolling flag after a short delay
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 50);
    }
  };

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Handle tab key for indentation (web only)
  const handleKeyPress = (e: { nativeEvent: { key: string }, preventDefault: () => void }) => {
    if (e.nativeEvent.key === 'Tab') {
      e.preventDefault();
      const newText =
        editorContent.substring(0, selection.start) +
        '  ' +
        editorContent.substring(selection.end);
      handleChangeText(newText);
      setTimeout(() => {
        const newPosition = selection.start + 2;
        if (inputRef.current) {
          inputRef.current.setNativeProps({
            selection: { start: newPosition, end: newPosition },
          });
        }
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

  // Fake VSCode tabs
  const renderTabs = () => (
    <View style={styles.tabsBar}>
      <View style={styles.tabActive}>
        <Text style={styles.tabText}>{activeFile.name || 'Untitled'}</Text>
      </View>
    </View>
  );

  // Fake VSCode header
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>VSCode Editor</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity>
          <Text style={styles.headerAction}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerAction}>⤓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Fake VSCode status bar
  const renderStatusBar = () => (
    <View style={styles.statusBar}>
      <Text style={styles.statusText}>Ln {selection.start}, Col {selection.end}</Text>
      <Text style={styles.statusText}>Spaces: 2</Text>
      <Text style={styles.statusText}>{getLanguageFromFilename(activeFile.name).toUpperCase()}</Text>
      <Text style={styles.statusText}>UTF-8</Text>
      <Text style={styles.statusText}>LF</Text>
      <Text style={styles.statusText}>VSCode Mode</Text>
    </View>
  );

  return (
    <View style={styles.vscodeContainer}>
      {renderHeader()}
      {renderTabs()}
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.editorScroll}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <View style={styles.editorRow}>
            <View style={styles.lineNumbers}>
              {editorContent.split('\n').map((_, index) => (
                <Text key={index} style={styles.lineNumber}>
                  {index + 1}
                </Text>
              ))}
            </View>
            <View style={styles.codeContainer}>
              <ScrollView
                style={[styles.highlightedCode]}
                scrollEnabled={false}
                pointerEvents="none"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {coloredLines}
              </ScrollView>
              <TextInput
                ref={inputRef}
                style={[
                  styles.codeInput,
                  Platform.select({
                    web: { outlineWidth: 0, caretColor: '#fff' }
                  })
                ]}
                value={editorContent}
                onChangeText={handleChangeText}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                onSelectionChange={e => setSelection(e.nativeEvent.selection)}
                onKeyPress={Platform.OS === 'web' ? handleKeyPress : undefined}
                keyboardType="ascii-capable"
                placeholder="Start coding..."
                placeholderTextColor="#444"
                textAlignVertical="top"
                scrollEnabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      {renderStatusBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  vscodeContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    height: 38,
    backgroundColor: '#23272e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222c',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerAction: {
    color: '#9CDCFE',
    fontSize: 18,
    marginLeft: 16,
  },
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: '#23272e',
    borderBottomWidth: 1,
    borderBottomColor: '#222c',
    height: 32,
    alignItems: 'center',
    paddingLeft: 8,
  },
  tabActive: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#222c',
    borderBottomWidth: 0,
    marginRight: 8,
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1.5,
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: VSCODE_ACCENT,
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
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1.5,
    margin: 0,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: VSCODE_ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  emptyText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
  editorScroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  editorRow: {
    flexDirection: 'row',
    flex: 1,
    minHeight: '100%',
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
  codeContainer: {
    flex: 1,
    position: 'relative',
    minHeight: '100%',
    backgroundColor: '#1e1e1e',
  },
  highlightedCode: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  codeInput: {
    flex: 1,
    padding: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 14.5,
    lineHeight: 22,
    color: 'transparent',
    backgroundColor: 'transparent',
    minHeight: '100%',
    zIndex: 2,
  },
  codeLine: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 14.5,
    lineHeight: 22,
    color: THEME_COLORS.default,
    height: 22,
  },
  statusBar: {
    height: 28,
    backgroundColor: VSCODE_ACCENT,
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
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
  },
});