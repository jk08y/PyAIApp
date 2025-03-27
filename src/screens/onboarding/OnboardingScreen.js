// Path: src/screens/onboarding/OnboardingScreen.js
import React, { useRef, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { onboardingData } from '../../data/onboarding';
import { ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { colors, getTypography } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Handle next button press
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to auth screen on last slide
      navigation.navigate('Auth');
    }
  };
  
  // Handle skip button press
  const handleSkip = () => {
    navigation.navigate('Auth');
  };
  
  // Render single onboarding slide
  const renderSlide = ({ item }) => {
    return (
      <View 
        style={[
          styles.slide, 
          { 
            backgroundColor: colors.background,
            width
          }
        ]}
      >
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              getTypography('h2'),
              { 
                color: colors.text,
                textAlign: 'center',
                marginBottom: 16,
              }
            ]}
          >
            {item.title}
          </Text>
          
          <Text 
            style={[
              getTypography('body1'),
              { 
                color: colors.grayText,
                textAlign: 'center',
              }
            ]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    );
  };
  
  // Render pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          
          // Animate dot width
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          // Animate dot opacity
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text 
            style={[
              getTypography('button'),
              { color: colors.primary }
            ]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          gradient={true}
          size="large"
          fullWidth={true}
          icon={currentIndex === onboardingData.length - 1 ? null : "arrow-forward"}
          iconPosition="right"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
});

export default OnboardingScreen;