// Path: src/components/common/Card.js
import React, { useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const Card = ({ 
  children, 
  onPress, 
  style = {}, 
  elevation = 2,
  borderRadius = 12,
  padding = 16,
}) => {
  const { colors, getShadow } = useContext(ThemeContext);
  
  const cardStyles = [
    styles.container,
    { 
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius,
      padding,
      ...getShadow(elevation),
    },
    style
  ];
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginBottom: 16,
  },
});

export default Card;