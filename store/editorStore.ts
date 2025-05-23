import { create } from 'zustand';
import { sampleProjects } from '@/data/sampleProjects';

interface File {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  files: File[];
  createdAt: string;
  updatedAt: string;
}

interface EditorState {
  projects: Project[];
  currentProject: Project | null;
  files: File[];
  openFiles: string[];
  currentFile: string | null;
  
  // Project actions
  setCurrentProject: (project: Project) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  
  // File actions
  addFile: (file: File) => void;
  updateFile: (fileId: string, updates: Partial<File>) => void;
  updateFileContent: (fileId: string, content: string) => void;
  deleteFile: (fileId: string) => void;
  getFileById: (fileId: string) => File | undefined;
  
  // Editor state actions
  setCurrentFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  saveAllFiles: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  projects: [],
  currentProject: null,
  files: [],
  openFiles: [],
  currentFile: null,
  
  setCurrentProject: (project) => {
    set({
      currentProject: project,
      files: project.files,
      openFiles: [],
      currentFile: null,
    });
  },
  
  addProject: (project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },
  
  updateProject: (projectId, updates) => {
    set((state) => ({
      projects: state.projects.map((project) => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() } 
          : project
      ),
      currentProject: 
        state.currentProject?.id === projectId 
          ? { ...state.currentProject, ...updates, updatedAt: new Date().toISOString() } 
          : state.currentProject,
    }));
  },
  
  deleteProject: (projectId) => {
    set((state) => {
      const newProjects = state.projects.filter(
        (project) => project.id !== projectId
      );
      
      return {
        projects: newProjects,
        currentProject: 
          state.currentProject?.id === projectId ? null : state.currentProject,
        files: 
          state.currentProject?.id === projectId ? [] : state.files,
        openFiles: 
          state.currentProject?.id === projectId ? [] : state.openFiles,
        currentFile: 
          state.currentProject?.id === projectId ? null : state.currentFile,
      };
    });
  },
  
  addFile: (file) => {
    set((state) => {
      const newFiles = [...state.files, file];
      
      // Update project files
      if (state.currentProject) {
        const updatedProject = {
          ...state.currentProject,
          files: newFiles,
          updatedAt: new Date().toISOString(),
        };
        
        // Update projects list
        const updatedProjects = state.projects.map((project) => 
          project.id === updatedProject.id ? updatedProject : project
        );
        
        return {
          files: newFiles,
          currentProject: updatedProject,
          projects: updatedProjects,
          openFiles: [...state.openFiles, file.id],
          currentFile: file.id,
        };
      }
      
      return { files: newFiles };
    });
  },
  
  updateFile: (fileId, updates) => {
    set((state) => {
      const newFiles = state.files.map((file) => 
        file.id === fileId ? { ...file, ...updates } : file
      );
      
      // Update project files
      if (state.currentProject) {
        const updatedProject = {
          ...state.currentProject,
          files: newFiles,
          updatedAt: new Date().toISOString(),
        };
        
        // Update projects list
        const updatedProjects = state.projects.map((project) => 
          project.id === updatedProject.id ? updatedProject : project
        );
        
        return {
          files: newFiles,
          currentProject: updatedProject,
          projects: updatedProjects,
        };
      }
      
      return { files: newFiles };
    });
  },
  
  updateFileContent: (fileId, content) => {
    set((state) => {
      const newFiles = state.files.map((file) => 
        file.id === fileId ? { ...file, content } : file
      );
      
      // Update project files
      if (state.currentProject) {
        const updatedProject = {
          ...state.currentProject,
          files: newFiles,
          updatedAt: new Date().toISOString(),
        };
        
        // Update projects list
        const updatedProjects = state.projects.map((project) => 
          project.id === updatedProject.id ? updatedProject : project
        );
        
        return {
          files: newFiles,
          currentProject: updatedProject,
          projects: updatedProjects,
        };
      }
      
      return { files: newFiles };
    });
  },
  
  deleteFile: (fileId) => {
    set((state) => {
      const newFiles = state.files.filter((file) => file.id !== fileId);
      
      // Update open files
      const newOpenFiles = state.openFiles.filter((id) => id !== fileId);
      let newCurrentFile = state.currentFile;
      
      if (state.currentFile === fileId) {
        newCurrentFile = newOpenFiles.length > 0 ? newOpenFiles[0] : null;
      }
      
      // Update project files
      if (state.currentProject) {
        const updatedProject = {
          ...state.currentProject,
          files: newFiles,
          updatedAt: new Date().toISOString(),
        };
        
        // Update projects list
        const updatedProjects = state.projects.map((project) => 
          project.id === updatedProject.id ? updatedProject : project
        );
        
        return {
          files: newFiles,
          openFiles: newOpenFiles,
          currentFile: newCurrentFile,
          currentProject: updatedProject,
          projects: updatedProjects,
        };
      }
      
      return {
        files: newFiles,
        openFiles: newOpenFiles,
        currentFile: newCurrentFile,
      };
    });
  },
  
  getFileById: (fileId) => {
    return get().files.find((file) => file.id === fileId);
  },
  
  setCurrentFile: (fileId) => {
    set((state) => {
      // If the file is already open, just set it as current
      if (state.openFiles.includes(fileId)) {
        return { currentFile: fileId };
      }
      
      // Otherwise, add it to open files and set as current
      return {
        openFiles: [...state.openFiles, fileId],
        currentFile: fileId,
      };
    });
  },
  
  closeFile: (fileId) => {
    set((state) => {
      const newOpenFiles = state.openFiles.filter((id) => id !== fileId);
      
      // If we're closing the current file, select another one
      let newCurrentFile = state.currentFile;
      if (state.currentFile === fileId) {
        newCurrentFile = newOpenFiles.length > 0 ? newOpenFiles[0] : null;
      }
      
      return {
        openFiles: newOpenFiles,
        currentFile: newCurrentFile,
      };
    });
  },
  
  saveAllFiles: () => {
    // This function doesn't need to do anything special in our implementation
    // since we're updating files in real-time, but we'll keep it for the UI
    set((state) => {
      if (state.currentProject) {
        const updatedProject = {
          ...state.currentProject,
          updatedAt: new Date().toISOString(),
        };
        
        // Update projects list
        const updatedProjects = state.projects.map((project) => 
          project.id === updatedProject.id ? updatedProject : project
        );
        
        return {
          currentProject: updatedProject,
          projects: updatedProjects,
        };
      }
      
      return state;
    });
  },
}));