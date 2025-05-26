import { useEditorStore } from '@/store/editorStore';
import { FileSystem, FileSystemItem, TerminalOutput } from '@/types/editor';
import { Maximize2, Minimize2, Terminal as TerminalIcon, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define terminal themes
const TERMINAL_THEMES = {
  dark: {
    background: '#1E1E1E',
    text: '#CCCCCC',
    prompt: '#9CDCFE',
    error: '#F44747',
    success: '#6A9955',
    warning: '#DCDCAA',
    info: '#569CD6',
    highlight: '#CE9178',
    command: '#FFFFFF',
    border: '#3C3C3C',
  }
} as const;

// Terminal commands data
const HELP_COMMANDS = [
  { name: 'help', desc: 'Show this help message' },
  { name: 'clear', desc: 'Clear the terminal' },
  { name: 'ls', desc: 'List directory contents' },
  { name: 'cd [dir]', desc: 'Change directory' },
  { name: 'cat [file]', desc: 'Display file contents' },
  { name: 'vim [file]', desc: 'Edit file with vim' },
  { name: 'mkdir [dir]', desc: 'Create a directory' },
  { name: 'touch [file]', desc: 'Create a file' },
  { name: 'rm [file]', desc: 'Remove a file' },
  { name: 'echo [text]', desc: 'Print text' },
  { name: 'pwd', desc: 'Print working directory' },
  { name: 'exit', desc: 'Close the terminal' },
  { name: 'version', desc: 'Show version information' },
] as const;

// Initial file system structure
const FILE_SYSTEM: FileSystem = {
  '/': {
    'home': {
      'user': {
        'documents': {
          'notes.txt': 'This is a sample text file.\nIt contains multiple lines.\n\nYou can edit it with vim.',
          'todo.md': '# Todo List\n\n- [ ] Learn Vim\n- [ ] Master terminal commands\n- [ ] Build a project',
        },
        'projects': {
          'app.js': 'console.log("Hello world!");',
          'styles.css': 'body { background: #f0f0f0; }',
        }
      }
    },
    'etc': {},
    'usr': {
      'bin': {}
    }
  }
};

interface TerminalPanelProps {
  toggleTerminal: () => void;
  initialMode?: 'basic' | 'vim' | 'advanced';
}

export default function TerminalPanel({ toggleTerminal, initialMode = 'basic' }: TerminalPanelProps) {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<TerminalOutput[]>([
    { text: 'PingCode Terminal v2.0 (Termux-like)', type: 'info' as const },
    { text: 'Type "help" for available commands', type: 'info' as const },
    { text: '', type: 'text' as const },
  ]);
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<'basic' | 'vim' | 'advanced'>(initialMode);
  const [vimContent, setVimContent] = useState<string | null>(null);
  const [vimFile, setVimFile] = useState<string | null>(null);
  const [vimMode, setVimMode] = useState<'normal' | 'insert'>('normal');
  
  const { setEditorMode } = useEditorStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const heightAnim = useRef(new Animated.Value(300)).current;
  
  // Terminal expansion animation
  useEffect(() => {
    const targetHeight = expanded ? Dimensions.get('window').height * 0.7 : 300;
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, heightAnim]);
  
  // Sync editor mode with terminal mode
  useEffect(() => {
    if (mode === 'vim') {
      setEditorMode('vim');
    } else {
      setEditorMode('vscode');
    }
  }, [mode, setEditorMode]);
  
  // Helper function to get file/directory at path
  const getItemAtPath = (path: string): FileSystemItem | string | null => {
    if (path === '/') return FILE_SYSTEM['/'];
    
    const parts = path.split('/').filter(Boolean);
    let current: FileSystemItem | string = FILE_SYSTEM['/'];
    
    for (const part of parts) {
      if (typeof current === 'string' || !current[part]) return null;
      current = current[part];
    }
    
    return current;
  };
  
  // Helper function to resolve path
  const resolvePath = (path: string): string => {
    if (path.startsWith('/')) return path;
    
    const currentParts = currentDir.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    
    for (const part of pathParts) {
      if (part === '..') {
        currentParts.pop();
      } else if (part !== '.') {
        currentParts.push(part);
      }
    }
    
    return '/' + currentParts.join('/');
  };
  
  // Add output messages with type
  const addOutput = (lines: TerminalOutput[]) => {
    setOutput(prev => [...prev, ...lines]);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };
  
  // Execute terminal command
  const executeCommand = () => {
    if (!command.trim()) return;
    
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    addOutput([{ text: `$ ${command}`, type: 'command' }]);
    
    const cmdParts = command.trim().split(' ');
    const cmdName = cmdParts[0].toLowerCase();
    const args = cmdParts.slice(1);
    
    handleCommand(cmdName, args);
    setCommand('');
  };
  
  // Command handler
  const handleCommand = (cmdName: string, args: string[]) => {
    switch (cmdName) {
      case 'help':
        addOutput([
          { text: 'Available commands:', type: 'info' as const },
          ...HELP_COMMANDS.map(cmd => (
            { text: `  ${cmd.name.padEnd(12)} ${cmd.desc}`, type: 'text' as const }
          )),
          { text: '', type: 'text' as const }
        ]);
        break;
        
      case 'clear':
        setOutput([]);
        break;
        
      case 'exit':
        toggleTerminal();
        break;
        
      case 'version':
        addOutput([
          { text: 'PingCode Terminal v2.0', type: 'info' as const },
          { text: `Running on ${Platform.OS} with ${mode} mode`, type: 'info' as const },
          { text: '', type: 'text' as const }
        ]);
        break;
        
      case 'ls':
        handleLsCommand(args);
        break;
        
      case 'cd':
        handleCdCommand(args);
        break;
        
      case 'cat':
        handleCatCommand(args);
        break;
        
      case 'pwd':
        addOutput([
          { text: currentDir, type: 'success' as const },
          { text: '', type: 'text' as const }
        ]);
        break;
        
      case 'echo':
        addOutput([
          { text: args.join(' '), type: 'text' as const },
          { text: '', type: 'text' as const }
        ]);
        break;
        
      case 'vim':
        handleVimFileCommand(args);
        break;
        
      case 'mkdir':
        handleMkdirCommand(args);
        break;
        
      case 'touch':
        handleTouchCommand(args);
        break;
        
      case 'rm':
        handleRmCommand(args);
        break;
        
      case 'mode':
        if (args[0] === 'vim') {
          setMode('vim');
          setExpanded(true);
          addOutput([
            { text: 'Switched to vim mode', type: 'info' as const },
            { text: 'Terminal expanded', type: 'info' as const },
            { text: '', type: 'text' as const }
          ]);
        } else if (args[0] === 'basic') {
          setMode('basic');
          setExpanded(false);
          addOutput([
            { text: 'Switched to basic mode', type: 'info' as const },
            { text: '', type: 'text' as const }
          ]);
        } else if (args[0] === 'advanced') {
          setMode('advanced');
          addOutput([
            { text: 'Switched to advanced mode', type: 'info' as const },
            { text: '', type: 'text' as const }
          ]);
        } else {
          addOutput([
            { text: `Current mode: ${mode}`, type: 'info' as const },
            { text: 'Available modes: basic, vim, advanced', type: 'info' as const },
            { text: 'Usage: mode [mode_name]', type: 'info' as const },
            { text: '', type: 'text' as const }
          ]);
        }
        break;
        
      default:
        addOutput([
          { text: `Command not found: ${cmdName}`, type: 'error' as const },
          { text: 'Type "help" for available commands', type: 'info' as const },
          { text: '', type: 'text' as const }
        ]);
    }
  };
  
  // Handle ls command
  const handleLsCommand = (args: string[]) => {
    const path = args.length > 0 ? resolvePath(args[0]) : currentDir;
    const item = getItemAtPath(path);
    
    if (!item) {
      addOutput([
        { text: `ls: cannot access '${path}': No such file or directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    if (typeof item === 'string') {
      addOutput([
        { text: `ls: cannot list '${path}': Not a directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const entries = Object.entries(item).map(([name, value]) => ({
      name,
      isDirectory: typeof value !== 'string'
    }));
    
    if (entries.length === 0) {
      addOutput([{ text: '', type: 'text' as const }]);
      return;
    }
    
    const formatted = entries.map(entry => ({
      text: entry.isDirectory ? `${entry.name}/` : entry.name,
      type: entry.isDirectory ? 'info' as const : 'text' as const
    }));
    
    addOutput([...formatted, { text: '', type: 'text' as const }]);
  };
  
  // Handle cd command
  const handleCdCommand = (args: string[]) => {
    if (args.length === 0) {
      setCurrentDir('/home/user');
      addOutput([{ text: '', type: 'text' as const }]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const item = getItemAtPath(path);
    
    if (!item) {
      addOutput([
        { text: `cd: no such directory: ${path}`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    if (typeof item === 'string') {
      addOutput([
        { text: `cd: not a directory: ${path}`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    setCurrentDir(path);
    addOutput([{ text: '', type: 'text' as const }]);
  };
  
  // Handle cat command
  const handleCatCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        { text: 'Usage: cat [file]', type: 'info' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const item = getItemAtPath(path);
    
    if (!item) {
      addOutput([
        { text: `cat: ${path}: No such file or directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    if (typeof item !== 'string') {
      addOutput([
        { text: `cat: ${path}: Is a directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const lines = item.split('\n').map(line => ({ text: line, type: 'text' as const }));
    addOutput([...lines, { text: '', type: 'text' as const }]);
  };
  
  // Handle vim file command
  const handleVimFileCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        { text: 'Usage: vim [file]', type: 'info' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const segments = path.split('/');
    const fileName = segments[segments.length - 1];
    const parentPath = segments.slice(0, -1).join('/') || '/';
    const parent = getItemAtPath(parentPath);
    let item = getItemAtPath(path);
    
    if (!parent || typeof parent === 'string') {
      addOutput([
        { text: `vim: cannot create file '${path}': Directory does not exist`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    // Create the file if it doesn't exist
    if (!item) {
      item = '';
      (parent as FileSystemItem)[fileName] = '';
    }
    
    if (typeof item !== 'string') {
      addOutput([
        { text: `vim: ${path}: Is a directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    // Enter vim mode
    setMode('vim');
    setExpanded(true);
    setVimContent(item);
    setVimFile(path);
    setVimMode('normal');
    
    addOutput([
      { text: `"${path}" ${item.length} characters`, type: 'info' as const },
      { text: '-- NORMAL --', type: 'highlight' as const },
    ]);
  };
  
  // Handle mkdir command
  const handleMkdirCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        { text: 'Usage: mkdir [directory]', type: 'info' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const segments = path.split('/').filter(Boolean);
    const dirName = segments[segments.length - 1];
    const parentPath = '/' + segments.slice(0, -1).join('/');
    const parent = getItemAtPath(parentPath);
    
    if (!parent || typeof parent === 'string') {
      addOutput([
        { text: `mkdir: cannot create directory '${path}': No such file or directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    if (parent[dirName]) {
      addOutput([
        { text: `mkdir: cannot create directory '${path}': File exists`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    // Create directory
    parent[dirName] = {};
    addOutput([{ text: '', type: 'text' as const }]);
  };
  
  // Handle touch command
  const handleTouchCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        { text: 'Usage: touch [file]', type: 'info' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const segments = path.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];
    const parentPath = '/' + segments.slice(0, -1).join('/');
    const parent = getItemAtPath(parentPath);
    
    if (!parent || typeof parent === 'string') {
      addOutput([
        { text: `touch: cannot touch '${path}': No such file or directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    // Create or update file
    parent[fileName] = parent[fileName] || '';
    addOutput([{ text: '', type: 'text' as const }]);
  };
  
  // Handle rm command
  const handleRmCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        { text: 'Usage: rm [file]', type: 'info' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const segments = path.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];
    const parentPath = '/' + segments.slice(0, -1).join('/');
    const parent = getItemAtPath(parentPath);
    
    if (!parent || typeof parent === 'string') {
      addOutput([
        { text: `rm: cannot remove '${path}': No such file or directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    if (!parent[fileName]) {
      addOutput([
        { text: `rm: cannot remove '${path}': No such file or directory`, type: 'error' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    // Check if it's a directory and we don't have -r flag
    if (typeof parent[fileName] !== 'string' && !args.includes('-r') && !args.includes('-rf')) {
      addOutput([
        { text: `rm: cannot remove '${path}': Is a directory`, type: 'error' as const },
        { text: 'Try \'rm -r\' to remove the directory', type: 'info' as const },
        { text: '', type: 'text' as const }
      ]);
      return;
    }
    
    // Remove file or directory
    delete parent[fileName];
    addOutput([{ text: '', type: 'text' as const }]);
  };
  
  // Vim save and exit
  const handleVimSave = () => {
    if (!vimFile || vimContent === null) return;
    
    const segments = vimFile.split('/').filter(Boolean);
    const fileName = segments[segments.length - 1];
    const parentPath = '/' + segments.slice(0, -1).join('/');
    const parent = getItemAtPath(parentPath);
    
    if (parent && typeof parent !== 'string') {
      parent[fileName] = vimContent;
      
      addOutput([
        { text: `"${vimFile}" ${vimContent.length}L, ${vimContent.length} characters written`, type: 'success' as const },
        { text: '', type: 'text' as const }
      ]);
    }
    
    // Exit vim mode
    setVimContent(null);
    setVimFile(null);
    setMode('advanced');
  };
  
  // Handle keyboard navigation in history
  const handleKeyPress = (e: { nativeEvent: { key: string } }) => {
    const { key } = e.nativeEvent;
    
    if (vimContent !== null) {
      // Vim mode key handling
      if (vimMode === 'normal') {
        if (key === 'i') {
          setVimMode('insert');
          addOutput([{ text: '-- INSERT --', type: 'highlight' as const }]);
        } else if (key === ':') {
          setCommand(':');
          inputRef.current?.focus();
        }
      }
      return;
    }
    
    if (key === 'ArrowUp') {
      // Navigate up in history
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (key === 'ArrowDown') {
      // Navigate down in history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
    setCommand('');
      }
    } else if (key === 'Tab') {
      // Command auto-completion could be added here
    }
  };
  
  // Handle text input submission
  const handleSubmit = () => {
    if (vimContent !== null && command.startsWith(':')) {
      handleVimCommand();
    } else {
      executeCommand();
    }
  };
  
  // Vim command execution
  const handleVimCommand = () => {
    if (command === ':w') {
      handleVimSave();
      setCommand('');
    } else if (command === ':q' || command === ':wq') {
      if (command === ':wq') {
        handleVimSave();
      }
      setVimContent(null);
      setVimFile(null);
      setMode('advanced');
      setCommand('');
    }
  };
  
  return (
    <Animated.View style={[styles.container, { height: heightAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TerminalIcon size={14} color="#FFFFFF" style={styles.headerIcon} />
          <Text style={styles.title}>
            {mode === 'vim' && vimFile ? `${vimFile} (${vimMode})` : `Terminal (${mode})`}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setExpanded(!expanded)}
          >
            {expanded ? 
              <Minimize2 size={14} color="#FFFFFF" /> : 
              <Maximize2 size={14} color="#FFFFFF" />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={toggleTerminal}>
            <X size={14} color="#FFFFFF" />
        </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.outputContainer}
        contentContainerStyle={styles.outputContent}
      >
        {output.map((line, index) => (
          <Text key={index} style={[
            styles.outputLine,
            styles[line.type as keyof typeof styles] || styles.text
          ]}>
            {line.text}
          </Text>
        ))}
        
        {vimContent !== null && (
          <View style={styles.vimContainer}>
            <Text style={styles.vimContent}>{vimContent}</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>
          {vimContent !== null && command.startsWith(':') ? ':' : `${currentDir} $`}
        </Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={command}
          onChangeText={setCommand}
          onSubmitEditing={handleSubmit}
          onKeyPress={handleKeyPress}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          returnKeyType="send"
          blurOnSubmit={false}
          autoFocus
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TERMINAL_THEMES.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: TERMINAL_THEMES.dark.border,
    backgroundColor: '#252525',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 6,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 4,
    marginLeft: 8,
  },
  title: {
    color: TERMINAL_THEMES.dark.text,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  outputContainer: {
    flex: 1,
  },
  outputContent: {
    padding: 8,
    paddingBottom: 16,
  },
  outputLine: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: TERMINAL_THEMES.dark.border,
    padding: 8,
  },
  prompt: {
    color: TERMINAL_THEMES.dark.prompt,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: TERMINAL_THEMES.dark.command,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    padding: 0,
  },
  vimContainer: {
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: TERMINAL_THEMES.dark.border,
    padding: 8,
    backgroundColor: '#1A1A1A',
  },
  vimContent: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    lineHeight: 18,
    color: TERMINAL_THEMES.dark.text,
  },
  // Text styles for different output types
  text: {
    color: TERMINAL_THEMES.dark.text,
  },
  error: {
    color: TERMINAL_THEMES.dark.error,
  },
  success: {
    color: TERMINAL_THEMES.dark.success,
  },
  warning: {
    color: TERMINAL_THEMES.dark.warning,
  },
  info: {
    color: TERMINAL_THEMES.dark.info,
  },
  highlight: {
    color: TERMINAL_THEMES.dark.highlight,
  },
  command: {
    color: TERMINAL_THEMES.dark.command,
    fontWeight: 'bold',
  },
});