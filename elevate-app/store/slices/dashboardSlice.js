import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  paidIndustries: [],
  unpaidIndustries: [],
  isLoading: false,
  isLoadingPaid: false,
  isLoadingUnpaid: false,
  error: null,
  paidError: null,
  unpaidError: null,
};

// Async thunks
export const fetchPaidIndustries = createAsyncThunk(
  'dashboard/fetchPaidIndustries',
  async (token, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.dashboard.getPaidIndustries);
      const headers = getAuthHeaders(token);
      
      console.log('========================================');
      console.log('🔵 FETCH PAID INDUSTRIES');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Headers:', headers);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log('Response Status:', response.status, response.statusText);
      console.log('Response OK:', response.ok);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('Response Data:', JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.log('❌ Failed to parse JSON response');
          const text = await response.text();
          console.log('Response Text:', text);
          return rejectWithValue('Invalid response format from server');
        }
      } else {
        const text = await response.text();
        console.log('Response Text (non-JSON):', text);
        try {
          data = JSON.parse(text);
        } catch (_parseError) {
          return rejectWithValue(text || 'Invalid response from server');
        }
      }

      console.log('========================================');

      if (!response.ok) {
        console.log('❌ FETCH PAID INDUSTRIES FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Full Error Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        let errorMessage = 'Failed to fetch paid industries';
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        return rejectWithValue(errorMessage);
      }

      console.log('✅ FETCH PAID INDUSTRIES SUCCESS');
      console.log('Data Count:', Array.isArray(data) ? data.length : 'Not an array');
      console.log('========================================');

      return data;
    } catch (error) {
      console.log('========================================');
      console.log('❌ FETCH PAID INDUSTRIES NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchUnpaidIndustries = createAsyncThunk(
  'dashboard/fetchUnpaidIndustries',
  async (token, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.dashboard.getUnpaidIndustries);
      const headers = getAuthHeaders(token);
      
      console.log('========================================');
      console.log('🔵 FETCH UNPAID INDUSTRIES');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Headers:', headers);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      console.log('Response Status:', response.status, response.statusText);
      console.log('Response OK:', response.ok);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('Response Data:', JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.log('❌ Failed to parse JSON response');
          const text = await response.text();
          console.log('Response Text:', text);
          return rejectWithValue('Invalid response format from server');
        }
      } else {
        const text = await response.text();
        console.log('Response Text (non-JSON):', text);
        try {
          data = JSON.parse(text);
        } catch (_parseError) {
          return rejectWithValue(text || 'Invalid response from server');
        }
      }

      console.log('========================================');

      if (!response.ok) {
        console.log('❌ FETCH UNPAID INDUSTRIES FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Full Error Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        let errorMessage = 'Failed to fetch unpaid industries';
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        return rejectWithValue(errorMessage);
      }

      console.log('✅ FETCH UNPAID INDUSTRIES SUCCESS');
      console.log('Data Count:', Array.isArray(data) ? data.length : 'Not an array');
      console.log('========================================');

      return data;
    } catch (error) {
      console.log('========================================');
      console.log('❌ FETCH UNPAID INDUSTRIES NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Paid Industries
    builder
      .addCase(fetchPaidIndustries.pending, (state) => {
        state.isLoading = true;
        state.isLoadingPaid = true;
        state.paidError = null;
        state.error = null;
      })
      .addCase(fetchPaidIndustries.fulfilled, (state, action) => {
        state.isLoadingPaid = false;
        state.paidIndustries = action.payload || [];
        state.paidError = null;
        // Only set isLoading to false if unpaid is also not loading
        if (!state.isLoadingUnpaid) {
          state.isLoading = false;
        }
        state.error = null;
      })
      .addCase(fetchPaidIndustries.rejected, (state, action) => {
        state.isLoadingPaid = false;
        state.paidError = action.payload;
        // Only set isLoading to false if unpaid is also not loading
        if (!state.isLoadingUnpaid) {
          state.isLoading = false;
        }
        state.error = action.payload;
      });

    // Fetch Unpaid Industries
    builder
      .addCase(fetchUnpaidIndustries.pending, (state) => {
        state.isLoading = true;
        state.isLoadingUnpaid = true;
        state.unpaidError = null;
        state.error = null;
      })
      .addCase(fetchUnpaidIndustries.fulfilled, (state, action) => {
        state.isLoadingUnpaid = false;
        state.unpaidIndustries = action.payload || [];
        state.unpaidError = null;
        // Only set isLoading to false if paid is also not loading
        if (!state.isLoadingPaid) {
          state.isLoading = false;
        }
        state.error = null;
      })
      .addCase(fetchUnpaidIndustries.rejected, (state, action) => {
        state.isLoadingUnpaid = false;
        state.unpaidError = action.payload;
        // Only set isLoading to false if paid is also not loading
        if (!state.isLoadingPaid) {
          state.isLoading = false;
        }
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

