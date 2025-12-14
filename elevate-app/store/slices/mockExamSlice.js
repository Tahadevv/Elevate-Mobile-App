import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  testData: null,
  isLoading: false,
  error: null,
  currentQuestionIndex: 0,
  answers: [],
  score: null,
  isCompleted: false,
  timeRemaining: null,
};

// Async thunks
export const fetchMockExam = createAsyncThunk(
  'mockExam/fetchMockExam',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.assessments.getMockExam), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch mock exam');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const submitTestAnswer = createAsyncThunk(
  'mockExam/submitTestAnswer',
  async ({ questionId, answer, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL('/test/submit-answer/'), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ questionId, answer }),
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

export const submitTestResults = createAsyncThunk(
  'mockExam/submitTestResults',
  async ({ answers, timeSpent, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL('/test/submit-results/'), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ answers, timeSpent }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to submit test results');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Mock Exam slice
const mockExamSlice = createSlice({
  name: 'mockExam',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    resetTest: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.score = null;
      state.isCompleted = false;
      state.timeRemaining = null;
    },
    clearMockExamError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Mock Exam
    builder
      .addCase(fetchMockExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMockExam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.testData = action.payload;
        state.timeRemaining = action.payload.duration || 3600; // Default 1 hour
        state.error = null;
      })
      .addCase(fetchMockExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit Test Answer
      .addCase(submitTestAnswer.fulfilled, (state, action) => {
        // Handle individual answer submission if needed
      })
      // Submit Test Results
      .addCase(submitTestResults.fulfilled, (state, action) => {
        state.score = action.payload.score;
        state.isCompleted = true;
      });
  },
});

export const { setCurrentQuestion, setAnswer, setTimeRemaining, resetTest, clearMockExamError } = mockExamSlice.actions;
export default mockExamSlice.reducer;
