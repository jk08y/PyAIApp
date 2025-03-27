// Path: src/components/courses/CourseCard.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // 2 columns with margins

const CourseCard = ({
  id,
  title,
  description,
  image,
  category,
  duration,
  level,
  progress = 0, // 0-100
  isPremium = false,
  isCompleted = false,
  onPress,
  style,
}) => {
  const { colors, getTypography, getShadow } = useContext(ThemeContext);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        getShadow(3),
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: cardWidth,
        },
        style
      ]}
    >
      {/* Course Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Premium Badge */}
        {isPremium && (
          <View 
            style={[
              styles.premiumBadge,
              { backgroundColor: colors.primary }
            ]}
          >
            <Ionicons name="star" size={12} color="#FFF" />
            <Text 
              style={[
                getTypography('caption'),
                { 
                  color: '#FFF',
                  marginLeft: 2,
                  fontWeight: 'bold',
                }
              ]}
            >
              PRO
            </Text>
          </View>
        )}
        
        {/* Level Badge */}
        <View 
          style={[
            styles.levelBadge,
            { backgroundColor: colors.background }
          ]}
        >
          <Text 
            style={[
              getTypography('caption'),
              { color: colors.text }
            ]}
          >
            {level}
          </Text>
        </View>
      </View>
      
      {/* Course Details */}
      <View style={styles.details}>
        {/* Category */}
        <Text 
          style={[
            getTypography('caption'),
            { 
              color: colors.primary,
              marginBottom: 4,
            }
          ]}
        >
          {category}
        </Text>
        
        {/* Title */}
        <Text 
          style={[
            getTypography('subtitle1'),
            { 
              color: colors.text,
              marginBottom: 4,
            }
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        
        {/* Duration */}
        <View style={styles.row}>
          <Ionicons 
            name="time-outline" 
            size={14} 
            color={colors.grayText} 
          />
          <Text 
            style={[
              getTypography('caption'),
              { 
                color: colors.grayText,
                marginLeft: 4,
              }
            ]}
          >
            {duration}
          </Text>
        </View>
        
        {/* Progress Bar (only show if started) */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={progress} 
              height={4}
              isCompleted={isCompleted}
            />
            <Text 
              style={[
                getTypography('caption'),
                { 
                  color: isCompleted ? colors.success : colors.grayText,
                  marginTop: 4,
                  alignSelf: 'flex-end',
                }
              ]}
            >
              {isCompleted ? 'Completed' : `${progress}% complete`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  details: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
});

export default CourseCard;