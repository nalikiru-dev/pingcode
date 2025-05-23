import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';

interface NewProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateProject: (name: string, template: string) => void;
  templates: any[];
}

export default function NewProjectModal({ 
  visible, 
  onClose, 
  onCreateProject,
  templates 
}: NewProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const handleCreate = () => {
    if (projectName.trim() && selectedTemplate) {
      onCreateProject(projectName.trim(), selectedTemplate);
      setProjectName('');
      setSelectedTemplate('');
    }
  };
  
  const isFormValid = projectName.trim().length > 0 && selectedTemplate.length > 0;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Project</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Project Name</Text>
              <TextInput
                style={styles.input}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="My Awesome Project"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            
            <Text style={styles.sectionTitle}>Select Template</Text>
            <FlatList
              data={templates}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.templateItem,
                    selectedTemplate === item.id && styles.selectedTemplate
                  ]}
                  onPress={() => setSelectedTemplate(item.id)}
                >
                  <View style={styles.templateContent}>
                    <View style={[
                      styles.languageIcon, 
                      { 
                        backgroundColor: 
                          item.language === 'javascript' ? '#F7DF1E' : 
                          item.language === 'python' ? '#3776AB' : 
                          '#DEA584' 
                      }
                    ]}>
                      <Text style={{ 
                        color: item.language === 'javascript' ? '#000000' : '#FFFFFF' 
                      }}>
                        {item.language === 'javascript' ? 'JS' : 
                         item.language === 'python' ? 'PY' : 'RS'}
                      </Text>
                    </View>
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateName}>{item.name}</Text>
                      <Text style={styles.templateDesc}>{item.description}</Text>
                    </View>
                  </View>
                  {selectedTemplate === item.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.templatesList}
            />
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, !isFormValid && styles.disabledButton]}
              onPress={handleCreate}
              disabled={!isFormValid}
            >
              <Text style={styles.createButtonText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#252526',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#3C3C3C',
    borderRadius: 4,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  templatesList: {
    maxHeight: 280,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  selectedTemplate: {
    borderWidth: 1,
    borderColor: '#0D72D1',
  },
  templateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    marginLeft: 12,
    flex: 1,
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
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D72D1',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#3C3C3C',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#0D72D1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#3C3C3C',
    opacity: 0.5,
  },
});