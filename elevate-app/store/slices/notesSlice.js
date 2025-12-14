import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';

// Initial state
const initialState = {
  notes: [],
  isLoading: false,
  error: null,
  operationLoading: false,
};

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.notes.getAllNotes), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch notes');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async ({ noteData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.notes.createNote), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create note');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ noteId, noteData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.notes.updateNote(noteId)), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update note');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async ({ noteId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(buildURL(API_CONFIG.notes.deleteNote(noteId)), {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to delete note');
      }

      return noteId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Notes slice
const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notes
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Note
    builder
      .addCase(createNote.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.notes.unshift(action.payload);
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });

    // Update Note
    builder
      .addCase(updateNote.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });

    // Delete Note
    builder
      .addCase(deleteNote.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNotesError } = notesSlice.actions;
export default notesSlice.reducer;