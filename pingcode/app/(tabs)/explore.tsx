import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const router = useRouter();

  const handleNewProject = () => {
    router.push('/onboarding/project-choice');
  };

  const handleCloneRepo = () => {
    router.push('/onboarding/github-clone');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Projects</Text>
      <Text style={styles.subtitle}>Choose an option to get started:</Text>

      <TouchableOpacity style={styles.button} onPress={handleNewProject}>
        <Text style={styles.buttonText}>Create New Project</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCloneRepo}>
        <Text style={styles.buttonText}>Clone GitHub Repository</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});