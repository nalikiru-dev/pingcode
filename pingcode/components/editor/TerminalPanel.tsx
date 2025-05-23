import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TerminalPanel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terminal</Text>
      <Text style={styles.placeholder}>This is where your terminal commands will be executed.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  placeholder: {
    color: '#A0A0A0',
  },
});

export default TerminalPanel;