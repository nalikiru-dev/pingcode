export interface EditorFile {
  id: string;
  name: string;
  path: string;
  language: string;
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
  updateFile: (fileId: string, updates: Partial<EditorFile>) => void;
  updateFileContent: (fileId: string, content: string) => void;
  deleteFile: (fileId: string) => void;
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

export type TerminalOutputType = 'text' | 'error' | 'success' | 'warning' | 'info' | 'highlight' | 'command';

export interface TerminalOutput {
  text: string;
  type: TerminalOutputType;
}

export type FileSystem = {
  [key: string]: FileSystemItem;
}; 