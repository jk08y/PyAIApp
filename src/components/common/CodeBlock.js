// Path: src/components/common/CodeBlock.js
import React, { useContext, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Text,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const CodeBlock = ({
  code,
  language = 'python',
  editable = false,
  onChangeCode,
  style = {},
  showLineNumbers = true,
  showCopyButton = true,
  containerStyle = {},
  onRunCode,
}) => {
  const { colors, getTypography } = useContext(ThemeContext);
  const scrollViewRef = useRef(null);
  
  // Handle copy to clipboard
  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
  };
  
  // Format code lines with line numbers
  const renderCodeLines = () => {
    if (!code) return null;
    
    const lines = code.split('\n');
    
    return lines.map((line, index) => (
      <View key={index} style={styles.lineContainer}>
        {showLineNumbers && (
          <Text 
            style={[
              getTypography('code'),
              styles.lineNumber,
              { color: colors.grayText },
            ]}
          >
            {index + 1}
          </Text>
        )}
        <Text 
          style={[
            getTypography('code'),
            { color: colors.codeText },
          ]}
        >
          {line}
        </Text>
      </View>
    ));
  };
  
  // Render editable code input
  if (editable) {
    return (
      <View 
        style={[
          styles.container,
          { 
            backgroundColor: colors.codeBackground,
            borderColor: colors.border,
          },
          containerStyle
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.languageContainer}>
            <Text 
              style={[
                getTypography('caption'),
                { color: colors.grayText }
              ]}
            >
              {language.toUpperCase()}
            </Text>
          </View>
          
          {/* Actions */}
          <View style={styles.actions}>
            {showCopyButton && (
              <TouchableOpacity
                onPress={handleCopy}
                style={styles.actionButton}
              >
                <Ionicons 
                  name="copy-outline" 
                  size={18} 
                  color={colors.grayText} 
                />
              </TouchableOpacity>
            )}
            
            {onRunCode && (
              <TouchableOpacity
                onPress={onRunCode}
                style={[
                  styles.runButton,
                  { backgroundColor: colors.primary }
                ]}
              >
                <Ionicons 
                  name="play" 
                  size={18} 
                  color="#FFF" 
                />
                <Text 
                  style={[
                    getTypography('button'),
                    { 
                      color: '#FFF',
                      fontSize: 14,
                      marginLeft: 4,
                    }
                  ]}
                >
                  RUN
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Editable code area */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.codeContainer}
          horizontal={false}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.codeContent}
        >
          <View style={styles.codeEditor}>
            {showLineNumbers && (
              <View style={styles.lineNumberColumn}>
                {code.split('\n').map((_, index) => (
                  <Text 
                    key={index}
                    style={[
                      getTypography('code'),
                      styles.lineNumber,
                      { color: colors.grayText },
                    ]}
                  >
                    {index + 1}
                  </Text>
                ))}
              </View>
            )}
            
            <TextInput
              value={code}
              onChangeText={onChangeCode}
              multiline
              style={[
                getTypography('code'),
                styles.codeInput,
                { 
                  color: colors.codeText,
                  backgroundColor: 'transparent',
                },
                style
              ]}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
  
  // Render read-only code block
  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: colors.codeBackground,
          borderColor: colors.border,
        },
        containerStyle
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.languageContainer}>
          <Text 
            style={[
              getTypography('caption'),
              { color: colors.grayText }
            ]}
          >
            {language.toUpperCase()}
          </Text>
        </View>
        
        {/* Copy button */}
        {showCopyButton && (
          <TouchableOpacity
            onPress={handleCopy}
            style={styles.actionButton}
          >
            <Ionicons 
              name="copy-outline" 
              size={18} 
              color={colors.grayText} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Code content */}
      <ScrollView 
        horizontal
        style={styles.codeContainer}
        contentContainerStyle={styles.codeContent}
      >
        <ScrollView 
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {renderCodeLines()}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  languageContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  codeContainer: {
    padding: 12,
  },
  codeContent: {
    paddingBottom: 12,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  lineNumber: {
    width: 30,
    textAlign: 'right',
    marginRight: 8,
    opacity: 0.6,
  },
  codeEditor: {
    flexDirection: 'row',
  },
  lineNumberColumn: {
    paddingRight: 8,
  },
  codeInput: {
    flex: 1,
    padding: 0,
    textAlignVertical: 'top',
  },
});

export default CodeBlock;