import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useEditorStore } from '@/store/editorStore';
import { getFileIconByType } from '@/utils/fileIcons';

export default function FileTree() {
  const { 
    currentProject, 
    files, 
    setCurrentFile, 
    addFile, 
    deleteFile 
  } = useEditorStore();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '/': true
  });

  if (!currentProject) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No project selected</Text>
      </View>
    );
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders({
      ...expandedFolders,
      [path]: !expandedFolders[path]
    });
  };

  const handleFilePress = (fileId: string) => {
    setCurrentFile(fileId);
  };

  const handleAddFile = () => {
    const fileName = `file_${Date.now()}.js`;
    addFile({
      id: `file_${Date.now()}`,
      name: fileName,
      path: '/',
      language: 'javascript',
      content: '// Write your code here\n\nconsole.log("Hello, world!");',
    });
  };

  // Group files by their path
  const filesByPath: Record<string, any[]> = {};
  files.forEach(file => {
    if (!filesByPath[file.path]) {
      filesByPath[file.path] = [];
    }
    filesByPath[file.path].push(file);
  });

  const renderFiles = (path: string) => {
    const filesInPath = filesByPath[path] || [];
    
    return filesInPath.map(file => {
      const FileIcon = getFileIconByType(file.name);
      
      return (
        <TouchableOpacity
          key={file.id}
          style={styles.fileItem}
          onPress={() => handleFilePress(file.id)}
        >
          <View style={styles.fileRow}>
            <FileIcon size={16} color="#A0A0A0" />
            <Text style={styles.fileName}>{file.name}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.fileAction}
            onPress={() => deleteFile(file.id)}
          >
            <Trash size={14} color="#A0A0A0" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorer</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFile}>
          <Plus size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.treeContainer}>
        <View style={styles.projectContainer}>
          <TouchableOpacity
            style={styles.projectHeader}
            onPress={() => toggleFolder('/')}
          >
            {expandedFolders['/'] ? (
              <ChevronDown size={16} color="#FFFFFF" />
            ) : (
              <ChevronRight size={16} color="#FFFFFF" />
            )}
            <Text style={styles.projectName}>{currentProject.name}</Text>
          </TouchableOpacity>
          
          {expandedFolders['/'] && (
            <View style={styles.projectFiles}>
              {renderFiles('/')}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252526',
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
  addButton: {
    padding: 4,
  },
  treeContainer: {
    flex: 1,
  },
  emptyText: {
    color: '#A0A0A0',
    padding: 16,
    textAlign: 'center',
  },
  projectContainer: {
    paddingVertical: 8,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  projectName: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  projectFiles: {
    marginLeft: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    color: '#CCCCCC',
    marginLeft: 8,
    fontSize: 13,
  },
  fileAction: {
    padding: 4,
  },
});