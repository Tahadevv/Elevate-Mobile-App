// API Configuration
const API_CONFIG = {
  baseURL: 'https://backend.smartcnc.site',

  // Fixed token for testing (fallback)
  FIXED_TOKEN: 'ef9f2920fb036c8f6658be90ea21019149cbbd97',

  // Authentication Endpoints
  auth: {
    login: '/auth/token/login',
    signup: '/auth/users/',
    signupVerify: '/auth/signup/verify',
    resendOtp: '/auth/resend-otp',
    forgotPassword: '/auth/forgot-password',
    verifyOtp: '/auth/verify-otp',
    resetPassword: '/auth/reset-password',
    getUserProfile: '/auth/users/me/',
    updateUserProfile: '/auth/users/me/',
    googleOAuth: '/auth/o/google-oauth2/',
  },

  // Course Endpoints
  courses: {
    getDomainsCourses: '/domains/courses/',
    getCourseDetails: (courseId) => `/course_details/${courseId}/`,
    getCourseFlashcards: (courseId) => `/courses/${courseId}/flashcard_page/`,
    registerCourse: '/user_courses/',
  },

  // Notes Endpoints
  notes: {
    getAllNotes: '/notes/',
    createNote: '/notes/',
    updateNote: (noteId) => `/notes/${noteId}/`,
    deleteNote: (noteId) => `/notes/${noteId}/`,
  },

  // Assessment & Quiz Endpoints
  assessments: {
    getPracticeQuiz: (courseId) => `/courses/${courseId}/question_page/`,
    getMockExam: '/course/test',
    getMockAssessment: '/course/Information-Mock-Assessment',
    getQuizAnalytics: '/course/result/stats',
    getTestAnalytics: (courseId) => `/courses/${courseId}/full_test_page/`,
    getTestProgress: (courseId) => `/test_progress/${courseId}/latest-submitted-analytics/`,
    getQuizProgress: (courseId, source = 'analytics') => `/quiz_progress/${courseId}/progress/?source=${source}`,
    getQuizLatestAnalytics: (courseId) => `/quiz_progress/${courseId}/latest-submitted-analytics/`,
    submitQuizAnswer: '/quiz/submit-answer/',
    submitQuizResults: '/quiz/submit-results/',
    updateQuizQuestion: '/quiz_progress/update_question/',
  },

  // AI Chat Endpoints
  ai: {
    query: '/query/',
  },

  // Study Tools Endpoints
  studyTools: {
    getFlashcards: '/pages/flashcards',
  },

  // Blog Endpoints
  blogs: {
    getAllBlogs: '/blogs/',
    getLatestBlogs: '/blogs/latest/',
    getBlogById: (blogId) => `/blogs/${blogId}/`,
    createBlogReply: '/blog_replies/',
  },

  // Newsletter Endpoints
  newsletter: {
    subscribe: '/newsletter_subscriptions/',
  },

  // Notifications Endpoints
  notifications: {
    getAllNotifications: '/notifications/',
  },

  // Announcements Endpoints
  announcements: {
    getGeneralAnnouncements: '/general_announcements/',
  },

  // Help Center Endpoints
  helpCenter: {
    submitHelpRequest: '/help_center/',
  },

  // Dashboard Endpoints
  dashboard: {
    getDashboardData: '/dashboard/',
    getPaidIndustries: '/dashboard-paid/',
    getUnpaidIndustries: '/dashboard-unpaid/',
  },

  // Payment Endpoints
  payment: {
    createStripeCheckout: '/api/stripe/create-checkout-session/',
  },

  // Subscription Endpoints
  subscriptions: {
    getUserActiveDomains: '/user_active_domains/',
    cancelSubscription: (subscriptionId) => `/user_active_domains/${subscriptionId}/cancel/`,
  },

  // Events Endpoints
  events: {
    getAllEvents: '/events/',
    createEvent: '/events/',
    updateEvent: (eventId) => `/events/${eventId}/`,
    deleteEvent: (eventId) => `/events/${eventId}/`,
  },
};

// Helper function to build full URL
export const buildURL = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function to get auth headers
// Token can be passed directly, or will use FIXED_TOKEN as fallback
// In components, get token from Redux: const token = useSelector((state) => state.auth.token);
export const getAuthHeaders = (token) => {
  const authToken = token || API_CONFIG.FIXED_TOKEN;
  return {
    'Authorization': `Token ${authToken}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to get auth headers with fixed token
export const getFixedAuthHeaders = () => {
  return {
    'Authorization': `Token ${API_CONFIG.FIXED_TOKEN}`,
    'Content-Type': 'application/json',
  };
};

export default API_CONFIG;

