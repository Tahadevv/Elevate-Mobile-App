import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  analytics: null,
  isLoading: false,
  error: null,
  noAnalytics: false,
};

// Async thunk for fetching quiz analytics
export const fetchQuizAnalytics = createAsyncThunk(
  'quizAnalytics/fetchQuizAnalytics',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      if (!courseId) {
        return rejectWithValue('Course ID is required');
      }

      // Quiz API endpoints
      const questionsEndpoint = `/courses/${courseId}/question_page`; // NO trailing slash
      const progressEndpoint = `/quiz_progress/${courseId}/latest-submitted-analytics/`; // WITH trailing slash

      console.log('🔵 ========================================');
      console.log('🔵 FETCH QUIZ ANALYTICS');
      console.log('🔵 ========================================');
      console.log('📋 Questions URL:', buildURL(questionsEndpoint));
      console.log('📋 Progress URL:', buildURL(progressEndpoint));
      console.log('📋 Course ID:', courseId);

      const [questionsResponse, progressResponse] = await Promise.all([
        fetch(buildURL(questionsEndpoint), {
          method: 'GET',
          headers: getAuthHeaders(token),
        }),
        fetch(buildURL(progressEndpoint), {
          method: 'GET',
          headers: getAuthHeaders(token),
        }),
      ]);

      console.log('📊 Questions Response Status:', questionsResponse.status, questionsResponse.ok);
      console.log('📊 Progress Response Status:', progressResponse.status, progressResponse.ok);

      // Handle questions response
      if (!questionsResponse.ok) {
        console.error('❌ Questions API failed:', questionsResponse.status, questionsResponse.statusText);
        return rejectWithValue(`Questions API failed: ${questionsResponse.status}`);
      }

      const questionsData = await questionsResponse.json();
      console.log('📊 Questions API Response:', JSON.stringify(questionsData, null, 2));

      // Handle progress response
      let progressData = null;
      if (progressResponse.ok) {
        const progressWrapper = await progressResponse.json();
        console.log('📊 Progress API Raw Response:', JSON.stringify(progressWrapper, null, 2));
        
        // Check if response contains "No analytics found" message
        if (progressWrapper && typeof progressWrapper === 'object' && 'detail' in progressWrapper) {
          const detail = progressWrapper.detail;
          if (detail === "No analytics found" || (typeof detail === 'string' && detail.includes("No analytics"))) {
            console.log('⚠️ No analytics found in progress response detail');
            return {
              questions: questionsData,
              progress: null,
              noAnalytics: true,
            };
          }
        }
        
        // Extract data from wrapper if it exists
        progressData = progressWrapper.data || progressWrapper;
        console.log('📊 Progress Data (extracted):', JSON.stringify(progressData, null, 2));
      } else if (progressResponse.status === 404) {
        // No analytics found - return questions only
        console.log('⚠️ No quiz analytics found (404)');
        return {
          questions: questionsData,
          progress: null,
          noAnalytics: true,
        };
      } else {
        console.error('❌ Progress API failed:', progressResponse.status, progressResponse.statusText);
        return rejectWithValue(`Progress API failed: ${progressResponse.status}`);
      }

      const result = {
        questions: questionsData,
        progress: progressData,
        noAnalytics: false,
      };
      
      console.log('✅ ========================================');
      console.log('✅ QUIZ ANALYTICS FETCH SUCCESS');
      console.log('✅ ========================================');
      
      return result;
    } catch (error) {
      console.error('❌ Quiz Analytics Fetch Error:', error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Quiz Analytics slice
const quizAnalyticsSlice = createSlice({
  name: 'quizAnalytics',
  initialState,
  reducers: {
    clearQuizAnalyticsError: (state) => {
      state.error = null;
    },
    clearQuizAnalytics: (state) => {
      state.analytics = null;
      state.error = null;
      state.noAnalytics = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Quiz Analytics
    builder
      .addCase(fetchQuizAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.noAnalytics = false;
      })
      .addCase(fetchQuizAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
        state.noAnalytics = action.payload?.noAnalytics || false;
        state.error = null;
      })
      .addCase(fetchQuizAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch quiz analytics';
        state.noAnalytics = false;
      });
  },
});

export const { clearQuizAnalyticsError, clearQuizAnalytics } = quizAnalyticsSlice.actions;
export default quizAnalyticsSlice.reducer;

