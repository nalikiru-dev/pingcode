import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBar = ({ currentFile, mode, theme }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.fileName}>{currentFile ? currentFile.name : 'No file selected'}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Mode: {mode}</Text>
        <Text style={styles.infoText}>Theme: {theme}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#252526',
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
  },
  fileName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
  },
  infoText: {
    color: '#A0A0A0',
    marginLeft: 10,
  },
});

export default StatusBar;