import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  assessmentData: null,
  isLoading: false,
  error: null,
  currentChapterIndex: 0,
  currentQuestionIndex: 0,
  answers: [],
  score: null,
  isCompleted: false,
  chapterProgress: [],
};

// Async thunks
export const fetchMockAssessment = createAsyncThunk(
  'mockAssessment/fetchMockAssessment',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.assessments.getMockAssessment), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch mock assessment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const submitAssessmentAnswer = createAsyncThunk(
  'mockAssessment/submitAssessmentAnswer',
  async ({ questionId, answer, chapterIndex, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL('/assessment/submit-answer/'), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ questionId, answer, chapterIndex }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to submit answer');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const submitAssessmentResults = createAsyncThunk(
  'mockAssessment/submitAssessmentResults',
  async ({ answers, chapterProgress, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL('/assessment/submit-results/'), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ answers, chapterProgress }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to submit assessment results');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Mock Assessment slice
const mockAssessmentSlice = createSlice({
  name: 'mockAssessment',
  initialState,
  reducers: {
    setCurrentChapter: (state, action) => {
      state.currentChapterIndex = action.payload;
      state.currentQuestionIndex = 0; // Reset question index when changing chapters
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { chapterIndex, questionIndex, answer } = action.payload;
      if (!state.answers[chapterIndex]) {
        state.answers[chapterIndex] = [];
      }
      state.answers[chapterIndex][questionIndex] = answer;
    },
    updateChapterProgress: (state, action) => {
      const { chapterIndex, progress } = action.payload;
      state.chapterProgress[chapterIndex] = progress;
    },
    resetAssessment: (state) => {
      state.currentChapterIndex = 0;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.score = null;
      state.isCompleted = false;
      state.chapterProgress = [];
    },
    clearMockAssessmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Mock Assessment
    builder
      .addCase(fetchMockAssessment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMockAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessmentData = action.payload;
        state.chapterProgress = action.payload.chapters?.map(() => 0) || [];
        state.error = null;
      })
      .addCase(fetchMockAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit Assessment Answer
      .addCase(submitAssessmentAnswer.fulfilled, (state, action) => {
        // Handle individual answer submission if needed
      })
      // Submit Assessment Results
      .addCase(submitAssessmentResults.fulfilled, (state, action) => {
        state.score = action.payload.score;
        state.isCompleted = true;
      });
  },
});

export const { 
  setCurrentChapter, 
  setCurrentQuestion, 
  setAnswer, 
  updateChapterProgress, 
  resetAssessment, 
  clearMockAssessmentError 
} = mockAssessmentSlice.actions;
export default mockAssessmentSlice.reducer;
