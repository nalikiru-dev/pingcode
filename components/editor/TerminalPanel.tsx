import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import { X } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TerminalPanel() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([
    'PingCode Terminal v1.0',
    'Type "help" for available commands',
    '',
  ]);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const executeCommand = () => {
    if (!command.trim()) return;
    
    // Add the command to output
    const newOutput = [...output, `$ ${command}`];
    
    // Process the command
    switch (command.toLowerCase()) {
      case 'help':
        newOutput.push(
          'Available commands:',
          '  help - Show this help message',
          '  clear - Clear the terminal',
          '  echo [text] - Echo text back to the terminal',
          '  version - Show version information',
          ''
        );
        break;
        
      case 'clear':
        setOutput(['']);
        setCommand('');
        return;
        
      case 'version':
        newOutput.push(
          'PingCode Terminal v1.0',
          'Running on ' + Platform.OS,
          ''
        );
        break;
        
      default:
        if (command.startsWith('echo ')) {
          const text = command.substring(5);
          newOutput.push(text, '');
        } else {
          newOutput.push(`Command not found: ${command}`, '');
        }
    }
    
    setOutput(newOutput);
    setCommand('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Terminal</Text>
        <TouchableOpacity style={styles.closeButton}>
          <X size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.outputContainer}
        contentContainerStyle={styles.outputContent}
      >
        {output.map((line, index) => (
          <Text key={index} style={styles.outputLine}>
            {line}
          </Text>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>$</Text>
        <TextInput
          style={styles.input}
          value={command}
          onChangeText={setCommand}
          onSubmitEditing={executeCommand}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          returnKeyType="send"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  closeButton: {
    padding: 4,
  },
  outputContainer: {
    flex: 1,
  },
  outputContent: {
    padding: 8,
  },
  outputLine: {
    color: '#CCCCCC',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
    padding: 8,
  },
  prompt: {
    color: '#CCCCCC',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 12,
    padding: 0,
  },
});