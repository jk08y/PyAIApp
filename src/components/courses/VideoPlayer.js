// Path: src/components/courses/VideoPlayer.js
import React, { useState, useRef, useContext, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemeContext } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VideoPlayer = ({ 
  source, 
  posterSource = null,
  title = '',
  autoPlay = false,
  allowFullscreen = true,
  allowDownload = false,
  onDownload = null,
  onComplete = null,
  style = {}
}) => {
  const { colors, getTypography } = useContext(ThemeContext);
  const videoRef = useRef(null);
  
  const [status, setStatus] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimer, setControlsTimer] = useState(null);
  
  // Reset controls timer when showControls changes
  useEffect(() => {
    if (showControls && status.isPlaying) {
      if (controlsTimer) {
        clearTimeout(controlsTimer);
      }
      
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimer(timer);
      
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [showControls, status.isPlaying]);
  
  // Handle component unmount
  useEffect(() => {
    return () => {
      if (controlsTimer) {
        clearTimeout(controlsTimer);
      }
      
      // Ensure we lock back to portrait when unmounting
      if (isFullscreen) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    };
  }, [isFullscreen, controlsTimer]);
  
  // Format time in seconds to mm:ss format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Toggle play/pause
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = async () => {
    if (!allowFullscreen) return;
    
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle video status updates
  const handlePlaybackStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    
    // Notify parent when video completes
    if (newStatus.didJustFinish && onComplete) {
      onComplete();
    }
  };
  
  // Handle video press to show/hide controls
  const handleVideoPress = () => {
    setShowControls(!showControls);
  };
  
  // Handle seeking
  const handleSeek = async (value) => {
    if (videoRef.current) {
      const newPosition = value * status.durationMillis / 1000;
      await videoRef.current.setPositionAsync(newPosition * 1000);
    }
  };
  
  // Calculate progress
  const progress = status.durationMillis
    ? status.positionMillis / status.durationMillis
    : 0;
  
  return (
    <View 
      style={[
        styles.container,
        isFullscreen && styles.fullscreenContainer,
        style
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        <Video
          ref={videoRef}
          source={typeof source === 'string' ? { uri: source } : source}
          posterSource={posterSource ? 
            (typeof posterSource === 'string' ? { uri: posterSource } : posterSource) : 
            undefined
          }
          style={styles.video}
          resizeMode="contain"
          shouldPlay={autoPlay}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false}
        />
        
        {/* Loading Indicator */}
        {status.isBuffering && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        
        {/* Video Controls */}
        {showControls && (
          <View style={styles.controlsContainer}>
            {/* Title Bar */}
            {title && (
              <View style={styles.titleBar}>
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { color: '#FFF' }
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              </View>
            )}
            
            {/* Play/Pause Button */}
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <Ionicons 
                name={status.isPlaying ? 'pause' : 'play'} 
                size={30} 
                color="#FFF" 
              />
            </TouchableOpacity>
            
            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                  ]}
                >
                  <View 
                    style={[
                      styles.progress,
                      { 
                        width: `${progress * 100}%`,
                        backgroundColor: colors.primary,
                      }
                    ]}
                  />
                </View>
                
                {/* Time Display */}
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeText}>
                    {formatTime(status.positionMillis ? status.positionMillis / 1000 : 0)}
                  </Text>
                  <Text style={styles.timeText}>
                    {formatTime(status.durationMillis ? status.durationMillis / 1000 : 0)}
                  </Text>
                </View>
              </View>
              
              {/* Additional Controls */}
              <View style={styles.additionalControls}>
                {allowDownload && onDownload && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={onDownload}
                  >
                    <Ionicons name="download-outline" size={24} color="#FFF" />
                  </TouchableOpacity>
                )}
                
                {allowFullscreen && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleFullscreen}
                  >
                    <Ionicons 
                      name={isFullscreen ? 'contract' : 'expand'} 
                      size={24} 
                      color="#FFF" 
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    height: '100%',
    width: '100%',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  titleBar: {
    padding: 16,
    paddingBottom: 0,
  },
  playPauseButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomControls: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  progress: {
    height: 4,
    borderRadius: 2,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    marginLeft: 16,
  },
});

export default VideoPlayer;