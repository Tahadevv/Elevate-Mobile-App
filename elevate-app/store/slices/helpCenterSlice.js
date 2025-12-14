import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL } from '../../config.api';

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  isSubmitted: false,
};

// Async thunks
export const submitHelpRequest = createAsyncThunk(
  'helpCenter/submitHelpRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.helpCenter.submitHelpRequest), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to submit help request');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Help Center slice
const helpCenterSlice = createSlice({
  name: 'helpCenter',
  initialState,
  reducers: {
    clearHelpCenterError: (state) => {
      state.error = null;
    },
    resetSubmission: (state) => {
      state.isSubmitted = false;
    },
  },
  extraReducers: (builder) => {
    // Submit Help Request
    builder
      .addCase(submitHelpRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitHelpRequest.fulfilled, (state) => {
        state.isLoading = false;
        state.isSubmitted = true;
        state.error = null;
      })
      .addCase(submitHelpRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHelpCenterError, resetSubmission } = helpCenterSlice.actions;
export default helpCenterSlice.reducer;
