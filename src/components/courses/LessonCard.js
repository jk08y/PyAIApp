// Path: src/components/courses/LessonCard.js
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import ProgressBar from './ProgressBar';

const LessonCard = ({ 
  index, 
  title, 
  duration, 
  progress = 0, 
  isCompleted = false,
  isLocked = false,
  onPress,
  style = {}
}) => {
  const { colors, getTypography, getShadow } = useContext(ThemeContext);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        getShadow(1),
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: isCompleted ? colors.success : colors.primary,
          borderLeftWidth: 4,
        },
        style
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View style={styles.lessonNumber}>
        <Text 
          style={[
            getTypography('h4'),
            { 
              color: colors.white,
            }
          ]}
        >
          {index}
        </Text>
      </View>
      
      <View style={styles.lessonContent}>
        <View style={styles.lessonHeader}>
          <Text 
            style={[
              getTypography('subtitle1'),
              { 
                color: isLocked ? colors.disabled : colors.text,
                flex: 1,
                marginRight: 8,
              }
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {isLocked ? (
            <Ionicons name="lock-closed" size={20} color={colors.disabled} />
          ) : isCompleted ? (
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          )}
        </View>
        
        <View style={styles.lessonMeta}>
          <Ionicons 
            name="time-outline" 
            size={14} 
            color={isLocked ? colors.disabled : colors.grayText} 
          />
          <Text 
            style={[
              getTypography('caption'),
              { 
                color: isLocked ? colors.disabled : colors.grayText,
                marginLeft: 4,
                marginRight: 12,
              }
            ]}
          >
            {duration}
          </Text>
          
          {progress > 0 && !isLocked && !isCompleted && (
            <Text 
              style={[
                getTypography('caption'),
                { color: colors.primary }
              ]}
            >
              {progress}% complete
            </Text>
          )}
          
          {isCompleted && !isLocked && (
            <Text 
              style={[
                getTypography('caption'),
                { color: colors.success }
              ]}
            >
              Completed
            </Text>
          )}
        </View>
        
        {progress > 0 && !isCompleted && !isLocked && (
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              height={4}
              isCompleted={isCompleted}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  lessonContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    paddingRight: 12,
  },
});

export default LessonCard;