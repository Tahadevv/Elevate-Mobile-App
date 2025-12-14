import { useRouter } from 'expo-router';
import { MoreHorizontal, Plus, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../../components/theme-provider';
import API_CONFIG from '../../../config.api';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createNote, deleteNote, fetchNotes, updateNote } from '../../../store/slices/notesSlice';

// Type definitions
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

// Utility functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Format: "13rd, June"
  const day = date.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];

  // Add ordinal suffix
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  if (day === 2 || day === 22) suffix = "nd";
  if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix}, ${month}`;
}

export default function NotesScreen() {
  const dispatch = useAppDispatch();
  const { notes, isLoading, error, operationLoading } = useAppSelector((state: any) => state.notes);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  const colors = useColors();
  const router = useRouter();

  // Fetch notes from API
  useEffect(() => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    console.log('📝 Fetching notes with token:', authToken ? 'Token exists' : 'No token');
    dispatch(fetchNotes(authToken) as any);
  }, [token, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const filteredNotes = notes.filter(
    (note: Note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Navigate to the corresponding course page
    switch (tabName) {
      case 'course-details':
        router.push('/course/course-details');
        break;
      case 'notes':
        router.push('/course/notes');
        break;
      case 'tutorial':
        router.push('/course/tutorial');
        break;
      case 'result':
        router.push('/course/result');
        break;
      case 'assessment':
        router.push('/course/Information-Mock-Assessment');
        break;
    }
  };

  const handleAddNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "isEdited">) => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    try {
      console.log('📝 Creating note:', note);
       
      await dispatch(createNote({ noteData: note, token: authToken }) as any).unwrap();
      setIsModalOpen(false);
      setCurrentNote(null);
      Alert.alert('Success', 'Note created successfully!');
    } catch (error: any) {
      console.error('Error creating note:', error);
      Alert.alert('Error', error?.message || 'Failed to create note');
    }
  };

  const handleEditNote = async (note: Omit<Note, "createdAt" | "updatedAt" | "isEdited">) => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    try {
      console.log('📝 Updating note:', note);
       
      await dispatch(updateNote({ 
        noteId: note.id, 
        noteData: { title: note.title, content: note.content }, 
        token: authToken 
      }) as any).unwrap();
      setIsModalOpen(false);
      setCurrentNote(null);
      Alert.alert('Success', 'Note updated successfully!');
    } catch (error: any) {
      console.error('Error updating note:', error);
      Alert.alert('Error', error?.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    const authToken = token || API_CONFIG.FIXED_TOKEN;
    try {
      console.log('📝 Deleting note:', id);
       
      await dispatch(deleteNote({ noteId: id, token: authToken }) as any).unwrap();
      setShowDropdown(null);
      Alert.alert('Success', 'Note deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', error?.message || 'Failed to delete note');
    }
  };

  const openEditModal = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentNote(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const toggleDropdown = (noteId: string) => {
    setShowDropdown(showDropdown === noteId ? null : noteId);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      
      {/* Main Content */}
      <View style={[
        styles.mainContent,
        { marginLeft: sidebarOpen ? 300 : 0 }
      ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Course Notes
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Manage and organize your study notes
            </Text>
          </View>

          {/* Search and Add Section */}
          <View style={styles.searchSection}>
            {/* Full-width search bar */}
            <View style={styles.searchContainer}>
              <Search size={20} color={colors.muted} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { 
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.card
                }]}
                placeholder="search"
                placeholderTextColor={colors.muted}
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            </View>

            {/* Total Notes and Add Button - Same Line */}
            <View style={styles.actionsContainer}>
              <Text style={[styles.totalNotes, { color: colors.foreground }]}>
                Total Notes: <Text style={[styles.totalNotesBold, { color: colors.foreground }]}>{notes.length}</Text>
              </Text>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colors.yellow }]} 
                onPress={openAddModal}
              >
                <Plus size={20} color={colors.background} />
                <Text style={[styles.addButtonText, { color: colors.background }]}>Add Note</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes Grid */}
          <View style={styles.notesGrid}>
            {filteredNotes.map((note: Note) => (
              <View key={note.id} style={[styles.noteCard, { 
                backgroundColor: colors.card, 
                borderColor: colors.border 
              }]}>
                <View style={styles.noteHeader}>
                  <Text style={[styles.noteTitle, { color: colors.foreground }]}>
                    {note.title}
                  </Text>
                  <TouchableOpacity 
                    style={styles.dropdownTrigger}
                    onPress={() => toggleDropdown(note.id)}
                  >
                    <MoreHorizontal size={16} color={colors.foreground} />
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.noteContent, { color: colors.muted }]}>
                  {note.content}
                </Text>
                
                <View style={[styles.noteFooter, { borderTopColor: colors.border }]}>
                  <Text style={[styles.noteDate, { color: colors.muted }]}>
                    {note.isEdited ? "Edited" : "Created"} at {formatDate(note.updatedAt)}
                  </Text>
                </View>

                {/* Dropdown Menu */}
                {showDropdown === note.id && (
                  <View style={[styles.dropdownMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TouchableOpacity 
                      style={styles.dropdownItem}
                      onPress={() => {
                        openEditModal(note);
                        setShowDropdown(null);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.foreground }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.dropdownItem}
                      onPress={() => handleDeleteNote(note.id)}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.destructive }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Add/Edit Note Modal */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                {isEditing ? 'Edit Note' : 'Add New Note'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsModalOpen(false)}
              >
                <X size={20} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>Title</Text>
                <TextInput
                  style={[styles.textInput, { 
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.background
                  }]}
                  placeholder="Note title"
                  placeholderTextColor={colors.muted}
                  value={currentNote?.title || ''}
                  onChangeText={(text) => setCurrentNote(prev => prev ? { ...prev, title: text } : { id: '', title: text, content: '', createdAt: '', updatedAt: '', isEdited: false })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>Description</Text>
                <TextInput
                  style={[styles.textArea, { 
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.background
                  }]}
                  placeholder="Note content"
                  placeholderTextColor={colors.muted}
                  value={currentNote?.content || ''}
                  onChangeText={(text) => setCurrentNote(prev => prev ? { ...prev, content: text } : { id: '', title: '', content: text, createdAt: '', updatedAt: '', isEdited: false })}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, { backgroundColor: colors.yellow }]}
                onPress={() => {
                  if (currentNote && currentNote.title && currentNote.content) {
                    if (isEditing) {
                      handleEditNote(currentNote);
                    } else {
                      handleAddNote({ title: currentNote.title, content: currentNote.content });
                    }
                  }
                }}
              >
                <Text style={[styles.createButtonText, { color: colors.background }]}>
                  {isEditing ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  searchSection: {
    marginBottom: 32,
    gap: 16,
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '25%',
    
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  totalNotes: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalNotesBold: {
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesGrid: {
    gap: 16,
  },
  noteCard: {
    width: '100%',
    padding: 16,
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  dropdownTrigger: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 20,
  },
  noteFooter: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  noteDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 8,
    borderWidth: 1,
    borderRadius: 2,
    paddingVertical: 4,
    minWidth: 100,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    borderRadius: 2,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 16,
  },
  textArea: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
