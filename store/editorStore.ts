import { create } from 'zustand';
import { EditorFile, EditorStore, Project } from '../types/editor';

interface File {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
}

interface EditorState {
  projects: Project[];
  currentProject: Project | null;
  files: File[];
  openFiles: string[];
  currentFile: string | null;
  mode: string;
  
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
  
  // New actions
  setEditorMode: (mode: string) => void;
}

// Sample initial data
const SAMPLE_FILES: EditorFile[] = [
  {
    id: '1',
    name: 'index.tsx',
    content: 'import React from "react";\n\nexport default function App() {\n  return <div>Hello World</div>;\n}'
  },
  {
    id: '2',
    name: 'styles.css',
    content: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}'
  }
];

const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'React App',
    description: 'A simple React application',
    language: 'typescript',
    files: SAMPLE_FILES,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useEditorStore = create<EditorStore>((set, get) => ({
  // File state
  currentFile: null,
  files: SAMPLE_FILES,
  mode: 'vscode',
  
  // Project state
  projects: SAMPLE_PROJECTS,
  currentProject: null,
  openFiles: [],
  
  // Editor mode actions
  setEditorMode: (mode) => set({ mode }),
  
  // File actions
  addFile: (file: EditorFile) => set((state) => ({
    files: [...state.files, file]
  })),
  updateFile: (id: string, content: string) => set((state) => ({
    files: state.files.map((file) => 
      file.id === id ? { ...file, content } : file
    )
  })),
  removeFile: (id: string) => set((state) => ({
    files: state.files.filter((file) => file.id !== id)
  })),
  getFileById: (fileId: string) => {
    const state = get();
    return state.files.find(file => file.id === fileId);
  },
  
  // Project actions
  setCurrentProject: (project: Project) => set({ currentProject: project }),
  addProject: (project: Project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  updateProject: (projectId: string, updates: Partial<Project>) => set((state) => ({
    projects: state.projects.map((project) =>
      project.id === projectId ? { ...project, ...updates } : project
    )
  })),
  deleteProject: (projectId: string) => set((state) => ({
    projects: state.projects.filter((project) => project.id !== projectId),
    currentProject: state.currentProject?.id === projectId ? null : state.currentProject
  })),
  
  // Editor state actions
  setCurrentFile: (fileId: string) => set((state) => ({
    currentFile: fileId,
    openFiles: state.openFiles.includes(fileId) 
      ? state.openFiles 
      : [...state.openFiles, fileId]
  })),
  closeFile: (fileId: string) => set((state) => ({
    openFiles: state.openFiles.filter((id) => id !== fileId),
    currentFile: state.currentFile === fileId ? null : state.currentFile
  })),
  saveAllFiles: () => {
    // Implement save functionality if needed
  }
}));