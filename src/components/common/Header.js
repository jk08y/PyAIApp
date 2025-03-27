// Path: src/components/common/Header.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/ThemeContext';

const Header = ({ 
  title, 
  showBack = true, 
  rightIcon = null,
  onRightPress = null,
  transparent = false,
  style = {}
}) => {
  const { colors, getTypography } = useContext(ThemeContext);
  const navigation = useNavigation();
  
  return (
    <View 
      style={[
        styles.header,
        { 
          backgroundColor: transparent ? 'transparent' : colors.background,
          borderBottomColor: transparent ? 'transparent' : colors.border,
          borderBottomWidth: transparent ? 0 : 1,
        },
        style
      ]}
    >
      {showBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={colors.icon} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <Text 
        style={[
          getTypography('h4'),
          { 
            color: colors.text,
            textAlign: 'center',
          },
          styles.title
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      
      {rightIcon ? (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={onRightPress}
          disabled={!onRightPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name={rightIcon} 
            size={24} 
            color={colors.icon} 
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
  },
  rightButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
    height: 32,
  },
});

export default Header;