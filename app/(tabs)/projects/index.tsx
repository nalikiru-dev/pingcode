import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Folder, Plus, Code, GitBranch } from 'lucide-react-native';
import { useEditorStore } from '@/store/editorStore';
import { useRouter } from 'expo-router';
import { sampleProjects } from '@/data/sampleProjects';
import ProjectCard from '@/components/projects/ProjectCard';
import NewProjectModal from '@/components/projects/NewProjectModal';

export default function ProjectsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentProject, setCurrentProject, projects, addProject } = useEditorStore();
  const router = useRouter();

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project);
    router.push('/editor');
  };

  const createNewProject = (name: string, template: string) => {
    // Find template in sample projects
    const templateProject = sampleProjects.find(p => p.id === template);
    
    if (templateProject) {
      const newProject = {
        ...templateProject,
        id: `project-${Date.now()}`,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addProject(newProject);
      setCurrentProject(newProject);
      setModalVisible(false);
      router.push('/editor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <TouchableOpacity 
          style={styles.newButton} 
          onPress={() => setModalVisible(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New Project</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Projects</Text>
        {projects.length === 0 ? (
          <View style={styles.emptyState}>
            <Folder size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>No projects yet</Text>
            <Text style={styles.emptySubText}>
              Create a new project to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProjectCard
                project={item}
                onPress={() => handleProjectSelect(item)}
                isActive={currentProject?.id === item.id}
              />
            )}
            contentContainerStyle={styles.projectsList}
          />
        )}
      </View>

      <View style={styles.templatesSection}>
        <Text style={styles.sectionTitle}>Templates</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={sampleProjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.templateCard}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <View style={styles.templateIconContainer}>
                {item.language === 'javascript' && (
                  <View style={[styles.languageIcon, { backgroundColor: '#F7DF1E' }]}>
                    <Text style={{ color: '#000000' }}>JS</Text>
                  </View>
                )}
                {item.language === 'python' && (
                  <View style={[styles.languageIcon, { backgroundColor: '#3776AB' }]}>
                    <Text style={{ color: '#FFFFFF' }}>PY</Text>
                  </View>
                )}
                {item.language === 'rust' && (
                  <View style={[styles.languageIcon, { backgroundColor: '#DEA584' }]}>
                    <Text style={{ color: '#000000' }}>RS</Text>
                  </View>
                )}
              </View>
              <Text style={styles.templateName}>{item.name}</Text>
              <Text style={styles.templateDesc}>{item.description}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.templatesList}
        />
      </View>

      <NewProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateProject={createNewProject}
        templates={sampleProjects}
      />
    </SafeAreaView>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D72D1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  newButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 8,
  },
  projectsList: {
    paddingBottom: 16,
  },
  templatesSection: {
    padding: 16,
    paddingTop: 0,
  },
  templatesList: {
    paddingRight: 16,
  },
  templateCard: {
    width: 160,
    backgroundColor: '#252526',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
  },
  templateIconContainer: {
    height: 48,
    justifyContent: 'center',
    marginBottom: 8,
  },
  languageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  templateDesc: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
});