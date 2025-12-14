// Type definitions for Redux state

export interface User {
  id: number;
  name: string;
  email: string;
  description?: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  description: string;
  password?: string;
}

export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface SubTopic {
  id: number;
  name: string;
}

export interface Chapter {
  id: number;
  name: string;
  subtopics: SubTopic[];
}

export interface Announcement {
  id: number;
  primary_text: string;
  secondary_text: string;
  created_at: string;
}

export interface CourseDetails {
  id: number;
  name: string;
  about_primary: string;
  about_secondary: string;
  total_questions: number;
  total_chapters: number;
  announcements: Announcement[];
  chapters: Chapter[];
}

export interface Course {
  id: number;
  name: string;
}

export interface Domain {
  id: number;
  name: string;
  courses: Course[];
}

export interface CoursesState {
  domains: Domain[];
  currentCourse: CourseDetails | null;
  isLoading: boolean;
  error: string | null;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  user: UserState;
  courses: CoursesState;
  notes: NotesState;
}

