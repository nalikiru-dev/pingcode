import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useEditorStore } from '@/store/editorStore';
import { getFileIconByType } from '@/utils/fileIcons';

export default function EditorTabs() {
  const { 
    openFiles, 
    currentFile, 
    setCurrentFile, 
    closeFile 
  } = useEditorStore();

  if (openFiles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {openFiles.map((fileId) => {
          const file = useEditorStore.getState().getFileById(fileId);
          if (!file) return null;
          
          const isActive = currentFile === fileId;
          const FileIcon = getFileIconByType(file.name);
          
          return (
            <TouchableOpacity
              key={fileId}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setCurrentFile(fileId)}
            >
              <FileIcon size={16} color={isActive ? '#FFFFFF' : '#A0A0A0'} />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {file.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => closeFile(fileId)}
              >
                <X size={14} color={isActive ? '#FFFFFF' : '#A0A0A0'} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    backgroundColor: '#252526',
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  scrollView: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: '#3C3C3C',
    backgroundColor: '#2D2D2D',
    minWidth: 120,
    maxWidth: 180,
  },
  activeTab: {
    backgroundColor: '#1E1E1E',
  },
  tabText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 2,
  },
});