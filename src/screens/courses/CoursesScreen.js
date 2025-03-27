// Path: src/screens/courses/CoursesScreen.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { CourseContext } from '../../context/CourseContext';
import { AuthContext } from '../../context/AuthContext';
import CourseCard from '../../components/courses/CourseCard';
import Loading from '../../components/common/Loading';

const CATEGORIES = [
  { id: 'all', name: 'All Courses' },
  { id: 'python', name: 'Python' },
  { id: 'ai', name: 'AI & ML' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'web', name: 'Web Dev' },
  { id: 'algorithms', name: 'Algorithms' },
];

const LEVELS = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

const CoursesScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { isPremiumUser } = useContext(AuthContext);
  const { 
    fetchCourses, 
    courseList, 
    loading, 
    error, 
    loadMoreCourses,
    userProgress
  } = useContext(CourseContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showPremium, setShowPremium] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  // Fetch courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);
  
  // Filter courses when criteria change
  useEffect(() => {
    filterCourses();
  }, [courseList, searchQuery, selectedCategory, selectedLevel, showPremium]);
  
  // Load courses
  const loadCourses = async () => {
    const filters = {};
    
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }
    
    if (selectedLevel !== 'all') {
      filters.level = selectedLevel;
    }
    
    try {
      await fetchCourses(filters);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };
  
  // Filter courses based on search query and selected filters
  const filterCourses = () => {
    let filtered = [...courseList];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }
    
    // Apply premium filter
    if (!showPremium && !isPremiumUser) {
      filtered = filtered.filter(course => !course.isPremium);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredCourses(filtered);
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };
  
  // Handle course selection
  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetail', { 
      courseId: course.id,
      title: course.title,
    });
  };
  
  // Render category filter chips
  const renderCategoryFilter = () => (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterList}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterChip,
            { 
              backgroundColor: selectedCategory === item.id 
                ? colors.primary 
                : colors.card,
              borderColor: colors.border,
            }
          ]}
          onPress={() => setSelectedCategory(item.id)}
        >
          <Text 
            style={[
              getTypography('body2'),
              { 
                color: selectedCategory === item.id 
                  ? '#FFF' 
                  : colors.text,
              }
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
  
  // Render level filter
  const renderLevelFilter = () => (
    <View style={styles.levelFilter}>
      {LEVELS.map(level => (
        <TouchableOpacity
          key={level.id}
          style={[
            styles.levelChip,
            { 
              backgroundColor: selectedLevel === level.id 
                ? colors.primary 
                : 'transparent',
              borderColor: selectedLevel === level.id 
                ? colors.primary 
                : colors.border,
            }
          ]}
          onPress={() => setSelectedLevel(level.id)}
        >
          <Text 
            style={[
              getTypography('caption'),
              { 
                color: selectedLevel === level.id 
                  ? '#FFF' 
                  : colors.text,
              }
            ]}
          >
            {level.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  // Render search input
  const renderSearchBar = () => (
    <View 
      style={[
        styles.searchContainer,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
    >
      <Ionicons name="search" size={20} color={colors.icon} />
      <TextInput
        style={[
          getTypography('body1'),
          styles.searchInput,
          { color: colors.text }
        ]}
        placeholder="Search courses..."
        placeholderTextColor={colors.placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close-circle" size={20} color={colors.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
  
  // Render premium toggle
  const renderPremiumToggle = () => (
    <TouchableOpacity
      style={styles.premiumToggle}
      onPress={() => setShowPremium(!showPremium)}
    >
      <Ionicons 
        name={showPremium ? "checkbox" : "square-outline"} 
        size={20} 
        color={colors.primary} 
      />
      <Text 
        style={[
          getTypography('body2'),
          { 
            color: colors.text,
            marginLeft: 8,
          }
        ]}
      >
        Include Premium Courses
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView 
      style={[
        themeStyles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text 
          style={[
            getTypography('h2'),
            { color: colors.text }
          ]}
        >
          All Courses
        </Text>
      </View>
      
      {renderSearchBar()}
      {renderCategoryFilter()}
      
      <View style={styles.filterRow}>
        {renderLevelFilter()}
        {renderPremiumToggle()}
      </View>
      
      {loading && !refreshing ? (
        <Loading />
      ) : (
        <>
          {filteredCourses.length > 0 ? (
            <FlatList
              data={filteredCourses}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.courseList}
              columnWrapperStyle={styles.courseRow}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
              onEndReached={() => loadMoreCourses()}
              onEndReachedThreshold={0.5}
              renderItem={({ item }) => {
                // Get user progress for this course
                const progress = userProgress[item.id]?.progress || 0;
                const isCompleted = userProgress[item.id]?.completed || false;
                
                return (
                  <CourseCard
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    image={item.thumbnail}
                    category={item.category}
                    duration={item.duration}
                    level={item.level}
                    progress={progress}
                    isPremium={item.isPremium}
                    isCompleted={isCompleted}
                    onPress={() => handleCoursePress(item)}
                  />
                );
              }}
              ListFooterComponent={loading ? <Loading /> : null}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={64} color={colors.grayText} />
              <Text 
                style={[
                  getTypography('h3'),
                  { 
                    color: colors.text,
                    marginTop: 16,
                  }
                ]}
              >
                No courses found
              </Text>
              <Text 
                style={[
                  getTypography('body1'),
                  { 
                    color: colors.grayText,
                    textAlign: 'center',
                    marginTop: 8,
                    marginBottom: 24,
                    paddingHorizontal: 40,
                  }
                ]}
              >
                Try adjusting your search or filters to find what you're looking for.
              </Text>
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  { backgroundColor: colors.primary }
                ]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setShowPremium(true);
                }}
              >
                <Text 
                  style={[
                    getTypography('button'),
                    { color: '#FFF' }
                  ]}
                >
                  Clear All Filters
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    padding: 0,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  levelFilter: {
    flexDirection: 'row',
  },
  levelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
  },
  premiumToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseList: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  courseRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default CoursesScreen;