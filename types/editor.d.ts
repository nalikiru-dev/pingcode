export interface EditorFile {
  id: string;
  name: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  files: EditorFile[];
  createdAt: string;
  updatedAt: string;
}

export interface EditorStore {
  // File state
  currentFile: string | null;
  files: EditorFile[];
  mode: 'vscode' | 'vim';
  
  // Project state
  projects: Project[];
  currentProject: Project | null;
  openFiles: string[];
  
  // Editor mode actions
  setEditorMode: (mode: 'vscode' | 'vim') => void;
  
  // File actions
  addFile: (file: EditorFile) => void;
  updateFile: (id: string, content: string) => void;
  removeFile: (id: string) => void;
  getFileById: (fileId: string) => EditorFile | undefined;
  
  // Project actions
  setCurrentProject: (project: Project) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  
  // Editor state actions
  setCurrentFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  saveAllFiles: () => void;
}

export interface FileSystemItem {
  [key: string]: FileSystemItem | string;
}

export type OutputType = 'text' | 'error' | 'success' | 'warning' | 'info' | 'highlight' | 'command';

export interface TerminalOutput {
  text: string;
  type: OutputType;
}

export type FileSystem = {
  [key: string]: FileSystemItem;
}; 