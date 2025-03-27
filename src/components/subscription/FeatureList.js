// Path: src/components/subscription/FeatureList.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';

const FeatureList = ({ 
  features = [], 
  type = 'checkmark', // 'checkmark', 'compare'
  compareData = null, // { free: [true, false, ...], premium: [true, true, ...] }
  style = {}
}) => {
  const { colors, getTypography } = useContext(ThemeContext);
  
  // Render checkmark style feature list
  if (type === 'checkmark') {
    return (
      <View style={[styles.container, style]}>
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
    );
  }
  
  // Render compare style feature list
  if (type === 'compare' && compareData) {
    return (
      <View style={[styles.container, style]}>
        {features.map((feature, index) => (
          <View 
            key={index}
            style={[
              styles.compareRow,
              index < features.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }
            ]}
          >
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
            
            <View style={styles.compareColumns}>
              {/* Free Plan */}
              <View style={styles.compareColumn}>
                {compareData.free[index] ? (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                ) : (
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                )}
              </View>
              
              {/* Premium Plan */}
              <View style={styles.compareColumn}>
                {compareData.premium[index] ? (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                ) : (
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                )}
              </View>
            </View>
          </View>
        ))}
        
        {/* Plan headers */}
        <View style={styles.compareHeaders}>
          <View style={styles.compareHeaderItem}>
            <Text 
              style={[
                getTypography('caption'),
                { color: colors.grayText }
              ]}
            >
              FREE
            </Text>
          </View>
          <View style={styles.compareHeaderItem}>
            <Text 
              style={[
                getTypography('caption'),
                { color: colors.primary }
              ]}
            >
              PREMIUM
            </Text>
          </View>
        </View>
      </View>
    );
  }
  
  // Return empty view if invalid type or missing data
  return <View />;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 8,
  },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  compareColumns: {
    flexDirection: 'row',
    width: 120,
  },
  compareColumn: {
    flex: 1,
    alignItems: 'center',
  },
  compareHeaders: {
    position: 'absolute',
    top: -26,
    right: 0,
    flexDirection: 'row',
    width: 120,
  },
  compareHeaderItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default FeatureList;