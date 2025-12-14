import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  announcements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGeneralAnnouncements = createAsyncThunk(
  'announcements/fetchGeneralAnnouncements',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.announcements.getGeneralAnnouncements), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch announcements');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// General Announcements slice
const generalAnnouncementsSlice = createSlice({
  name: 'generalAnnouncements',
  initialState,
  reducers: {
    clearAnnouncementsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch General Announcements
    builder
      .addCase(fetchGeneralAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload;
        state.error = null;
      })
      .addCase(fetchGeneralAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnnouncementsError } = generalAnnouncementsSlice.actions;
export default generalAnnouncementsSlice.reducer;

