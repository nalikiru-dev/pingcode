import { View, Text, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export default function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  // A very basic syntax highlighter
  // In a real implementation, you would use a proper syntax highlighting library
  
  const applyHighlighting = (text: string, lang: string) => {
    if (!text) return text;
    
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      let formattedLine = line;
      
      // Basic highlighting for JavaScript/TypeScript
      if (lang === 'javascript' || lang === 'typescript') {
        // Keywords
        formattedLine = formattedLine.replace(
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g,
          '<keyword>$1</keyword>'
        );
        
        // Strings
        formattedLine = formattedLine.replace(
          /(["'`])(.*?)\1/g, 
          '<string>$1$2$1</string>'
        );
        
        // Comments
        formattedLine = formattedLine.replace(
          /\/\/(.*)/g,
          '<comment>//$1</comment>'
        );
        
        // Numbers
        formattedLine = formattedLine.replace(
          /\b(\d+)\b/g,
          '<number>$1</number>'
        );
      }
      
      // Basic highlighting for Python
      else if (lang === 'python') {
        // Keywords
        formattedLine = formattedLine.replace(
          /\b(def|class|if|else|elif|for|while|import|from|return|pass|True|False|None)\b/g,
          '<keyword>$1</keyword>'
        );
        
        // Strings
        formattedLine = formattedLine.replace(
          /(["'`])(.*?)\1/g, 
          '<string>$1$2$1</string>'
        );
        
        // Comments
        formattedLine = formattedLine.replace(
          /#(.*)/g,
          '<comment>#$1</comment>'
        );
        
        // Numbers
        formattedLine = formattedLine.replace(
          /\b(\d+)\b/g,
          '<number>$1</number>'
        );
      }
      
      return (
        <Text key={index} style={styles.codeLine}>
          {parseHighlightedCode(formattedLine)}
        </Text>
      );
    });
  };
  
  const parseHighlightedCode = (highlightedCode: string) => {
    // Split the code by highlighting tags
    const parts = highlightedCode.split(/<(\/?)(\w+)>/);
    const result = [];
    
    let i = 0;
    while (i < parts.length) {
      const part = parts[i];
      
      if (i % 3 === 0) {
        // Text part
        result.push(<Text key={`text-${i}`}>{part}</Text>);
      } else if (i % 3 === 1) {
        // Tag type (opening or closing)
        // Skip
      } else {
        // Tag name
        const isClosing = parts[i - 1] === '/';
        const tagName = part;
        
        if (!isClosing) {
          // Extract the content between opening and closing tags
          const content = parts[i + 3];
          
          if (tagName === 'keyword') {
            result.push(<Text key={`kw-${i}`} style={styles.keyword}>{content}</Text>);
          } else if (tagName === 'string') {
            result.push(<Text key={`str-${i}`} style={styles.string}>{content}</Text>);
          } else if (tagName === 'comment') {
            result.push(<Text key={`cmt-${i}`} style={styles.comment}>{content}</Text>);
          } else if (tagName === 'number') {
            result.push(<Text key={`num-${i}`} style={styles.number}>{content}</Text>);
          }
          
          // Skip the content and closing tag
          i += 3;
        }
      }
      
      i++;
    }
    
    return result;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.code}>
        {applyHighlighting(code, language)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  code: {
    color: '#D4D4D4',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : Platform.OS === 'android' ? 'monospace' : 'Consolas',
    fontSize: 14,
    lineHeight: 20,
  },
  codeLine: {
    color: '#D4D4D4',
  },
  keyword: {
    color: '#569CD6',
  },
  string: {
    color: '#CE9178',
  },
  comment: {
    color: '#6A9955',
  },
  number: {
    color: '#B5CEA8',
  },
});