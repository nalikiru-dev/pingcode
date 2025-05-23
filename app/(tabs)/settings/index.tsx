import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { Moon, Sun, Monitor, Github, Download, RotateCcw, Zap, Command } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, setTheme, vimMode, toggleVimMode } = useThemeStore();
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const renderThemeButton = (themeName: string, icon: React.ReactNode, label: string) => (
    <TouchableOpacity
      style={[styles.themeButton, theme === themeName && styles.selectedThemeButton]}
      onPress={() => setTheme(themeName)}
    >
      {icon}
      <Text style={[styles.themeButtonText, theme === themeName && styles.selectedThemeButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeSelector}>
            {renderThemeButton('light', <Sun size={20} color={theme === 'light' ? '#007AFF' : '#FFFFFF'} />, 'Light')}
            {renderThemeButton('dark', <Moon size={20} color={theme === 'dark' ? '#007AFF' : '#FFFFFF'} />, 'Dark')}
            {renderThemeButton('system', <Monitor size={20} color={theme === 'system' ? '#007AFF' : '#FFFFFF'} />, 'System')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Editor</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Command size={20} color="#FFFFFF" />
              <Text style={styles.settingLabel}>Vim Mode</Text>
            </View>
            <Switch 
              value={vimMode} 
              onValueChange={toggleVimMode}
              trackColor={{ false: '#3C3C3C', true: '#007AFF' }}
              thumbColor={vimMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <RotateCcw size={20} color="#FFFFFF" />
              <Text style={styles.settingLabel}>Auto Save</Text>
            </View>
            <Switch 
              value={autoSave} 
              onValueChange={setAutoSave}
              trackColor={{ false: '#3C3C3C', true: '#007AFF' }}
              thumbColor={autoSave ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compilation</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.settingLabel}>Offline Mode</Text>
            </View>
            <Switch 
              value={offlineMode} 
              onValueChange={setOfflineMode}
              trackColor={{ false: '#3C3C3C', true: '#007AFF' }}
              thumbColor={offlineMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connectivity</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Github size={20} color="#FFFFFF" />
            <Text style={styles.settingButtonText}>Connect to GitHub</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Zap size={20} color="#FFFFFF" />
            <Text style={styles.settingButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>PingCode v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 PingCode</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252526',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  selectedThemeButton: {
    backgroundColor: '#0D72D1',
  },
  themeButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  selectedThemeButtonText: {
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252526',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  settingButtonText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 16,
  },
  versionInfo: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 4,
  },
  copyrightText: {
    color: '#A0A0A0',
    fontSize: 12,
  },
});