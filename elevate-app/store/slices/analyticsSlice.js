import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  analytics: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchQuizAnalytics = createAsyncThunk(
  'quizAnalytics/fetchQuizAnalytics',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      if (!courseId) {
        return rejectWithValue('Course ID is required');
      }

      // Fetch both questions and progress in parallel (matching website implementation)
      // Website uses:
      // - Questions: /courses/${courseId}/question_page (NO trailing slash)
      // - Progress: /quiz_progress/${courseId}/latest-submitted-analytics/ (WITH trailing slash)
      const questionsEndpoint = `/courses/${courseId}/question_page`; // ✅ Matches website
      const progressEndpoint = `/quiz_progress/${courseId}/latest-submitted-analytics/`; // ✅ Matches website

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
      console.log('📊 Questions Total:', questionsData?.total_questions);
      console.log('📊 Questions Name:', questionsData?.name);
      console.log('📊 Questions Chapters Count:', questionsData?.chapters?.length);

      // Handle progress response
      let progressData = null;
      if (progressResponse.ok) {
        const progressWrapper = await progressResponse.json();
        console.log('📊 Progress API Raw Response:', JSON.stringify(progressWrapper, null, 2));
        
        // Check if response contains "No analytics found" message (matching website)
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
        
        // Extract data from wrapper if it exists (website returns { data: {...} })
        // Website code: progressData = progressWrapper.data
        progressData = progressWrapper.data || progressWrapper;
        
        console.log('📊 Progress Data (extracted):', JSON.stringify(progressData, null, 2));
        console.log('📊 Progress - Correct Count:', progressData?.correct_count);
        console.log('📊 Progress - Attempted Questions:', progressData?.attempted_questions);
        console.log('📊 Progress - Flagged Count:', progressData?.flagged_count);
        console.log('📊 Progress - Skipped Count:', progressData?.skipped_count);
        console.log('📊 Progress - Last Viewed Question:', progressData?.last_viewed_question);
        console.log('📊 Progress - Is Submitted:', progressData?.is_submitted);
        console.log('📊 Progress - Has Chapters:', !!progressData?.chapters);
        console.log('📊 Progress - Has Questions Array:', !!progressData?.questions);
      } else if (progressResponse.status === 404) {
        // No analytics found - return questions only
        console.log('⚠️ No quiz analytics found (404)');
        console.log('📊 Returning questions only, no progress data');
        return {
          questions: questionsData,
          progress: null,
          noAnalytics: true,
        };
      } else {
        console.error('❌ Progress API failed:', progressResponse.status, progressResponse.statusText);
        const errorText = await progressResponse.text();
        console.error('❌ Progress API Error Response:', errorText);
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
      console.log('✅ Final Result:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchTestAnalytics = createAsyncThunk(
  'testAnalytics/fetchTestAnalytics',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      if (!courseId) {
        return rejectWithValue('Course ID is required');
      }

      // Fetch both questions and progress in parallel (matching website implementation)
      // Website uses:
      // - Questions: /courses/${courseId}/full_test_page/ (WITH trailing slash)
      // - Progress: /test_progress/${courseId}/latest-submitted-analytics/ (WITH trailing slash)
      const questionsEndpoint = typeof API_CONFIG.assessments.getTestAnalytics === 'function'
        ? API_CONFIG.assessments.getTestAnalytics(courseId)
        : `/courses/${courseId}/full_test_page/`; // ✅ Matches website
      
      const progressEndpoint = typeof API_CONFIG.assessments.getTestProgress === 'function'
        ? API_CONFIG.assessments.getTestProgress(courseId)
        : `/test_progress/${courseId}/latest-submitted-analytics/`; // ✅ Matches website

      console.log('🔵 ========================================');
      console.log('🔵 FETCH TEST ANALYTICS');
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
      console.log('📊 Questions Total:', questionsData?.total_questions);
      console.log('📊 Questions Count:', questionsData?.questions?.length);

      // Handle progress response (may return 404 if no analytics found)
      let progressData = null;
      if (progressResponse.ok) {
        const progressWrapper = await progressResponse.json();
        console.log('📊 Progress API Raw Response:', JSON.stringify(progressWrapper, null, 2));
        
        // Check if response contains "No analytics found" message (matching website)
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
        
        // Extract data from wrapper if it exists (website returns { data: {...} })
        // Website code: progressData = progressWrapper.data
        progressData = progressWrapper.data || progressWrapper;
        
        console.log('📊 Progress Data (extracted):', JSON.stringify(progressData, null, 2));
        console.log('📊 Progress - Correct Count:', progressData?.correct_count);
        console.log('📊 Progress - Attempted Questions:', progressData?.attempted_questions);
        console.log('📊 Progress - Flagged Count:', progressData?.flagged_count);
        console.log('📊 Progress - Skipped Count:', progressData?.skipped_count);
        console.log('📊 Progress - Is Submitted:', progressData?.is_submitted);
        console.log('📊 Progress - Questions Array Length:', progressData?.questions?.length);
      } else if (progressResponse.status === 404) {
        // No analytics found - return questions only
        console.log('⚠️ No test analytics found (404)');
        console.log('📊 Returning questions only, no progress data');
        return {
          questions: questionsData,
          progress: null,
          noAnalytics: true,
        };
      } else {
        console.error('❌ Progress API failed:', progressResponse.status, progressResponse.statusText);
        const errorText = await progressResponse.text();
        console.error('❌ Progress API Error Response:', errorText);
        return rejectWithValue(`Progress API failed: ${progressResponse.status}`);
      }

      const result = {
        questions: questionsData,
        progress: progressData,
        noAnalytics: false,
      };
      
      console.log('✅ ========================================');
      console.log('✅ TEST ANALYTICS FETCH SUCCESS');
      console.log('✅ ========================================');
      console.log('✅ Final Result:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
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
  },
  extraReducers: (builder) => {
    // Fetch Quiz Analytics
    builder
      .addCase(fetchQuizAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Test Analytics slice
const testAnalyticsSlice = createSlice({
  name: 'testAnalytics',
  initialState,
  reducers: {
    clearTestAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Test Analytics
    builder
      .addCase(fetchTestAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTestAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchTestAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuizAnalyticsError } = quizAnalyticsSlice.actions;
export const { clearTestAnalyticsError } = testAnalyticsSlice.actions;

// fetchQuizAnalytics and fetchTestAnalytics are already exported above as const exports
export default {
  quizAnalytics: quizAnalyticsSlice.reducer,
  testAnalytics: testAnalyticsSlice.reducer,
};
