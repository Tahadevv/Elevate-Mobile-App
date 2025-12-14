import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  courseDetails: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCourseDetails = createAsyncThunk(
  'courseDetails/fetchCourseDetails',
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.courses.getCourseDetails(courseId)), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch course details');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Course Details slice
const courseDetailsSlice = createSlice({
  name: 'courseDetails',
  initialState,
  reducers: {
    clearCourseDetailsError: (state) => {
      state.error = null;
    },
    clearCourseDetails: (state) => {
      state.courseDetails = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Course Details
    builder
      .addCase(fetchCourseDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourseDetailsError, clearCourseDetails } = courseDetailsSlice.actions;
export default courseDetailsSlice.reducer;
