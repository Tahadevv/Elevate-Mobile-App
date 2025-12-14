import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const url = buildURL(API_CONFIG.auth.login);
      
      console.log('========================================');
      console.log('🔵 LOGIN API CALL');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Method: POST');
      console.log('Request Body (masked):', JSON.stringify({ email, password: '***' }, null, 2));
      console.log('Request Body (ACTUAL - FOR DEBUGGING):', JSON.stringify({ email, password }, null, 2));
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Password Length:', password ? password.length : 0);
      console.log('Headers:', {
        'Content-Type': 'application/json',
      });
      console.log('========================================');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('========================================');
      console.log('📥 LOGIN API RESPONSE');
      console.log('========================================');
      console.log('Status:', response.status, response.statusText);
      console.log('Status OK:', response.ok);
      console.log('Content-Type:', response.headers.get('content-type'));
      console.log('========================================');

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('Response Data (JSON):', JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.log('❌ Failed to parse JSON response');
          console.log('JSON Error:', jsonError);
          const text = await response.text();
          console.log('Response Text:', text);
          return rejectWithValue('Invalid response format from server');
        }
      } else {
        const text = await response.text();
        console.log('Response Text (non-JSON):', text);
        try {
          data = JSON.parse(text);
          console.log('Parsed Data:', JSON.stringify(data, null, 2));
        } catch (_parseError) {
          console.log('❌ Failed to parse response as JSON');
          return rejectWithValue(text || 'Invalid response from server');
        }
      }
      
      console.log('========================================');

      if (!response.ok) {
        console.log('❌ LOGIN FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Non Field Errors:', data.non_field_errors);
        console.log('Full Error Data:', JSON.stringify(data, null, 2));
        console.log('========================================');
        
        // Handle different error formats
        let errorMessage = 'Login failed';
        if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
          errorMessage = data.non_field_errors[0];
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        
        console.log('Extracted Error Message:', errorMessage);
        console.log('========================================');
        return rejectWithValue(errorMessage);
      }

      console.log('✅ LOGIN SUCCESS');
      console.log('Full Response Data:', JSON.stringify(data, null, 2));
      console.log('Auth Token Key:', data.auth_token ? 'auth_token exists' : 'auth_token missing');
      console.log('Auth Token Value:', data.auth_token || 'N/A');
      console.log('Token Key:', data.token ? 'token exists' : 'token missing');
      console.log('Token Value:', data.token || 'N/A');
      console.log('All Keys:', Object.keys(data));
      console.log('User Data:', data.user);
      console.log('========================================');

      // API might return auth_token or token, check both
      const token = data.auth_token || data.token;
      
      if (!token) {
        console.log('❌ No token found in response');
        console.log('Available keys:', Object.keys(data));
        return rejectWithValue('No authentication token received');
      }

      console.log('✅ Token extracted successfully');
      console.log('Token:', token.substring(0, 20) + '...');
      console.log('========================================');

      return {
        token: token,
        user: data.user || { email },
      };
    } catch (error) {
      console.log('========================================');
      console.log('❌ LOGIN NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, name, description, password }, { rejectWithValue }) => {
    try {
      // Build request body - include password if provided
      const requestBody = { email, name, description };
      if (password) {
        requestBody.password = password;
      }

      const url = buildURL(API_CONFIG.auth.signup);
      
      console.log('========================================');
      console.log('🔵 SIGNUP API CALL');
      console.log('========================================');
      console.log('URL:', url);
      console.log('Method: POST');
      console.log('Request Body (masked):', JSON.stringify({ ...requestBody, password: password ? '***' : undefined }, null, 2));
      console.log('Request Body (ACTUAL - FOR DEBUGGING):', JSON.stringify(requestBody, null, 2));
      console.log('Password Value:', password || 'NO PASSWORD');
      console.log('Password Length:', password ? password.length : 0);
      console.log('Headers:', {
        'Content-Type': 'application/json',
      });
      console.log('========================================');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('========================================');
      console.log('📥 SIGNUP API RESPONSE');
      console.log('========================================');
      console.log('Status:', response.status, response.statusText);
      console.log('Status OK:', response.ok);
      console.log('========================================');

      const data = await response.json();
      
      console.log('Response Data:', JSON.stringify(data, null, 2));
      console.log('========================================');

      if (!response.ok) {
        console.log('❌ SIGNUP FAILED');
        console.log('Error Detail:', data.detail);
        console.log('Error Message:', data.error);
        console.log('Full Error Data:', data);
        console.log('========================================');
        return rejectWithValue(data.detail || data.error || data.message || 'Signup failed');
      }

      console.log('✅ SIGNUP SUCCESS');
      console.log('Response:', data);
      console.log('========================================');
      return data;
    } catch (error) {
      console.log('========================================');
      console.log('❌ SIGNUP NETWORK ERROR');
      console.log('========================================');
      console.log('Error Message:', error.message);
      console.log('Error Stack:', error.stack);
      console.log('Full Error:', error);
      console.log('========================================');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otp, email }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.auth.signupVerify), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ otp, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'OTP verification failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear any stored data if needed
  return null;
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      if (typeof action.payload === 'string') {
        // Backward compatibility: if payload is just a string (token)
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      } else if (action.payload && typeof action.payload === 'object') {
        // New format: { token, user }
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;

