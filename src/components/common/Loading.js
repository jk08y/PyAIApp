// Path: src/components/common/Loading.js
import React, { useContext } from 'react';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet,
  useWindowDimensions 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import LottieView from 'lottie-react-native';

const Loading = ({ 
  fullScreen = false, 
  message = 'Loading...', 
  showMessage = true,
  size = 'large',
  useAnimation = false,
}) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { width, height } = useWindowDimensions();
  
  // Full screen loading
  if (fullScreen) {
    return (
      <View 
        style={[
          styles.fullScreenContainer, 
          { 
            backgroundColor: colors.background,
            width,
            height,
          }
        ]}
      >
        {useAnimation ? (
          <LottieView
            source={require('../../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        ) : (
          <ActivityIndicator 
            size="large" 
            color={colors.primary} 
          />
        )}
        
        {showMessage && (
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 20,
              }
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    );
  }
  
  // Inline loading
  return (
    <View style={styles.container}>
      {useAnimation ? (
        <LottieView
          source={require('../../../assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: size === 'large' ? 80 : 40, height: size === 'large' ? 80 : 40 }}
        />
      ) : (
        <ActivityIndicator 
          size={size} 
          color={colors.primary} 
        />
      )}
      
      {showMessage && (
        <Text 
          style={[
            getTypography('body2'),
            { 
              color: colors.text,
              marginTop: 8,
            }
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default Loading;