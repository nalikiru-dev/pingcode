import { Redirect } from 'expo-router';
import { useState } from 'react';

export default function Index() {
  const [step, setStep] = useState<'choose'|'details'|'theme'>('choose');
  const [projectType, setProjectType] = useState<'scratch'|'template'|'github'>();
  const [theme, setTheme] = useState('dark');
  const [editorMode, setEditorMode] = useState('vscode');

  if (step === 'choose') {
    // Show buttons for "Scratch", "Template", "GitHub"
    // On select, setProjectType and setStep('details')
  }
  if (step === 'details') {
    // Show form for project name, template picker, or GitHub URL
    // On submit, setStep('theme')
  }
  if (step === 'theme') {
    // Show theme and editor mode pickers (like in Settings)
    // On finish, call onCreateProject and close modal
  }

  return <Redirect href="/projects" />;
}