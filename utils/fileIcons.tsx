import { FileText, Code, FileJson, FileCog, FileSpreadsheet, FileImage, Coffee, Globe } from 'lucide-react-native';
import React from 'react';

export function getFileIconByType(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return Code;
      
    case 'json':
      return FileJson;
      
    case 'config':
    case 'conf':
    case 'cfg':
      return FileCog;
      
    case 'css':
    case 'scss':
    case 'less':
      return FileSpreadsheet;
      
    case 'html':
    case 'htm':
      return Globe;
      
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return FileImage;
      
    case 'java':
      return Coffee;
      
    default:
      return FileText;
  }
}