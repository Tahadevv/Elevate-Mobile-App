import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  events: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (token, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.events.getAllEvents);
      const headers = getAuthHeaders(token);
      
      console.log('========================================');
      console.log('🔵 FETCH EVENTS');
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
        console.log('❌ FETCH EVENTS FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Full Error Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        let errorMessage = 'Failed to fetch events';
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

      console.log('✅ FETCH EVENTS SUCCESS');
      console.log('Data Count:', Array.isArray(data) ? data.length : 'Not an array');
      console.log('========================================');

      return data || [];
    } catch (error) {
      console.log('========================================');
      console.log('❌ FETCH EVENTS NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async ({ token, title, event_date, description }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.events.createEvent);
      const headers = getAuthHeaders(token);
      
      console.log('========================================');
      console.log('🔵 CREATE EVENT');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Method: POST');
      console.log('Request Body:', JSON.stringify({ title, event_date, description }, null, 2));
      console.log('Headers:', headers);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          title,
          event_date,
          description: description || undefined,
        }),
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
        console.log('❌ CREATE EVENT FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Full Error Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        let errorMessage = 'Failed to create event';
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

      console.log('✅ CREATE EVENT SUCCESS');
      console.log('Created Event:', JSON.stringify(data, null, 2));
      console.log('========================================');

      return data;
    } catch (error) {
      console.log('========================================');
      console.log('❌ CREATE EVENT NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ token, eventId, title, event_date, description }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.events.updateEvent(eventId));
      const headers = getAuthHeaders(token);
      
      console.log('========================================');
      console.log('🔵 UPDATE EVENT');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Method: PUT');
      console.log('Request Body:', JSON.stringify({ title, event_date, description }, null, 2));
      console.log('Headers:', headers);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          title,
          event_date,
          description: description || undefined,
        }),
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
        console.log('❌ UPDATE EVENT FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Full Error Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        let errorMessage = 'Failed to update event';
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

      console.log('✅ UPDATE EVENT SUCCESS');
      console.log('Updated Event:', JSON.stringify(data, null, 2));
      console.log('========================================');

      return { eventId, data };
    } catch (error) {
      console.log('========================================');
      console.log('❌ UPDATE EVENT NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async ({ token, eventId }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.events.deleteEvent(eventId));
      const headers = getAuthHeaders(token);
      
      console.log('========================================');
      console.log('🔵 DELETE EVENT');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Method: DELETE');
      console.log('Event ID:', eventId);
      console.log('Headers:', headers);
      console.log('========================================');

      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
      });

      console.log('Response Status:', response.status, response.statusText);
      console.log('Response OK:', response.ok);
      console.log('========================================');

      if (!response.ok) {
        let errorMessage = 'Failed to delete event';
        try {
          const data = await response.json();
          if (data.detail) {
            errorMessage = data.detail;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.message) {
            errorMessage = data.message;
          }
        } catch (_parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || 'Failed to delete event';
        }
        
        console.log('❌ DELETE EVENT FAILED');
        console.log('Error Message:', errorMessage);
        console.log('========================================');
        return rejectWithValue(errorMessage);
      }

      console.log('✅ DELETE EVENT SUCCESS');
      console.log('========================================');

      return eventId;
    } catch (error) {
      console.log('========================================');
      console.log('❌ DELETE EVENT NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Events slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload || [];
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Event
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = [...state.events, action.payload];
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = state.events.map((event) =>
          event.id === action.payload.eventId
            ? { ...event, ...action.payload.data }
            : event
        );
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete Event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = state.events.filter((event) => event.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = eventsSlice.actions;
export default eventsSlice.reducer;

