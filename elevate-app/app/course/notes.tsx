import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../components/theme-provider';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createNote, deleteNote, fetchNotes, updateNote } from '../../store/slices/notesSlice';

const { width } = Dimensions.get('window');

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
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  // Add ordinal suffix
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  if (day === 2 || day === 22) suffix = "nd";
  if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix}, ${month}`;
}

// Note Modal Component
interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "isEdited">) => void;
  note: Note | null;
  isEditing: boolean;
}

function NoteModal({ isOpen, onClose, onSave, note, isEditing }: NoteModalProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const colors = useColors();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
    });

    setTitle('');
    setContent('');
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {isEditing ? 'Edit Note' : 'Add Note'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.titleInput, { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              color: colors.foreground 
            }]}
            placeholder="Note title"
            placeholderTextColor={colors.muted}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.contentInput, { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              color: colors.foreground 
            }]}
            placeholder="Note content"
            placeholderTextColor={colors.muted}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.yellow }]}
              onPress={handleSave}
            >
              <Text style={[styles.saveButtonText, { color: colors.background }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Main Notes Component
export default function NotesApp() {
  const dispatch = useAppDispatch();
  const { notes, isLoading, error, operationLoading } = useAppSelector((state: any) => state.notes);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const colors = useColors();

  // Fetch notes from API
  useEffect(() => {
    if (token) {
      dispatch(fetchNotes(token) as any);
    }
  }, [token, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "isEdited">) => {
    if (token) {
      try {
        await dispatch(createNote({ noteData: note, token }) as any).unwrap();
        setIsModalOpen(false);
        Alert.alert('Success', 'Note created successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to create note');
      }
    }
  };

  const handleEditNote = async (note: Omit<Note, "createdAt" | "updatedAt" | "isEdited">) => {
    if (token) {
      try {
        await dispatch(updateNote({ 
          noteId: note.id, 
          noteData: { title: note.title, content: note.content }, 
          token 
        }) as any).unwrap();
        setIsModalOpen(false);
        Alert.alert('Success', 'Note updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update note');
      }
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            if (token) {
              try {
                await dispatch(deleteNote({ noteId: id, token }) as any).unwrap();
                Alert.alert('Success', 'Note deleted successfully!');
              } catch (error) {
                Alert.alert('Error', 'Failed to delete note');
              }
            }
          }
        },
      ]
    );
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons 
                name="search" 
                size={20} 
                color={colors.muted} 
                style={styles.searchIcon} 
              />
              <TextInput
                style={[styles.searchInput, { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.foreground 
                }]}
                placeholder="Search notes..."
                placeholderTextColor={colors.muted}
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            </View>

            <View style={styles.headerRight}>
              <Text style={[styles.totalNotes, { color: colors.foreground }]}>
                Total Notes: <Text style={styles.totalCount}>{notes.length}</Text>
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.yellow }]}
                onPress={openAddModal}
              >
                <Text style={[styles.addButtonText, { color: colors.background }]}>+ Add Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notes Grid */}
        <View style={styles.notesGrid}>
          {filteredNotes.map((note) => (
            <View key={note.id} style={[styles.noteCard, { 
              backgroundColor: colors.card, 
              borderColor: colors.border 
            }]}>
              <View style={styles.noteHeader}>
                <Text style={[styles.noteTitle, { color: colors.foreground }]} numberOfLines={1}>
                  {note.title}
                </Text>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => {
                    Alert.alert(
                      'Note Options',
                      'Choose an action',
                      [
                        { text: 'Edit', onPress: () => openEditModal(note) },
                        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteNote(note.id) },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    );
                  }}
                >
                  <Ionicons name="ellipsis-horizontal" size={16} color={colors.foreground} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.noteContent, { color: colors.muted }]} numberOfLines={3}>
                {note.content}
              </Text>
              
              <View style={[styles.noteFooter, { borderTopColor: colors.border }]}>
                <Text style={[styles.noteDate, { color: colors.muted }]}>
                  {note.isEdited ? "Edited" : "Created"} at {formatDate(note.updatedAt)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={isEditing ? handleEditNote : handleAddNote}
        note={currentNote}
        isEditing={isEditing}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  searchSection: {
    gap: 16,
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalNotes: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalCount: {
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  notesGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  noteCard: {
    width: (width - 48) / 2,
    borderWidth: 1,
    borderRadius: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
  noteContent: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 18,
  },
  noteFooter: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  noteDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    maxHeight: '80%',
    borderRadius: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 2,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 2,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    height: 120,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 2,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
