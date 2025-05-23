import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const GithubCloneScreen = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const router = useRouter();

  const handleClone = () => {
    // Logic to clone the repository would go here
    console.log(`Cloning ${repoUrl} from branch ${branch}`);
    // Navigate to the next step after cloning
    router.push('/onboarding/mode-theme');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clone a GitHub Repository</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter GitHub Repository URL"
        value={repoUrl}
        onChangeText={setRepoUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Branch (default: main)"
        value={branch}
        onChangeText={setBranch}
      />
      <Button title="Clone Repository" onPress={handleClone} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#3C3C3C',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#FFFFFF',
  },
});

export default GithubCloneScreen;