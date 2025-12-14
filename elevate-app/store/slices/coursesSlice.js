import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  domains: [],
  dashboardData: [],
  isLoading: false,
  error: null,
  selectedDomain: null,
};

// Helper function to get random icon for domains
const getRandomIcon = (domainName) => {
  const icons = [
    'shield', 'cpu', 'database', 'code', 'globe', 'lock', 'cloud', 'server',
    'smartphone', 'monitor', 'wifi', 'hard-drive', 'key', 'search', 'settings',
    'users', 'book', 'graduation-cap', 'award', 'trending-up', 'pie-chart',
    'bar-chart', 'target', 'zap', 'star', 'heart', 'thumbs-up', 'lightbulb'
  ];
  
  // Use domain name to get consistent icon for same domain
  const hash = domainName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return icons[Math.abs(hash) % icons.length];
};

// Helper function to get random color for domains
const getRandomColor = (domainName) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#85C1E9', '#D7BDE2', '#A9DFBF', '#F9E79F', '#AED6F1'
  ];
  
  const hash = domainName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// Async thunks
export const fetchDomainsCourses = createAsyncThunk(
  'courses/fetchDomainsCourses',
  async (token, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.courses.getDomainsCourses);
      console.log('🌐 API Call - fetchDomainsCourses:', url);
      console.log('🔑 Headers:', getAuthHeaders(token));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();
      console.log('📥 fetchDomainsCourses Response:', data);

      if (!response.ok) {
        console.log('❌ fetchDomainsCourses Error Response:', data);
        return rejectWithValue(data.error || 'Failed to fetch domains courses');
      }

      // Add random icons and colors to domains
      const domainsWithIcons = data.map(domain => ({
        ...domain,
        icon: getRandomIcon(domain.name),
        color: getRandomColor(domain.name),
        courses: domain.courses?.map(course => ({
          ...course,
          icon: getRandomIcon(course.name),
          color: getRandomColor(course.name),
        })) || []
      }));

      return domainsWithIcons;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'courses/fetchDashboardData',
  async (token, { rejectWithValue }) => {
    try {
      const url = buildURL('/dashboard/');
      console.log('========================================');
      console.log('🌐 CALLING DASHBOARD API');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Token:', token);
      console.log('Headers:', getAuthHeaders(token));
      console.log('========================================');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();
      console.log('========================================');
      console.log('📥 DASHBOARD API RESPONSE RECEIVED:');
      console.log('========================================');
      console.log('Status:', response.status, response.statusText);
      console.log('Response Data:', JSON.stringify(data, null, 2));
      console.log('========================================');

      if (!response.ok) {
        console.log('❌ fetchDashboardData Error Response:', data);
        return rejectWithValue(data.error || 'Failed to fetch dashboard data');
      }

      // Add random icons and colors to dashboard data
      const dashboardWithIcons = data.map(domain => ({
        ...domain,
        icon: getRandomIcon(domain.name),
        color: getRandomColor(domain.name),
        currently_studying: domain.currently_studying?.map(course => ({
          ...course,
          icon: getRandomIcon(course.name),
          color: getRandomColor(course.name),
        })) || [],
        course_library: domain.course_library?.map(course => ({
          ...course,
          icon: getRandomIcon(course.name),
          color: getRandomColor(course.name),
        })) || []
      }));

      return dashboardWithIcons;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Courses slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCoursesError: (state) => {
      state.error = null;
    },
    setSelectedDomain: (state, action) => {
      state.selectedDomain = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Domains Courses
    builder
      .addCase(fetchDomainsCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDomainsCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.domains = action.payload;
        state.error = null;
        // Set first domain as selected by default
        if (action.payload.length > 0 && !state.selectedDomain) {
          state.selectedDomain = action.payload[0];
        }
      })
      .addCase(fetchDomainsCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Dashboard Data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.error = null;
        // Set first domain as selected by default if not already set
        if (action.payload.length > 0 && !state.selectedDomain) {
          state.selectedDomain = action.payload[0];
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoursesError, setSelectedDomain } = coursesSlice.actions;
export default coursesSlice.reducer;