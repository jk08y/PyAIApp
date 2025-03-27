// Path: src/constants/courses.js

// Course categories
export const CATEGORIES = [
    { id: 'all', name: 'All Courses' },
    { id: 'python', name: 'Python', icon: 'code-outline' },
    { id: 'ai', name: 'AI & ML', icon: 'brain-outline' },
    { id: 'data-science', name: 'Data Science', icon: 'bar-chart-outline' },
    { id: 'web', name: 'Web Dev', icon: 'globe-outline' },
    { id: 'algorithms', name: 'Algorithms', icon: 'git-network-outline' },
  ];
  
  // Course levels
  export const LEVELS = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner', color: '#3B82F6' },
    { id: 'intermediate', name: 'Intermediate', color: '#8B5CF6' },
    { id: 'advanced', name: 'Advanced', color: '#EC4899' },
  ];
  
  // Course durations (for filters)
  export const DURATIONS = [
    { id: 'all', name: 'Any Length' },
    { id: 'short', name: 'Under 5 hours', maxHours: 5 },
    { id: 'medium', name: '5-10 hours', minHours: 5, maxHours: 10 },
    { id: 'long', name: 'Over 10 hours', minHours: 10 },
  ];
  
  // Sorting options
  export const SORT_OPTIONS = [
    { id: 'popular', name: 'Most Popular', field: 'popularity', direction: 'desc' },
    { id: 'newest', name: 'Newest', field: 'createdAt', direction: 'desc' },
    { id: 'highest-rated', name: 'Highest Rated', field: 'rating', direction: 'desc' },
    { id: 'title-asc', name: 'Title (A-Z)', field: 'title', direction: 'asc' },
    { id: 'title-desc', name: 'Title (Z-A)', field: 'title', direction: 'desc' },
  ];
  
  // Featured courses (displayed on homepage)
  export const FEATURED_COURSES = [
    'python-fundamentals',
    'intro-to-machine-learning',
    'data-visualization-python',
    'deep-learning-fundamentals',
  ];
  
  // Recommended courses for beginners
  export const RECOMMENDED_FOR_BEGINNERS = [
    'python-fundamentals',
    'python-web-development',
    'data-visualization-python',
  ];
  
  // Skill paths (collections of related courses)
  export const SKILL_PATHS = [
    {
      id: 'python-developer',
      title: 'Python Developer',
      description: 'Learn Python programming and build real-world applications',
      courses: ['python-fundamentals', 'python-web-development', 'python-data-structures'],
      level: 'beginner',
      expectedTime: '30 hours',
      icon: 'code-slash-outline',
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Master data analysis, visualization, and machine learning',
      courses: ['data-visualization-python', 'intro-to-machine-learning', 'deep-learning-fundamentals'],
      level: 'intermediate',
      expectedTime: '45 hours',
      icon: 'analytics-outline',
    },
    {
      id: 'ai-engineer',
      title: 'AI Engineer',
      description: 'Build advanced AI systems and neural networks',
      courses: ['intro-to-machine-learning', 'deep-learning-fundamentals', 'nlp-fundamentals'],
      level: 'advanced',
      expectedTime: '50 hours',
      icon: 'telescope-outline',
    },
  ];
  
  // Course completion requirements
  export const COMPLETION_REQUIREMENTS = {
    WATCH_ALL_VIDEOS: 'watch_all_videos',
    COMPLETE_ALL_EXERCISES: 'complete_all_exercises',
    PASS_FINAL_TEST: 'pass_final_test',
  };
  
  // Default settings for course progress tracking
  export const PROGRESS_SETTINGS = {
    autoMarkComplete: true,
    minimumTestScore: 70, // percentage
    trackingMethod: 'video_progress', // 'video_progress', 'manual'
  };
  
  // Export all constants
  export default {
    CATEGORIES,
    LEVELS,
    DURATIONS,
    SORT_OPTIONS,
    FEATURED_COURSES,
    RECOMMENDED_FOR_BEGINNERS,
    SKILL_PATHS,
    COMPLETION_REQUIREMENTS,
    PROGRESS_SETTINGS,
  };