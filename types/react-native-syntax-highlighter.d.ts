declare module 'react-native-syntax-highlighter' {
  import { ComponentType, Ref } from 'react';

  interface SyntaxHighlighterProps {
    language: string;
    style?: any;
    children?: string;
    customStyle?: any;
    highlighter?: string;
    CodeTag?: ComponentType<any>;
    showLineNumbers?: boolean;
    editable?: boolean;
    onChangeText?: (text: string) => void;
    onSelectionChange?: (e: any) => void;
    onKeyPress?: (e: any) => void;
    ref?: Ref<any>;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/hljs' {
  export const vs2015: any;
} 