import { useEditorStore } from '@/store/editorStore';
import { useThemeStore } from '@/store/themeStore';
import { FileSystem, FileSystemItem, TerminalOutput, TerminalOutputType } from '@/types/editor';
import { Maximize2, Minimize2, Terminal as TerminalIcon, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, TextInput, TextInputKeyPressEventData, TouchableOpacity, View } from 'react-native';

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
    { text: 'PingCode Terminal v2.0 (Termux-like)', type: 'info' },
    { text: 'Type "help" for available commands', type: 'info' },
    { text: '', type: 'text' },
  ]);
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<'basic' | 'vim' | 'advanced'>(initialMode);
  const [vimContent, setVimContent] = useState<string | null>(null);
  const [vimFile, setVimFile] = useState<string | null>(null);
  const [vimMode, setVimMode] = useState<'normal' | 'insert' | 'visual'>('normal');
  const [vimCursor, setVimCursor] = useState({ line: 0, col: 0 });
  const [vimSelection, setVimSelection] = useState<{ start: number; end: number } | null>(null);
  const [vimCommandBuffer, setVimCommandBuffer] = useState('');
  const [vimRegister, setVimRegister] = useState('');
  const [vimUndoStack, setVimUndoStack] = useState<string[]>([]);
  const [vimRedoStack, setVimRedoStack] = useState<string[]>([]);
  
  const { setEditorMode } = useEditorStore();
  const { vimMode: isVimModeEnabled, toggleVimMode } = useThemeStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const heightAnim = useRef(new Animated.Value(300)).current;
  
  // Terminal expansion animation
  useEffect(() => {
    const targetHeight = expanded || (mode === 'vim' && vimContent !== null)
      ? Dimensions.get('window').height
      : 300;
    
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, mode, vimContent]);
  
  // Sync terminal mode with vim mode from theme store
  useEffect(() => {
    if (isVimModeEnabled && mode !== 'vim') {
      setMode('vim');
      setExpanded(true);
      setVimMode('normal');
    } else if (!isVimModeEnabled && mode === 'vim') {
      setMode('basic');
      setExpanded(false);
      setVimMode('normal');
    }
  }, [isVimModeEnabled, mode]);
  
  // Handle vim mode changes
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
  
  // Helper function to create terminal output with type safety
  const createOutput = (text: string, type: TerminalOutputType): TerminalOutput => ({
    text,
    type,
  });
  
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
    
    addOutput([createOutput(`$ ${command}`, 'command')]);
    
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
          createOutput('Available commands:', 'info'),
          ...HELP_COMMANDS.map(cmd => createOutput(`  ${cmd.name.padEnd(12)} ${cmd.desc}`, 'text')),
          createOutput('', 'text'),
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
          createOutput('PingCode Terminal v2.0', 'info'),
          createOutput(`Running on ${Platform.OS} with ${mode} mode`, 'info'),
          createOutput('', 'text'),
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
          createOutput(currentDir, 'success'),
          createOutput('', 'text'),
        ]);
        break;
        
      case 'echo':
        addOutput([
          createOutput(args.join(' '), 'text'),
          createOutput('', 'text'),
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
          toggleVimMode();
          addOutput([
            createOutput('Switched to vim mode', 'info'),
            createOutput('Terminal expanded', 'info'),
            createOutput('', 'text'),
          ]);
        } else if (args[0] === 'basic') {
          if (mode === 'vim') {
            toggleVimMode();
          }
          setMode('basic');
          setExpanded(false);
          addOutput([
            createOutput('Switched to basic mode', 'info'),
            createOutput('', 'text'),
          ]);
        } else if (args[0] === 'advanced') {
          if (mode === 'vim') {
            toggleVimMode();
          }
          setMode('advanced');
          addOutput([
            createOutput('Switched to advanced mode', 'info'),
            createOutput('', 'text'),
          ]);
        } else {
          addOutput([
            createOutput(`Current mode: ${mode}`, 'info'),
            createOutput('Available modes: basic, vim, advanced', 'info'),
            createOutput('Usage: mode [mode_name]', 'info'),
            createOutput('', 'text'),
          ]);
        }
        break;
        
      default:
        addOutput([
          createOutput(`Command not found: ${cmdName}`, 'error'),
          createOutput('Type "help" for available commands', 'info'),
          createOutput('', 'text'),
        ]);
    }
  };
  
  // Handle ls command
  const handleLsCommand = (args: string[]) => {
    const path = args.length > 0 ? resolvePath(args[0]) : currentDir;
    const item = getItemAtPath(path);
    
    if (!item) {
      addOutput([
        createOutput(`ls: cannot access '${path}': No such file or directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    if (typeof item === 'string') {
      addOutput([
        createOutput(`ls: cannot list '${path}': Not a directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    const entries = Object.entries(item).map(([name, value]) => ({
      name,
      isDirectory: typeof value !== 'string'
    }));
    
    if (entries.length === 0) {
      addOutput([createOutput('', 'text')]);
      return;
    }
    
    const formatted: TerminalOutput[] = entries.map(entry => createOutput(
      entry.isDirectory ? `${entry.name}/` : entry.name,
      entry.isDirectory ? 'info' : 'text'
    ));
    
    addOutput([...formatted, createOutput('', 'text')]);
  };
  
  // Handle cd command
  const handleCdCommand = (args: string[]) => {
    if (args.length === 0) {
      setCurrentDir('/home/user');
      addOutput([createOutput('', 'text')]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const item = getItemAtPath(path);
    
    if (!item) {
      addOutput([
        createOutput(`cd: no such directory: ${path}`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    if (typeof item === 'string') {
      addOutput([
        createOutput(`cd: not a directory: ${path}`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    setCurrentDir(path);
    addOutput([createOutput('', 'text')]);
  };
  
  // Handle cat command
  const handleCatCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        createOutput('Usage: cat [file]', 'info'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    const path = resolvePath(args[0]);
    const item = getItemAtPath(path);
    
    if (!item) {
      addOutput([
        createOutput(`cat: ${path}: No such file or directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    if (typeof item !== 'string') {
      addOutput([
        createOutput(`cat: ${path}: Is a directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    const lines = item.split('\n').map(line => createOutput(line, 'text'));
    addOutput([...lines, createOutput('', 'text')]);
  };
  
  // Handle vim file command
  const handleVimFileCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        createOutput('Usage: vim [file]', 'info'),
        createOutput('', 'text'),
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
        createOutput(`vim: cannot create file '${path}': Directory does not exist`, 'error'),
        createOutput('', 'text'),
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
        createOutput(`vim: ${path}: Is a directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    // Enter vim mode
    setMode('vim');
    setExpanded(true);
    setVimContent(item);
    setVimFile(path);
    setVimMode('normal');
    setVimCursor({ line: 0, col: 0 });
    setVimSelection(null);
    setVimCommandBuffer('');
    setVimUndoStack([item]);
    setVimRedoStack([]);
    
    addOutput([
      createOutput(`"${path}" ${item.length} characters`, 'info'),
      createOutput('-- NORMAL --', 'highlight'),
    ]);
  };
  
  // Handle mkdir command
  const handleMkdirCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        createOutput('Usage: mkdir [directory]', 'info'),
        createOutput('', 'text'),
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
        createOutput(`mkdir: cannot create directory '${path}': No such file or directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    if (parent[dirName]) {
      addOutput([
        createOutput(`mkdir: cannot create directory '${path}': File exists`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    // Create directory
    parent[dirName] = {};
    addOutput([createOutput('', 'text')]);
  };
  
  // Handle touch command
  const handleTouchCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        createOutput('Usage: touch [file]', 'info'),
        createOutput('', 'text'),
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
        createOutput(`touch: cannot touch '${path}': No such file or directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    // Create or update file
    parent[fileName] = parent[fileName] || '';
    addOutput([createOutput('', 'text')]);
  };
  
  // Handle rm command
  const handleRmCommand = (args: string[]) => {
    if (args.length === 0) {
      addOutput([
        createOutput('Usage: rm [file]', 'info'),
        createOutput('', 'text'),
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
        createOutput(`rm: cannot remove '${path}': No such file or directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    if (!parent[fileName]) {
      addOutput([
        createOutput(`rm: cannot remove '${path}': No such file or directory`, 'error'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    // Check if it's a directory and we don't have -r flag
    if (typeof parent[fileName] !== 'string' && !args.includes('-r') && !args.includes('-rf')) {
      addOutput([
        createOutput(`rm: cannot remove '${path}': Is a directory`, 'error'),
        createOutput('Try \'rm -r\' to remove the directory', 'info'),
        createOutput('', 'text'),
      ]);
      return;
    }
    
    // Remove file or directory
    delete parent[fileName];
    addOutput([createOutput('', 'text')]);
  };
  
  // Handle vim key press
  const handleVimKeyPress = (key: string) => {
    if (!vimContent) return;
    
    const lines = vimContent.split('\n');
    const currentLine = lines[vimCursor.line] || '';
    
    if (vimMode === 'normal') {
      switch (key) {
        case 'i':
          setVimMode('insert');
          addOutput([createOutput('-- INSERT --', 'highlight')]);
        case ':':
          setCommand(':');
          inputRef.current?.focus();
        default:
          break;
      }
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
        createOutput(`"${vimFile}" ${vimContent.length}L, ${vimContent.length} characters written`, 'success'),
        createOutput('', 'text'),
      ]);
    }
    
    // Exit vim mode
    setVimContent(null);
    setVimFile(null);
    setMode('advanced');
  };

  // Handle keyboard navigation in history
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const { key } = e.nativeEvent;
    
    if (vimContent !== null) {
      handleVimKeyPress(key);
      return;
    }
    
    if (key === 'ArrowUp') {
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };
  
  return (
    <Animated.View style={[
      styles.container,
      mode === 'vim' && vimContent && styles.fullscreen
    ]}>
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
            styles[line.type]
          ]}>
            {line.text}
          </Text>
        ))}
        
        {vimContent !== null && (
          <View style={styles.vimContainer}>
            {vimContent.split('\n').map((line, lineIndex) => (
              <View key={lineIndex} style={styles.vimLine}>
                <Text style={[
                  styles.vimLineContent,
                  vimSelection && lineIndex >= vimSelection.start && lineIndex <= vimSelection.end && styles.vimSelection
                ]}>
                  {line}
                  {lineIndex === vimCursor.line && (
                    <Text style={styles.vimCursor}>|</Text>
                  )}
                </Text>
              </View>
            ))}
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
    alignItems: 'center',
    padding: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TERMINAL_THEMES.dark.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 5,
  },
  outputContainer: {
    flex: 1,
  },
  outputContent: {
    padding: 10,
  },
  outputLine: {
    color: TERMINAL_THEMES.dark.text,
  },
  vimContainer: {
    flex: 1,
  },
  vimLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vimLineContent: {
    flex: 1,
    color: TERMINAL_THEMES.dark.text,
  },
  vimSelection: {
    backgroundColor: TERMINAL_THEMES.dark.highlight,
  },
  vimCursor: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  prompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TERMINAL_THEMES.dark.text,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: TERMINAL_THEMES.dark.text,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Output type styles
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