import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  quizData: null,
  isLoading: false,
  error: null,
  currentQuestionIndex: 0,
  answers: [],
  score: null,
  isCompleted: false,
};

// Async thunks
export const fetchPracticeQuiz = createAsyncThunk(
  'practiceQuiz/fetchPracticeQuiz',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      if (!courseId) {
        return rejectWithValue('Course ID is required');
      }

      // Use the correct API endpoint matching website: /courses/{courseId}/question_page/
      const endpoint = typeof API_CONFIG.assessments.getPracticeQuiz === 'function' 
        ? API_CONFIG.assessments.getPracticeQuiz(courseId)
        : `/courses/${courseId}/question_page/`;

      const response = await fetch(buildURL(endpoint), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || data.detail || 'Failed to fetch practice quiz');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const submitQuizAnswer = createAsyncThunk(
  'practiceQuiz/submitQuizAnswer',
  async ({ questionId, answer, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL('/quiz/submit-answer/'), {
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

export const submitQuizResults = createAsyncThunk(
  'practiceQuiz/submitQuizResults',
  async ({ answers, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL('/quiz/submit-results/'), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to submit quiz results');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Practice Quiz slice
const practiceQuizSlice = createSlice({
  name: 'practiceQuiz',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.score = null;
      state.isCompleted = false;
    },
    clearPracticeQuizError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Practice Quiz
    builder
      .addCase(fetchPracticeQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPracticeQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizData = action.payload;
        state.error = null;
      })
      .addCase(fetchPracticeQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit Quiz Answer
      .addCase(submitQuizAnswer.fulfilled, (state, action) => {
        // Handle individual answer submission if needed
      })
      // Submit Quiz Results
      .addCase(submitQuizResults.fulfilled, (state, action) => {
        state.score = action.payload.score;
        state.isCompleted = true;
      });
  },
});

export const { setCurrentQuestion, setAnswer, resetQuiz, clearPracticeQuizError } = practiceQuizSlice.actions;
export default practiceQuizSlice.reducer;
