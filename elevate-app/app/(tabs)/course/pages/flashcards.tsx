import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Star
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../../../components/theme-provider';
import { PremiumLoader } from '../../../../components/ui/premium-loader';
import API_CONFIG from '../../../../config.api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchCourseFlashcards } from '../../../../store/slices/flashcardsSlice';

interface Flashcard {
  id?: number;
  question: string;
  answer: string;
  is_favorite?: boolean;
}

interface Subchapter {
  subchapterName: string;
  flashcards: Flashcard[];
}

interface Chapter {
  chapterName: string;
  subchapters: Subchapter[];
}

interface Course {
  courseName: string;
  chapters: Chapter[];
}

interface Progress {
  overall: number;
  chapters: number[];
}

export default function FlashcardsScreen() {
  const dispatch = useAppDispatch();
  const { flashcards, isLoading, error } = useAppSelector((state: any) => state.flashcards);
  const { token } = useAppSelector((state: any) => state.auth);
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSubchapterIndex, setCurrentSubchapterIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  // Store favorite record IDs for DELETE operations (if needed)
  const [favoriteRecordIds, setFavoriteRecordIds] = useState<Record<string, number>>({});
  const [completedCards, setCompletedCards] = useState<boolean[][][]>([]);
  const [isChanging, setIsChanging] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const colors = useColors();
  const router = useRouter();

  // Get course ID from navigation params
  const localParams = useLocalSearchParams<{ courseId?: string }>();
  // Also try to get from Redux courseDetails as fallback
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  // Use courseId from params, or from courseDetails, or undefined
  const courseId = localParams.courseId || courseDetails?.id?.toString();

  // Fetch flashcards from API
  useEffect(() => {
    if (courseId) {
      console.log('🔖 Fetching flashcards for course ID:', courseId);
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      // @ts-ignore - dispatch type issue
      dispatch(fetchCourseFlashcards({ courseId, token: authToken }) as any);
      // Fetch favorites for this course
      fetchFavorites(courseId, authToken);
    } else {
      console.warn('⚠️ Missing courseId for flashcards:', { localParams, courseDetailsId: courseDetails?.id });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Fetch favorites for the course
  const fetchFavorites = async (courseId: string, authToken: string) => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.favorites.getFavorites(courseId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const favoritesData = await response.json();
        console.log('⭐ Favorites fetched:', favoritesData);
        
        // Map favorites to flashcard IDs
        // API response structure: { id: favorite_record_id, flashcard: flashcard_id } or { flashcard: flashcard_id }
        const favoriteMap: Record<string, boolean> = {};
        const recordIdMap: Record<string, number> = {};
        if (Array.isArray(favoritesData)) {
          favoritesData.forEach((favorite: any) => {
            // Check for flashcard ID in different possible fields
            const flashcardId = favorite.flashcard?.toString() || 
                               favorite.flashcard_id?.toString() || 
                               favorite.id?.toString();
            
            if (flashcardId) {
              favoriteMap[flashcardId] = true;
              // Store the favorite record id if available
              if (favorite.id && favorite.flashcard) {
                recordIdMap[flashcardId] = favorite.id;
              }
            }
          });
        }
        console.log('⭐ Favorites map:', favoriteMap);
        setFavorited(favoriteMap);
        setFavoriteRecordIds(recordIdMap);
      } else {
        console.warn('⚠️ Failed to fetch favorites:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
    }
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Convert API data to component format with null checks - memoized to prevent infinite loops
  const course: Course = React.useMemo(() => {
    if (!flashcards) {
      return {
        courseName: "No Flashcards",
        chapters: []
      };
    }
    return {
      courseName: flashcards.name || "Course Flashcards",
      chapters: (flashcards.chapters || [])
        .filter((chapter: any) => chapter && chapter.name) // Filter out invalid chapters
        .map((chapter: any) => ({
          chapterName: chapter.name || 'Unknown Chapter',
          subchapters: (chapter.subtopics || [])
            .filter((subtopic: any) => subtopic && subtopic.name) // Filter out invalid subtopics
            .map((subtopic: any) => ({
              subchapterName: subtopic.name || 'Unknown Subchapter',
              flashcards: (subtopic.flashcards || [])
                .filter((flashcard: any) => flashcard && (flashcard.primary_text || flashcard.question)) // Filter out invalid flashcards
                .map((flashcard: any) => ({
                  id: flashcard.id,
                  question: flashcard.primary_text || flashcard.question || 'No question available',
                  answer: flashcard.secondary_text || flashcard.answer || 'No answer available',
                  is_favorite: flashcard.is_favorite || false
                }))
            }))
            .filter((subchapter: any) => subchapter.flashcards.length > 0) // Only include subchapters with flashcards
        }))
        .filter((chapter: any) => chapter.subchapters.length > 0) // Only include chapters with subchapters
    };
  }, [flashcards]);
  
  console.log('🔖 Flashcards data:', flashcards);
  console.log('🔖 Course data:', course);

  // Initialize state arrays
  useEffect(() => {
    if (course.chapters && course.chapters.length > 0) {
      const newCompletedCards = course.chapters.map(chapter =>
        chapter.subchapters.map(subchapter =>
          Array(subchapter.flashcards.length).fill(false)
        )
      );
      setCompletedCards(newCompletedCards);
    }
  }, [course.chapters.length]);

  // Filter flashcards to show only favorites if enabled
  const filteredCourse: Course = showOnlyFavorites ? {
    ...course,
    chapters: course.chapters.map((chapter) => ({
      ...chapter,
      subchapters: chapter.subchapters.map((subchapter) => ({
        ...subchapter,
        flashcards: subchapter.flashcards.filter((flashcard) => {
          const flashcardId = flashcard.id?.toString();
          return flashcardId && (favorited[flashcardId] || flashcard.is_favorite);
        })
      })).filter((subchapter) => subchapter.flashcards.length > 0)
    })).filter((chapter) => chapter.subchapters.length > 0)
  } : course;

  // Current data - with safety checks (use filtered course)
  const currentChapter = filteredCourse.chapters?.[currentChapterIndex];
  const currentSubchapter = currentChapter?.subchapters?.[currentSubchapterIndex];
  const currentFlashcard = currentSubchapter?.flashcards?.[currentCardIndex];

  // Calculate total flashcards (use filtered course)
  const totalFlashcards = filteredCourse.chapters.reduce(
    (sum: number, chapter: any) => sum + chapter.subchapters.reduce((subSum: number, subchapter: any) => subSum + subchapter.flashcards.length, 0),
    0
  );

  // Calculate progress (use filtered course)
  const progress: Progress = {
    overall: completedCards.flat(2).filter(Boolean).length / totalFlashcards * 100,
    chapters: filteredCourse.chapters.map((chapter: any, chapterIdx: number) => {
      const totalChapterCards = chapter.subchapters.reduce(
        (sum: number, subchapter: any) => sum + subchapter.flashcards.length,
        0
      );
      const completedChapterCards = completedCards[chapterIdx]?.flat().filter(Boolean).length || 0;
      return (completedChapterCards / totalChapterCards) * 100;
    }),
  };

  // Get current card number (use filtered course)
  const getCurrentCardNumber = () => {
    if (!filteredCourse.chapters || filteredCourse.chapters.length === 0) return 0;
    let cardNumber = 1;
    for (let i = 0; i < currentChapterIndex; i++) {
      const chapter = filteredCourse.chapters[i];
      if (chapter?.subchapters) {
        for (let j = 0; j < chapter.subchapters.length; j++) {
          cardNumber += chapter.subchapters[j]?.flashcards?.length || 0;
        }
      }
    }
    if (currentChapter?.subchapters) {
      for (let j = 0; j < currentSubchapterIndex; j++) {
        cardNumber += currentChapter.subchapters[j]?.flashcards?.length || 0;
      }
    }
    cardNumber += currentCardIndex;
    return cardNumber;
  };

  // Handle toggle show only favorites
  const handleToggleFavorites = () => {
    const newShowOnlyFavorites = !showOnlyFavorites;
    
    // Create filtered course first to check if there are favorites
    const tempFilteredCourse: Course = newShowOnlyFavorites ? {
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        subchapters: chapter.subchapters.map((subchapter) => ({
          ...subchapter,
          flashcards: subchapter.flashcards.filter((flashcard) => {
            const flashcardId = flashcard.id?.toString();
            return flashcardId && (favorited[flashcardId] || flashcard.is_favorite);
          })
        })).filter((subchapter) => subchapter.flashcards.length > 0)
      })).filter((chapter) => chapter.subchapters.length > 0)
    } : course;
    
    setShowOnlyFavorites(newShowOnlyFavorites);
    
    // Reset to first card when toggling filter
    if (newShowOnlyFavorites) {
      // Find first favorite flashcard
      let found = false;
      for (let c = 0; c < tempFilteredCourse.chapters.length; c++) {
        const chapter = tempFilteredCourse.chapters[c];
        for (let s = 0; s < chapter.subchapters.length; s++) {
          const subchapter = chapter.subchapters[s];
          if (subchapter.flashcards.length > 0) {
            setCurrentChapterIndex(c);
            setCurrentSubchapterIndex(s);
            setCurrentCardIndex(0);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      
      // If no favorites found, show alert
      if (!found) {
        Alert.alert('No Favorites', 'You haven\'t favorited any flashcards yet.');
        setShowOnlyFavorites(false);
      }
    } else {
      // Reset to first card of original course
      setCurrentChapterIndex(0);
      setCurrentSubchapterIndex(0);
      setCurrentCardIndex(0);
    }
  };

  // Change card with animation (use filtered course)
  const changeCard = (chapterIndex: number, subchapterIndex: number, cardIndex: number) => {
    // Reset flip state immediately to prevent flash
    setFlipped(false);
    flipAnimation.setValue(0);
    setIsChanging(true);
    
    // Change card immediately without delay
    setCurrentChapterIndex(chapterIndex);
    setCurrentSubchapterIndex(subchapterIndex);
    setCurrentCardIndex(cardIndex);
    
    // Small delay just for the changing state
    setTimeout(() => {
      setIsChanging(false);
    }, 100);
  };

  // Handle previous card (use filtered course)
  const handlePrevious = () => {
    if (!currentChapter || !currentSubchapter || !filteredCourse.chapters) return;
    
    if (currentCardIndex > 0) {
      changeCard(currentChapterIndex, currentSubchapterIndex, currentCardIndex - 1);
    } else if (currentSubchapterIndex > 0 && currentChapter.subchapters) {
      const prevSubchapterIndex = currentSubchapterIndex - 1;
      const prevSubchapter = currentChapter.subchapters[prevSubchapterIndex];
      if (prevSubchapter?.flashcards && prevSubchapter.flashcards.length > 0) {
        const prevSubchapterLastCardIndex = prevSubchapter.flashcards.length - 1;
        changeCard(currentChapterIndex, prevSubchapterIndex, prevSubchapterLastCardIndex);
      }
    } else if (currentChapterIndex > 0) {
      const prevChapterIndex = currentChapterIndex - 1;
      const prevChapter = course.chapters[prevChapterIndex];
      if (prevChapter?.subchapters && prevChapter.subchapters.length > 0) {
        const prevSubchapterIndex = prevChapter.subchapters.length - 1;
        const prevSubchapter = prevChapter.subchapters[prevSubchapterIndex];
        if (prevSubchapter?.flashcards && prevSubchapter.flashcards.length > 0) {
          const prevSubchapterLastCardIndex = prevSubchapter.flashcards.length - 1;
          changeCard(prevChapterIndex, prevSubchapterIndex, prevSubchapterLastCardIndex);
        }
      }
    } else {
      // Wrap to last card of last subchapter of last chapter
      const lastChapterIndex = filteredCourse.chapters.length - 1;
      const lastChapter = filteredCourse.chapters[lastChapterIndex];
      if (lastChapter?.subchapters && lastChapter.subchapters.length > 0) {
        const lastSubchapterIndex = lastChapter.subchapters.length - 1;
        const lastSubchapter = lastChapter.subchapters[lastSubchapterIndex];
        if (lastSubchapter?.flashcards && lastSubchapter.flashcards.length > 0) {
          const lastCardIndex = lastSubchapter.flashcards.length - 1;
          changeCard(lastChapterIndex, lastSubchapterIndex, lastCardIndex);
        }
      }
    }
  };

  // Handle next card (use filtered course)
  const handleNext = () => {
    if (!currentChapter || !currentSubchapter || !filteredCourse.chapters) return;
    
    // Mark current card as completed
    const newCompletedCards = [...completedCards];
    if (newCompletedCards[currentChapterIndex]?.[currentSubchapterIndex]) {
      newCompletedCards[currentChapterIndex][currentSubchapterIndex][currentCardIndex] = true;
      setCompletedCards(newCompletedCards);
    }

    if (currentSubchapter.flashcards && currentCardIndex < currentSubchapter.flashcards.length - 1) {
      // Next card in same subchapter
      changeCard(currentChapterIndex, currentSubchapterIndex, currentCardIndex + 1);
    } else if (currentChapter.subchapters && currentSubchapterIndex < currentChapter.subchapters.length - 1) {
      // First card of next subchapter
      changeCard(currentChapterIndex, currentSubchapterIndex + 1, 0);
    } else if (currentChapterIndex < course.chapters.length - 1) {
      // First card of first subchapter of next chapter
      changeCard(currentChapterIndex + 1, 0, 0);
    } else {
      // Wrap to first card of first subchapter of first chapter
      changeCard(0, 0, 0);
    }
  };

  // Handle shuffle (use filtered course)
  const handleShuffle = () => {
    if (!filteredCourse.chapters || filteredCourse.chapters.length === 0) return;
    
    const randomChapterIndex = Math.floor(Math.random() * filteredCourse.chapters.length);
    const randomChapter = filteredCourse.chapters[randomChapterIndex];
    if (!randomChapter?.subchapters || randomChapter.subchapters.length === 0) return;
    
    const randomSubchapterIndex = Math.floor(Math.random() * randomChapter.subchapters.length);
    const randomSubchapter = randomChapter.subchapters[randomSubchapterIndex];
    if (!randomSubchapter?.flashcards || randomSubchapter.flashcards.length === 0) return;
    
    const randomCardIndex = Math.floor(Math.random() * randomSubchapter.flashcards.length);
    changeCard(randomChapterIndex, randomSubchapterIndex, randomCardIndex);
  };

  // Initialize favorite status from API data when flashcards load
  useEffect(() => {
    if (course.chapters && course.chapters.length > 0) {
      const favoriteMap: Record<string, boolean> = {};
      course.chapters.forEach((chapter) => {
        chapter.subchapters.forEach((subchapter) => {
          subchapter.flashcards.forEach((flashcard) => {
            if (flashcard.id !== undefined) {
              favoriteMap[flashcard.id.toString()] = flashcard.is_favorite || false;
            }
          });
        });
      });
      setFavorited(prev => ({ ...prev, ...favoriteMap }));
    }
  }, [course.chapters]);

  // Get current flashcard favorite status
  const getCurrentFlashcardFavoriteStatus = (): boolean => {
    if (!currentFlashcard?.id) return false;
    const flashcardId = currentFlashcard.id.toString();
    return favorited[flashcardId] !== undefined ? favorited[flashcardId] : (currentFlashcard.is_favorite || false);
  };

  // Handle card flip
  const handleCardFlip = () => {
    setFlipped(!flipped);
    Animated.spring(flipAnimation, {
      toValue: flipped ? 0 : 1,
      useNativeDriver: true,
      tension: 10,
      friction: 8,
    }).start();
  };

  // Handle favorite (only add, no remove)
  const handleFavorite = async () => {
    if (!currentFlashcard?.id) {
      console.warn('⚠️ Cannot favorite flashcard: missing ID');
      return;
    }

    const flashcardId = currentFlashcard.id.toString();
    const currentFavoriteState = getCurrentFlashcardFavoriteStatus();
    
    // If already favorited, do nothing
    if (currentFavoriteState) {
      return;
    }
    
    // Optimistically update UI
    setFavorited(prev => ({
      ...prev,
      [flashcardId]: true
    }));

    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      
      // Use the correct favorites endpoint to add favorite
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.favorites.postFavorite}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcard: currentFlashcard.id
        }),
      });

      if (!response.ok) {
        // Revert on error
        setFavorited(prev => ({
          ...prev,
          [flashcardId]: false
        }));
        const errorData = await response.json().catch(() => ({ detail: 'Failed to add favorite' }));
        Alert.alert('Error', errorData.detail || errorData.error || 'Failed to add favorite');
      } else {
        console.log('✅ Flashcard favorited successfully');
        // Re-fetch favorites to sync with backend
        if (courseId) {
          fetchFavorites(courseId, authToken);
        }
      }
    } catch (error: any) {
      // Revert on error
      setFavorited(prev => ({
        ...prev,
        [flashcardId]: false
      }));
      console.error('❌ Error adding favorite:', error);
      Alert.alert('Error', error.message || 'Failed to add favorite');
    }
  };



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Loading State */}
      {isLoading && (
        <PremiumLoader text="Please wait, loading flashcards..." size="large" />
      )}

      {/* Content */}
      {!isLoading && course.chapters.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No flashcards available for this course yet.
          </Text>
        </View>
      )}

      {/* Content */}
      {!isLoading && course.chapters && course.chapters.length > 0 && currentChapter && currentSubchapter && currentFlashcard && (
        <>
          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.content}>
              

              {/* Main content */}
              <View style={styles.mainContentArea}>
                {/* Flashcard container */}
                <View style={styles.flashcardContainer}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardCounter}>
                      <Text style={[styles.counterText, { color: colors.muted, fontWeight: '900' }]}>
                        {getCurrentCardNumber()} / {totalFlashcards}
                      </Text>
                      <View style={[styles.chapterBadge, { borderColor: colors.border }]}>
                        <Text style={[styles.chapterBadgeText, { color: colors.foreground, fontWeight: '900' }]}>
                          {currentChapter?.chapterName || 'Unknown'} - {currentSubchapter?.subchapterName || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                  </View>

                              {/* Card content with 3D flip */}
                <View style={styles.cardContent}>
                  {/* Front side of card */}
                  <Animated.View
                    style={[
                      styles.flashcard,
                      styles.flashcardFront,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      {
                        transform: [
                          {
                            rotateY: flipAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '180deg'],
                            }),
                          },
                        ],
                        backfaceVisibility: 'hidden',
                      },
                    ]}
                  >
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={handleFavorite}
                      disabled={getCurrentFlashcardFavoriteStatus()}
                    >
                      <Star 
                        size={24} 
                        color={getCurrentFlashcardFavoriteStatus() ? colors.yellow : colors.muted}
                        fill={getCurrentFlashcardFavoriteStatus() ? colors.yellow : 'none'}
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cardInner}
                      onPress={handleCardFlip}
                    >
                      <Text style={[styles.cardText, { color: colors.foreground }]}>
                        {currentFlashcard?.question || 'No question available'}
                      </Text>
                      <Text style={[styles.cardHint, { color: colors.muted, fontWeight: '500' }]}>
                        Click to flip
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Back side of card */}
                  <Animated.View
                    style={[
                      styles.flashcard,
                      styles.flashcardBack,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      {
                        transform: [
                          {
                            rotateY: flipAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['180deg', '360deg'],
                            }),
                          },
                        ],
                        backfaceVisibility: 'hidden',
                      },
                    ]}
                  >
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={handleFavorite}
                      disabled={getCurrentFlashcardFavoriteStatus()}
                    >
                      <Star 
                        size={24} 
                        color={getCurrentFlashcardFavoriteStatus() ? colors.yellow : colors.muted}
                        fill={getCurrentFlashcardFavoriteStatus() ? colors.yellow : 'none'}
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cardInner}
                      onPress={handleCardFlip}
                    >
                      <Text style={[styles.cardText, { color: colors.foreground }]}>
                        {currentFlashcard?.answer || 'No answer available'}
                      </Text>
                      <Text style={[styles.cardHint, { color: colors.muted, fontWeight: '500' }]}>
                        Click to flip back
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>

              {/* Card footer */}
              <View style={styles.cardFooter}>
                {/* Centered navigation buttons with star and shuffle */}
                <View style={styles.navigationButtons}>
                  {/* Filled Star Button - Show Only Favorites */}
                  <TouchableOpacity
                    style={styles.favoritesFilterButton}
                    onPress={handleToggleFavorites}
                  >
                    <Star 
                      size={20} 
                      color={showOnlyFavorites ? colors.yellow : colors.muted}
                      fill={showOnlyFavorites ? colors.yellow : 'none'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.navButton, { borderColor: colors.border }]}
                    onPress={handlePrevious}
                  >
                    <ArrowLeft size={24} color={colors.foreground} strokeWidth={3} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.navButton, { borderColor: colors.border }]}
                    onPress={handleNext}
                  >
                    <ArrowRight size={24} color={colors.foreground} strokeWidth={3} />
                  </TouchableOpacity>

                  {/* Shuffle button */}
                  <TouchableOpacity
                    style={styles.shuffleButton}
                    onPress={handleShuffle}
                    disabled={isChanging}
                  >
                    <Shuffle size={16} color={colors.foreground} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      </>
      )}
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSidebar: {
    width: 288,
    borderRightWidth: 1,
    padding: 16,
    paddingTop: 20,
  },
  sidebarHeader: {
    marginBottom: 4,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  chaptersList: {
    flex: 1,
  },
  chapterItem: {
    marginBottom: 8,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  chapterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterName: {
    fontSize: 14,
    fontWeight: '900',
  },
  chapterProgress: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterProgressBar: {
    marginLeft: 24,
    marginRight: 8,
    marginBottom: 8,
  },
  subchaptersList: {
    marginLeft: 24,
    marginTop: 8,
    gap: 4,
  },
  subchapterItem: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeSubchapter: {
    backgroundColor: '#f3f4f6',
  },
  subchapterName: {
    fontSize: 12,
    fontWeight: '500',
  },
  subchapterProgress: {
    fontSize: 12,
  },
  bottomActions: {
    marginBottom: 80,
    gap: 8,
    alignItems: 'center',
  },
  addNotesButton: {
    paddingVertical: 4,
  },
  addNotesText: {
    fontSize: 12,
  },
  favouritesButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  favouritesText: {
    fontSize: 12,
  },
  mainContentArea: {
    flex: 1,
    padding: 0,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashcardContainer: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 500,
  },
  cardCounter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 14,
    marginBottom: 8,
  },
  chapterBadge: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chapterBadgeText: {
    fontSize: 12,
  },
  closeButton: {
    padding: 8,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    paddingTop: 40,
    marginTop: '15%',
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
  },
  flashcard: {
    width: '100%',
    height: 400,
    
    borderRadius: 2,
    borderWidth: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flashcardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flashcardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  cardHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    width: '100%',
    position: 'absolute',
    bottom: 8,
    left: '5%',
    right: 0,
    
    alignSelf: 'center',
  },
  favoritesFilterButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    width: 64,
    height: 36,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  shuffleText: {
    fontSize: 14,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

