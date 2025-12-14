import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

// Import reducers
import analyticsReducer from './slices/analyticsSlice';
import authReducer from './slices/authSlice';
import courseDetailsReducer from './slices/courseDetailsSlice';
import coursesReducer from './slices/coursesSlice';
import dashboardReducer from './slices/dashboardSlice';
import eventsReducer from './slices/eventsSlice';
import flashcardsReducer from './slices/flashcardsSlice';
import generalAnnouncementsReducer from './slices/generalAnnouncementsSlice';
import helpCenterReducer from './slices/helpCenterSlice';
import mockAssessmentReducer from './slices/mockAssessmentSlice';
import mockExamReducer from './slices/mockExamSlice';
import notesReducer from './slices/notesSlice';
import practiceQuizReducer from './slices/practiceQuizSlice';
import userReducer from './slices/userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // Only persist auth and user state
  blacklist: [], // Add slices you don't want to persist
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  courses: coursesReducer,
  courseDetails: courseDetailsReducer,
  dashboard: dashboardReducer,
  events: eventsReducer,
  flashcards: flashcardsReducer,
  notes: notesReducer,
  generalAnnouncements: generalAnnouncementsReducer,
  helpCenter: helpCenterReducer,
  practiceQuiz: practiceQuizReducer,
  mockExam: mockExamReducer,
  mockAssessment: mockAssessmentReducer,
  ...analyticsReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

