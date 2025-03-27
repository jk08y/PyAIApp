// Path: src/components/subscription/PlanCard.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';

const PlanCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features = [], 
  isPopular = false,
  isSelected = false,
  onSelect,
  style = {}
}) => {
  const { colors, getTypography, getShadow } = useContext(ThemeContext);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        getShadow(2),
        { 
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
        style
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      {/* Popular Tag */}
      {isPopular && (
        <View 
          style={[
            styles.popularTag,
            { backgroundColor: colors.accent }
          ]}
        >
          <Text 
            style={[
              getTypography('caption'),
              { 
                color: '#FFF',
                fontWeight: 'bold',
              }
            ]}
          >
            MOST POPULAR
          </Text>
        </View>
      )}
      
      {/* Plan Header */}
      <View style={styles.header}>
        <View>
          <Text 
            style={[
              getTypography('h3'),
              { color: colors.text }
            ]}
          >
            {name}
          </Text>
          
          <Text 
            style={[
              getTypography('body2'),
              { 
                color: colors.grayText,
                marginTop: 4,
              }
            ]}
          >
            {description}
          </Text>
        </View>
        
        <View 
          style={[
            styles.radioButton,
            { 
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: isSelected ? colors.primary : 'transparent',
            }
          ]}
        >
          {isSelected && (
            <View 
              style={[
                styles.radioInner,
                { backgroundColor: '#FFF' }
              ]}
            />
          )}
        </View>
      </View>
      
      {/* Price */}
      <View style={styles.priceContainer}>
        <Text 
          style={[
            getTypography('h2'),
            { color: colors.text }
          ]}
        >
          {price}
        </Text>
        <Text 
          style={[
            getTypography('body2'),
            { color: colors.grayText }
          ]}
        >
          {period}
        </Text>
      </View>
      
      {/* Features */}
      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <View 
            key={index}
            style={styles.featureItem}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={colors.success} 
              style={styles.featureIcon}
            />
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.text,
                  flex: 1,
                }
              ]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  popularTag: {
    position: 'absolute',
    top: 12,
    right: -30,
    transform: [{ rotate: '45deg' }],
    paddingHorizontal: 30,
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
});

export default PlanCard;