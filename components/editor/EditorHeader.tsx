import { useEditorStore } from '@/store/editorStore';
import { Folder, Play, Save, Terminal } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditorHeaderProps {
  toggleFileTree: () => void;
  toggleTerminal: () => void;
}

export default function EditorHeader({ toggleFileTree, toggleTerminal }: EditorHeaderProps) {
  const { currentProject, saveAllFiles } = useEditorStore();
  
  return (
    <View style={styles.container}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>
          {currentProject?.name || 'No Project'}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleFileTree}>
          <Folder size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={toggleTerminal}>
          <Terminal size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={saveAllFiles}>
          <Save size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.runButton}>
          <Play size={18} color="#FFFFFF" />
          <Text style={styles.runButtonText}>Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252526',
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
    paddingHorizontal: 8,
  },
  projectInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 2,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D72D1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  runButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
  },
});