import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, MoveVertical as MoreVertical } from 'lucide-react-native';

interface ProjectCardProps {
  project: any;
  onPress: () => void;
  isActive: boolean;
}

export default function ProjectCard({ project, onPress, isActive }: ProjectCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isActive && styles.activeContainer]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <View style={[
          styles.languageIcon, 
          { 
            backgroundColor: 
              project.language === 'javascript' ? '#F7DF1E' : 
              project.language === 'python' ? '#3776AB' : 
              '#DEA584' 
          }
        ]}>
          <Text style={{ 
            color: project.language === 'javascript' ? '#000000' : '#FFFFFF' 
          }}>
            {project.language === 'javascript' ? 'JS' : 
             project.language === 'python' ? 'PY' : 'RS'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.description}>{project.description}</Text>
        <View style={styles.metadata}>
          <FileText size={12} color="#A0A0A0" />
          <Text style={styles.fileCount}>{project.files.length} files</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>Updated {formatDate(project.updatedAt)}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.menuButton}>
        <MoreVertical size={16} color="#A0A0A0" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#252526',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  activeContainer: {
    borderWidth: 1,
    borderColor: '#0D72D1',
  },
  iconContainer: {
    marginRight: 12,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileCount: {
    fontSize: 12,
    color: '#A0A0A0',
    marginLeft: 4,
  },
  dot: {
    fontSize: 12,
    color: '#A0A0A0',
    marginHorizontal: 4,
  },
  date: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  menuButton: {
    padding: 4,
  },
});