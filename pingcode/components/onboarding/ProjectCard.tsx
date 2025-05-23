import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ProjectCardProps {
  title: string;
  description: string;
  onSelect: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, onSelect }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onSelect}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#252526',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 4,
  },
});

export default ProjectCard;