import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  flashcards: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCourseFlashcards = createAsyncThunk(
  'flashcards/fetchCourseFlashcards',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.courses.getCourseFlashcards(courseId)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch course flashcards');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Flashcards slice
const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    clearFlashcardsError: (state) => {
      state.error = null;
    },
    clearFlashcards: (state) => {
      state.flashcards = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Course Flashcards
    builder
      .addCase(fetchCourseFlashcards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseFlashcards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flashcards = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseFlashcards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFlashcardsError, clearFlashcards } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;
