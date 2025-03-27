// Path: src/screens/home/NotificationsScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import { formatDate } from '../../utils/helpers';

// Sample notification data
const sampleNotifications = [
  {
    id: '1',
    title: 'New Course Available',
    message: 'Check out our new Deep Learning Fundamentals course!',
    type: 'course',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    data: {
      courseId: 'deep-learning-fundamentals',
    },
  },
  {
    id: '2',
    title: 'Course Progress',
    message: 'You\'ve completed 50% of Python Fundamentals!',
    type: 'progress',
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    data: {
      courseId: 'python-fundamentals',
      progress: 50,
    },
  },
  {
    id: '3',
    title: 'New Feature',
    message: 'You can now download courses for offline learning!',
    type: 'feature',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    data: {},
  },
  {
    id: '4',
    title: 'Special Offer',
    message: 'Get 20% off Premium subscription for the next 48 hours!',
    type: 'offer',
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    data: {
      offerId: 'summer-sale',
    },
  },
  {
    id: '5',
    title: 'Welcome to PyAI',
    message: 'Thanks for joining PyAI App! Get started with our recommended courses.',
    type: 'welcome',
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    data: {},
  },
];

const NotificationsScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // Load notifications (mock data)
  const loadNotifications = async () => {
    // In a real app, this would fetch from a backend API
    // Here we're using sample data
    setNotifications(sampleNotifications);
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };
  
  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Handle notification press
  const handleNotificationPress = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'course':
        navigation.navigate('CourseDetail', { 
          courseId: notification.data.courseId 
        });
        break;
      
      case 'progress':
        navigation.navigate('CourseDetail', { 
          courseId: notification.data.courseId 
        });
        break;
      
      case 'offer':
        navigation.navigate('Plans');
        break;
      
      case 'feature':
      case 'welcome':
      default:
        // Just mark as read, no navigation
        break;
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course':
        return 'book-outline';
      case 'progress':
        return 'trophy-outline';
      case 'feature':
        return 'star-outline';
      case 'offer':
        return 'pricetag-outline';
      case 'welcome':
        return 'happy-outline';
      default:
        return 'notifications-outline';
    }
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="notifications-off-outline" 
        size={64} 
        color={colors.grayText} 
      />
      <Text 
        style={[
          getTypography('h3'),
          { 
            color: colors.text,
            marginTop: 16,
            marginBottom: 8,
          }
        ]}
      >
        No Notifications
      </Text>
      <Text 
        style={[
          getTypography('body1'),
          { 
            color: colors.grayText,
            textAlign: 'center',
            paddingHorizontal: 40,
          }
        ]}
      >
        You don't have any notifications yet. We'll notify you about course updates, special offers, and more.
      </Text>
    </View>
  );
  
  // Render notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: item.read ? colors.card : colors.primaryLight,
          borderColor: colors.border,
        }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View 
        style={[
          styles.iconContainer,
          { 
            backgroundColor: item.read 
              ? colors.isDark ? colors.darkCard : colors.whiteSmoke
              : colors.primary
          }
        ]}
      >
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={item.read ? colors.grayText : '#FFF'} 
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text 
          style={[
            getTypography('subtitle1'),
            { 
              color: colors.text,
              fontWeight: item.read ? 'normal' : 'bold',
            }
          ]}
        >
          {item.title}
        </Text>
        
        <Text 
          style={[
            getTypography('body2'),
            { 
              color: colors.grayText,
              marginTop: 4,
              marginBottom: 8,
            }
          ]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        
        <Text 
          style={[
            getTypography('caption'),
            { color: colors.grayText }
          ]}
        >
          {formatDate(item.date, 'relative')}
        </Text>
      </View>
      
      {!item.read && (
        <View 
          style={[
            styles.unreadIndicator,
            { backgroundColor: colors.primary }
          ]}
        />
      )}
    </TouchableOpacity>
  );
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <SafeAreaView 
      style={[
        themeStyles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      <Header 
        title="Notifications" 
        showBack={true} 
      />
      
      {/* Header with Mark All as Read button */}
      {notifications.length > 0 && unreadCount > 0 && (
        <View 
          style={[
            styles.headerActions,
            { 
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            }
          ]}
        >
          <Text 
            style={[
              getTypography('body2'),
              { color: colors.grayText }
            ]}
          >
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
          
          <TouchableOpacity
            onPress={markAllAsRead}
          >
            <Text 
              style={[
                getTypography('button'),
                { 
                  color: colors.primary,
                  fontSize: 14,
                }
              ]}
            >
              MARK ALL AS READ
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
  },
  unreadIndicator: {
    width: 8,
    position: 'absolute',
    top: 16,
    right: 16,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationsScreen;