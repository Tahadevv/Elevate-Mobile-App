import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Flag,
  SkipForward
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AIChatInterface } from '../../../../components/chatbot/AIChatInterface';
import { useColors } from '../../../../components/theme-provider';
import API_CONFIG from '../../../../config.api';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchPracticeQuiz, setCurrentQuestion } from '../../../../store/slices/practiceQuizSlice';
import { useSupportModal, SupportModalProvider } from '../../../../components/dashboardItems/support-modal';
import { DotLoader } from '../../../../components/ui/dot-loader';

interface Question {
  id?: number; // Question ID from API
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

interface SubChapter {
  name: string;
  questions: Question[];
}

interface Chapter {
  name: string;
  subChapters: SubChapter[];
}

interface Course {
  courseName: string;
  chapters: Chapter[];
}

function ExamScreenContent() {
  const dispatch = useAppDispatch();
  const { quizData, isLoading, error, currentQuestionIndex, answers, score, isCompleted } = useAppSelector((state: any) => state.practiceQuiz);
  const { token } = useAppSelector((state: any) => state.auth);
  const { openSupportModal } = useSupportModal();
  
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz' | 'ai' | 'notes'>('quiz');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSubChapterIndex, setCurrentSubChapterIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState<number[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<boolean[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[][][]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[][][]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [tab, setTab] = useState<'ai' | 'notes'>('ai');
  
  // Get course ID from navigation params (same as flashcards and course-details)
  const localParams = useLocalSearchParams<{ courseId?: string }>();
  // Also try to get from Redux courseDetails as fallback
  const { courseDetails } = useAppSelector((state: any) => state.courseDetails);
  // Use courseId from params, or from courseDetails, or undefined
  const courseId = localParams.courseId || courseDetails?.id?.toString();

  // State for progress restoration
  const [apiProgress, setApiProgress] = useState<any>(null);
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Fetch practice quiz from API
  useEffect(() => {
    if (token && courseId) {
      console.log('📝 Fetching practice quiz for course ID:', courseId);
      dispatch(fetchPracticeQuiz({ courseId, token } as any));
      
      // Also fetch progress to restore position
      const fetchProgress = async () => {
        try {
          const authToken = token || API_CONFIG.FIXED_TOKEN;
          const response = await fetch(`${API_CONFIG.baseURL}/quiz_progress/${courseId}/progress/`, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${authToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const progressData = await response.json();
            setApiProgress(progressData);
            console.log('✅ Progress loaded:', progressData);
          } else {
            console.log('⚠️ No progress found (404 or other error)');
          }
        } catch (error) {
          console.error('❌ Error fetching progress:', error);
        } finally {
          setProgressLoaded(true);
        }
      };
      
      fetchProgress();
    } else {
      console.warn('⚠️ Missing courseId or token:', { courseId, hasToken: !!token, localParams, courseDetailsId: courseDetails?.id });
    }
  }, [token, courseId, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  // AI Chat state - removed, now using AIChatInterface component
  
  const colors = useColors();
  const router = useRouter();

  // Convert API data to component format (matching website format)
  const course: Course = quizData ? {
    courseName: quizData.name || "Practice Quiz",
    chapters: quizData.chapters?.map((chapter: any) => ({
      name: chapter.name,
      subChapters: chapter.subtopics?.map((subtopic: any) => ({
        name: subtopic.name,
        questions: subtopic.questions?.map((question: any) => ({
          id: question.id, // Store question ID from API
          question: question.text || question.question,
          options: question.option0 && question.option1 ? [
            question.option0,
            question.option1,
            question.option2,
            question.option3
          ] : (question.options || []),
          correctOption: question.option0 && question.option1 
            ? [question.option0, question.option1, question.option2, question.option3][question.correct_option]
            : (question.correctOption || question.correct_answer || ''),
          explanation: question.explanation || ""
        })) || []
      })) || []
    })) || []
  } : {
    courseName: "Introduction to TypeScript",
    chapters: [
      {
        name: "Getting Started",
        subChapters: [
          {
            name: "Introduction",
            questions: [
              {
                question: "What is TypeScript?",
                options: [
                  "A typed superset of JavaScript",
                  "A database system",
                  "A CSS framework",
                  "A text editor"
                ],
                correctOption: "A typed superset of JavaScript",
                explanation: "TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript."
              },
              {
                question: "Who developed TypeScript?",
                options: ["Google", "Microsoft", "Facebook", "Apple"],
                correctOption: "Microsoft",
                explanation: "TypeScript was developed by Microsoft and first released in 2012."
              },
              {
                question: "What is the file extension for TypeScript files?",
                options: [".js", ".ts", ".tsx", ".jsx"],
                correctOption: ".ts",
                explanation: "TypeScript files use the .ts extension, while .tsx is used for TypeScript with JSX."
              },
              {
                question: "What does TypeScript improve over JavaScript?",
                options: ["Speed", "Type safety", "File size", "Performance"],
                correctOption: "Type safety",
                explanation: "TypeScript adds static type checking to JavaScript, improving developer experience and reducing bugs."
              },
              {
                question: "Which tool compiles TypeScript to JavaScript?",
                options: ["Webpack", "Node", "tsc", "npm"],
                correctOption: "tsc",
                explanation: "The TypeScript compiler (tsc) compiles .ts files into JavaScript."
              }
            ]
          },
          {
            name: "Setup",
            questions: [
              {
                question: "Which of the following is a TypeScript feature?",
                options: ["Dynamic typing", "Loose syntax", "Static typing", "None"],
                correctOption: "Static typing",
                explanation: "Static typing is a key feature of TypeScript."
              },
              {
                question: "What is the purpose of tsconfig.json?",
                options: ["Package management", "TypeScript configuration", "Build scripts", "Dependencies"],
                correctOption: "TypeScript configuration",
                explanation: "tsconfig.json contains TypeScript compiler options and project settings."
              },
              {
                question: "How do you install TypeScript globally?",
                options: ["npm install typescript", "npm install -g typescript", "yarn add typescript", "pnpm add typescript"],
                correctOption: "npm install -g typescript",
                explanation: "Use -g flag to install TypeScript globally on your system."
              }
            ]
          }
        ]
      },
      {
        name: "Basic Types",
        subChapters: [
          {
            name: "Primitive Types",
            questions: [
              {
                question: "Name some basic types in TypeScript.",
                options: [
                  "string, number, boolean, null, undefined",
                  "array, object, function",
                  "class, interface, enum",
                  "none of the above"
                ],
                correctOption: "string, number, boolean, null, undefined",
                explanation: "These are the primitive types in TypeScript."
              },
              {
                question: "How do you annotate a number type?",
                options: ["let x: int", "let x: number", "let x: float", "let x: numeric"],
                correctOption: "let x: number",
                explanation: "TypeScript uses 'number' for all numeric values."
              },
              {
                question: "What does 'any' type represent?",
                options: ["A number", "An unknown type", "A string", "A boolean"],
                correctOption: "An unknown type",
                explanation: "'any' allows any type of value, bypassing type checks."
              },
              {
                question: "What does 'void' mean in TypeScript?",
                options: ["No return value", "A class type", "An object", "Null"],
                correctOption: "No return value",
                explanation: "Void is typically used for functions that don't return a value."
              },
              {
                question: "Which keyword defines a constant?",
                options: ["let", "var", "def", "const"],
                correctOption: "const",
                explanation: "Use 'const' to declare constants."
              }
            ]
          },
          {
            name: "Complex Types",
            questions: [
              {
                question: "How do you define an array type?",
                options: ["let arr: array", "let arr: []", "let arr: string[]", "let arr: array<string>"],
                correctOption: "let arr: string[]",
                explanation: "Use square brackets with the type to define array types."
              },
              {
                question: "What is a tuple in TypeScript?",
                options: ["An array", "A fixed-length array with specific types", "An object", "A function"],
                correctOption: "A fixed-length array with specific types",
                explanation: "Tuples have a fixed number of elements with specific types."
              },
              {
                question: "How do you define an object type?",
                options: ["let obj: object", "let obj: {}", "let obj: {name: string}", "let obj: Object"],
                correctOption: "let obj: {name: string}",
                explanation: "Define object types with property names and their types."
              }
            ]
          }
        ]
      },
      {
        name: "Functions",
        subChapters: [
          {
            name: "Function Basics",
            questions: [
              {
                question: "How do you define a function with types?",
                options: [
                  "function foo(): number {}",
                  "function foo => number {}",
                  "def foo() number {}",
                  "let foo: number function {}"
                ],
                correctOption: "function foo(): number {}",
                explanation: "This syntax defines the return type of the function."
              },
              {
                question: "How to specify parameter types?",
                options: [
                  "function add(a, b): number",
                  "function add(a: number, b: number): number",
                  "function add(a number, b number): number",
                  "function add(int a, int b): number"
                ],
                correctOption: "function add(a: number, b: number): number",
                explanation: "You specify parameter types with a colon followed by the type."
              },
              {
                question: "What is the default return type if not specified?",
                options: ["any", "void", "number", "undefined"],
                correctOption: "any",
                explanation: "If not specified, the function's return type defaults to 'any'."
              }
            ]
          },
          {
            name: "Arrow Functions",
            questions: [
              {
                question: "What does '=> number' signify?",
                options: ["Return type", "Parameter", "Function name", "Variable type"],
                correctOption: "Return type",
                explanation: "Arrow functions in TypeScript can also specify return types this way."
              },
              {
                question: "Which syntax defines an arrow function?",
                options: ["function() => {}", "() => {}", "=> function() {}", "fn() -> {}"],
                correctOption: "() => {}",
                explanation: "Arrow functions use the '() => {}' syntax."
              },
              {
                question: "How do you type an arrow function parameter?",
                options: ["(a) => {}", "(a: number) => {}", "(a number) => {}", "(int a) => {}"],
                correctOption: "(a: number) => {}",
                explanation: "Use colon syntax to type arrow function parameters."
              }
            ]
          }
        ]
      },
      {
        name: "Interfaces and Types",
        subChapters: [
          {
            name: "Interface Basics",
            questions: [
              {
                question: "What is an interface in TypeScript?",
                options: [
                  "A class instance",
                  "A way to describe object structure",
                  "A styling tool",
                  "A type of function"
                ],
                correctOption: "A way to describe object structure",
                explanation: "Interfaces describe the shape of objects."
              },
              {
                question: "How do you define an interface?",
                options: ["type User = {}", "let User = interface {}", "interface User {}", "User implements {}"],
                correctOption: "interface User {}",
                explanation: "This is the standard way to define an interface."
              },
              {
                question: "Can interfaces extend other interfaces?",
                options: ["Yes", "No", "Only classes can", "Only types can"],
                correctOption: "Yes",
                explanation: "Interfaces can extend other interfaces to add properties."
              }
            ]
          },
          {
            name: "Advanced Interfaces",
            questions: [
              {
                question: "Are optional properties allowed in interfaces?",
                options: ["No", "Yes, using '?'", "Only if declared 'maybe'", "Yes, using '='"],
                correctOption: "Yes, using '?'",
                explanation: "Optional properties are denoted with a '?'."
              },
              {
                question: "Which is correct to describe an object with a name and age?",
                options: [
                  "interface Person { string name; number age; }",
                  "interface Person { name: string; age: number; }",
                  "Person = { string name, number age }",
                  "type Person = class { name: string, age: number }"
                ],
                correctOption: "interface Person { name: string; age: number; }",
                explanation: "This is the correct syntax for defining an interface."
              },
              {
                question: "What are readonly properties?",
                options: ["Properties that can't be changed", "Properties that are private", "Properties that are optional", "Properties that are public"],
                correctOption: "Properties that can't be changed",
                explanation: "Readonly properties cannot be modified after initialization."
              }
            ]
          }
        ]
      },
      {
        name: "Advanced Features",
        subChapters: [
          {
            name: "Union Types",
            questions: [
              {
                question: "What is a union type?",
                options: ["A mix of CSS and JS", "Multiple possible types", "A class", "A method"],
                correctOption: "Multiple possible types",
                explanation: "Union types allow a variable to be more than one type using `|`."
              },
              {
                question: "Which syntax is used for union types?",
                options: [
                  "type A = string and number",
                  "type A = string | number",
                  "type A = [string, number]",
                  "type A = {string, number}"
                ],
                correctOption: "type A = string | number",
                explanation: "The `|` operator is used to create union types."
              },
              {
                question: "How do you handle union types in functions?",
                options: ["Use type guards", "Ignore them", "Always use 'any'", "Convert to string"],
                correctOption: "Use type guards",
                explanation: "Type guards help narrow down union types to specific types."
              }
            ]
          },
          {
            name: "Special Types",
            questions: [
              {
                question: "What is 'never' type used for?",
                options: ["Always return a value", "Throw or infinite loop", "Optional return", "Null values"],
                correctOption: "Throw or infinite loop",
                explanation: "'never' represents a value that never occurs."
              },
              {
                question: "What are type aliases?",
                options: [
                  "Alternate interface",
                  "Shortcut to define types",
                  "Another name for variable",
                  "None of the above"
                ],
                correctOption: "Shortcut to define types",
                explanation: "Type aliases give custom names to types."
              },
              {
                question: "Which keyword defines a type alias?",
                options: ["alias", "define", "type", "interface"],
                correctOption: "type",
                explanation: "Use 'type' keyword to define a type alias."
              }
            ]
          }
        ]
      }
    ]
  };

  // Initialize state arrays
  useEffect(() => {
    if (course.chapters.length === 0) return;
    
    const chaptersLength = course.chapters.length;
    setChapterProgress(Array(chaptersLength).fill(0));
    setExpandedChapters(Array(chaptersLength).fill(false));
    
    const newCompletedQuestions = course.chapters.map(chapter =>
      chapter.subChapters.map(subChapter =>
        Array(subChapter.questions.length).fill(false)
      )
    );
    setCompletedQuestions(newCompletedQuestions);
    
    const newFlaggedQuestions = course.chapters.map(chapter =>
      chapter.subChapters.map(subChapter =>
        Array(subChapter.questions.length).fill(false)
      )
    );
    setFlaggedQuestions(newFlaggedQuestions);

    // Restore progress from API if available
    if (apiProgress && progressLoaded && apiProgress.last_viewed_question !== null && apiProgress.last_viewed_question !== undefined) {
      // Find the question in the structure
      let chapterIdx = 0;
      let subtopicIdx = 0;
      let questionIdx = 0;
      let found = false;
      
      for (let c = 0; c < course.chapters.length; c++) {
        for (let s = 0; s < course.chapters[c].subChapters.length; s++) {
          for (let q = 0; q < course.chapters[c].subChapters[s].questions.length; q++) {
            const question = course.chapters[c].subChapters[s].questions[q];
            if (question.id === apiProgress.last_viewed_question) {
              chapterIdx = c;
              subtopicIdx = s;
              questionIdx = q;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
      
      if (found) {
        // Build progress map to check answered questions
        const progressMap: Record<number, { selectedOption: number | null; isFlagged: boolean }> = {};
        if (apiProgress.chapters) {
          apiProgress.chapters.forEach((progressChapter: any) => {
            progressChapter.subtopics?.forEach((progressSubtopic: any) => {
              progressSubtopic.questions?.forEach((progressQuestion: any) => {
                progressMap[progressQuestion.question] = {
                  selectedOption: progressQuestion.selected_option,
                  isFlagged: progressQuestion.is_flagged
                };
              });
            });
          });
        }

        // Find next unanswered question
        let nextChapterIdx = chapterIdx;
        let nextSubtopicIdx = subtopicIdx;
        let nextQuestionIdx = questionIdx;
        
        // Start from next question after last viewed
        nextQuestionIdx++;
        
        if (nextQuestionIdx >= course.chapters[nextChapterIdx].subChapters[nextSubtopicIdx].questions.length) {
          nextQuestionIdx = 0;
          nextSubtopicIdx++;
          
          if (nextSubtopicIdx >= course.chapters[nextChapterIdx].subChapters.length) {
            nextSubtopicIdx = 0;
            nextChapterIdx++;
          }
        }
        
        // Find first unanswered question from this point
        let unansweredFound = false;
        for (let c = nextChapterIdx; c < course.chapters.length && !unansweredFound; c++) {
          for (let s = (c === nextChapterIdx ? nextSubtopicIdx : 0); s < course.chapters[c].subChapters.length && !unansweredFound; s++) {
            for (let q = (c === nextChapterIdx && s === nextSubtopicIdx ? nextQuestionIdx : 0); q < course.chapters[c].subChapters[s].questions.length; q++) {
              const questionId = course.chapters[c].subChapters[s].questions[q].id;
              const progress = questionId ? progressMap[questionId] : undefined;
              
              if (!progress || progress.selectedOption === null) {
                setCurrentChapterIndex(c);
                setCurrentSubChapterIndex(s);
                dispatch(setCurrentQuestion(q));
                unansweredFound = true;
                console.log('📍 Restored to unanswered question:', { c, s, q, questionId });
                break;
              }
            }
          }
        }
        
        // If all questions answered, go to last viewed
        if (!unansweredFound && found) {
          setCurrentChapterIndex(chapterIdx);
          setCurrentSubChapterIndex(subtopicIdx);
          dispatch(setCurrentQuestion(questionIdx));
          console.log('📍 Restored to last viewed question:', { chapterIdx, subtopicIdx, questionIdx });
        }
      }
    }
  }, [course.chapters.length, progressLoaded, apiProgress]);

  // Current question data with null checks
  const currentChapter = course?.chapters?.[currentChapterIndex];
  const currentSubChapter = currentChapter?.subChapters?.[currentSubChapterIndex];
  const currentQuestion = currentSubChapter?.questions?.[currentQuestionIndex];

  // Calculate total questions with null checks
  const totalQuestions = course?.chapters?.reduce(
    (sum, chapter) => sum + (chapter?.subChapters?.reduce((subSum, subChapter) => subSum + (subChapter?.questions?.length || 0), 0) || 0),
    0
  ) || 0;

  // Calculate total progress and chapter progress
  useEffect(() => {
    if (completedQuestions.length === 0) return;
    
    // Calculate overall progress
    const completedCount = completedQuestions.flat(2).filter(Boolean).length;
    setProgress((completedCount / totalQuestions) * 100);

    // Calculate progress for each chapter
    const newChapterProgress = course.chapters.map((chapter, chapterIdx) => {
      const totalChapterQuestions = chapter.subChapters.reduce(
        (sum, subChapter) => sum + subChapter.questions.length,
        0
      );

      const completedChapterQuestions = completedQuestions[chapterIdx].flat().filter(Boolean).length;
      return (completedChapterQuestions / totalChapterQuestions) * 100;
    });

    setChapterProgress(newChapterProgress);
  }, [completedQuestions, totalQuestions]);

  // Toggle chapter expansion
  const toggleChapter = (index: number) => {
    const newExpandedChapters = [...expandedChapters];
    newExpandedChapters[index] = !newExpandedChapters[index];
    setExpandedChapters(newExpandedChapters);
  };

  // Navigate to specific question
  const navigateToQuestion = (chapterIdx: number, subChapterIdx: number, questionIdx: number) => {
    setCurrentChapterIndex(chapterIdx);
    setCurrentSubChapterIndex(subChapterIdx);
    dispatch(setCurrentQuestion(questionIdx));
    setSelectedOption(null);
    setIsAnswered(false);
    // Switch to quiz tab when navigating from courses
    setActiveTab('quiz');
  };

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    // Mark question as completed
    const newCompletedQuestions = [...completedQuestions];
    newCompletedQuestions[currentChapterIndex][currentSubChapterIndex][currentQuestionIndex] = true;
    setCompletedQuestions(newCompletedQuestions);
  };

  // Get current question ID
  const getCurrentQuestionId = (): number | null => {
    if (!currentQuestion || !currentQuestion.id) {
      return null;
    }
    return currentQuestion.id;
  };

  // Check if current question is flagged
  const isQuestionFlagged = (): boolean => {
    return flaggedQuestions[currentChapterIndex]?.[currentSubChapterIndex]?.[currentQuestionIndex] || false;
  };

  // Submit handler - submits answer to API
  const submitHandler = async (questionId: number, selectedOption: number | null, isFlagged: boolean) => {
    const payload = {
      question_id: questionId,
      selected_option: selectedOption,
      is_flagged: isFlagged
    };

    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      const response = await fetch(`${API_CONFIG.baseURL}/quiz_progress/update_question/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("✅ Question submitted successfully:", questionId);
    } catch (error) {
      console.error("❌ Error submitting question:", error);
    }
  };

  // Handle continue button
  const handleContinue = async () => {
    if (!currentQuestion || !currentSubChapter || !currentChapter) return;

    // Submit to API before moving to next question
    const questionId = getCurrentQuestionId();
    if (questionId && currentQuestion.options) {
      const optionIndex = selectedOption ? currentQuestion.options.indexOf(selectedOption) : null;
      await submitHandler(questionId, optionIndex, isQuestionFlagged());
    }

    setSelectedOption(null);
    setIsAnswered(false);

    // Move to next question, subchapter, or chapter
    if (currentSubChapter.questions && currentQuestionIndex < currentSubChapter.questions.length - 1) {
      // Next question in current subchapter
      dispatch(setCurrentQuestion(currentQuestionIndex + 1));
    } else if (currentChapter.subChapters && currentSubChapterIndex < currentChapter.subChapters.length - 1) {
      // Next subchapter
      setCurrentSubChapterIndex(currentSubChapterIndex + 1);
      dispatch(setCurrentQuestion(0));
    } else if (course.chapters && currentChapterIndex < course.chapters.length - 1) {
      // Next chapter
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentSubChapterIndex(0);
      dispatch(setCurrentQuestion(0));
    }
  };

  // Handle skip button
  const handleSkip = async () => {
    if (!currentSubChapter || !currentChapter) return;

    // Submit skip to API
    const questionId = getCurrentQuestionId();
    if (questionId) {
      await submitHandler(questionId, null, isQuestionFlagged());
    }

    setSelectedOption(null);
    setIsAnswered(false);

    // Move to next question, subchapter, or chapter
    if (currentSubChapter.questions && currentQuestionIndex < currentSubChapter.questions.length - 1) {
      dispatch(setCurrentQuestion(currentQuestionIndex + 1));
    } else if (currentChapter.subChapters && currentSubChapterIndex < currentChapter.subChapters.length - 1) {
      setCurrentSubChapterIndex(currentSubChapterIndex + 1);
      dispatch(setCurrentQuestion(0));
    } else if (course.chapters && currentChapterIndex < course.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentSubChapterIndex(0);
      dispatch(setCurrentQuestion(0));
    }
  };

  // Handle flag button
  const handleFlag = () => {
    const newFlaggedQuestions = [...flaggedQuestions];
    newFlaggedQuestions[currentChapterIndex][currentSubChapterIndex][currentQuestionIndex] =
      !newFlaggedQuestions[currentChapterIndex][currentSubChapterIndex][currentQuestionIndex];
    setFlaggedQuestions(newFlaggedQuestions);
  };

  // Handle send message - removed, now handled by AIChatInterface component

  // Get question number out of total
  const getQuestionNumber = () => {
    let questionNumber = 1;

    for (let i = 0; i < currentChapterIndex; i++) {
      for (let j = 0; j < course.chapters[i].subChapters.length; j++) {
        questionNumber += course.chapters[i].subChapters[j].questions.length;
      }
    }

    for (let j = 0; j < currentSubChapterIndex; j++) {
      questionNumber += currentChapter.subChapters[j].questions.length;
    }

    questionNumber += currentQuestionIndex;
    return questionNumber;
  };

  // Calculate subchapter progress
  const getSubChapterProgress = (chapterIdx: number, subChapterIdx: number) => {
    const subChapter = course.chapters[chapterIdx].subChapters[subChapterIdx];
    const completed = completedQuestions[chapterIdx]?.[subChapterIdx]?.filter(Boolean).length || 0;
    return `${completed}/${subChapter.questions.length}`;
  };

  // Check if a subchapter is complete
  const isSubChapterComplete = (chapterIdx: number, subChapterIdx: number) => {
    return completedQuestions[chapterIdx]?.[subChapterIdx]?.every(Boolean) || false;
  };

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route as any);
    }
  };

  const handleTabPress = (tabName: string) => {
    if (tabName === 'courses' || tabName === 'quiz' || tabName === 'ai' || tabName === 'notes') {
      setActiveTab(tabName);
    }
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

  const ProgressBar = ({ value, height = 6 }: { value: number; height?: number }) => (
    <View style={[styles.progressBar, { height }]}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotLoader size="large" color={colors.primary} text="Loading practice quiz..." />
        </View>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Main Content */}
          <ScrollView style={styles.mainContent}>
        <View style={styles.content}>
          {/* Top Navigation Tabs */}
          <View style={[styles.topTabsContainer, { 
            backgroundColor: colors.card,
            borderBottomColor: colors.border 
          }]}>
            <TouchableOpacity 
              style={[
                styles.topTab,
                activeTab === 'courses' ? [styles.activeTopTab, { backgroundColor: colors.card }] : null
              ]}
              onPress={() => setActiveTab('courses')}
            >
              <Text style={[
                styles.topTabText, 
                { color: activeTab === 'courses' ? (colors.background === '#0f172a' ? '#ffd404' : '#185abd') : colors.muted }
              ]}>
                COURSES
              </Text>
              {activeTab === 'courses' && (
                <View style={[styles.activeTabIndicator, { backgroundColor: colors.background === '#0f172a' ? '#ffd404' : '#185abd' }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.topTab,
                activeTab === 'quiz' ? [styles.activeTopTab, { backgroundColor: colors.card }] : null
              ]}
              onPress={() => setActiveTab('quiz')}
            >
              <Text style={[
                styles.topTabText, 
                { color: activeTab === 'quiz' ? (colors.background === '#0f172a' ? '#ffd404' : '#185abd') : colors.muted }
              ]}>
                QUIZ
              </Text>
              {activeTab === 'quiz' && (
                <View style={[styles.activeTabIndicator, { backgroundColor: colors.background === '#0f172a' ? '#ffd404' : '#185abd' }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.topTab,
                activeTab === 'ai' ? [styles.activeTopTab, { backgroundColor: colors.card }] : null
              ]}
              onPress={() => setActiveTab('ai')}
            >
              <Text style={[
                styles.topTabText, 
                { color: activeTab === 'ai' ? (colors.background === '#0f172a' ? '#ffd404' : '#185abd') : colors.muted }
              ]}>
                AI
              </Text>
              {activeTab === 'ai' && (
                <View style={[styles.activeTabIndicator, { backgroundColor: colors.background === '#0f172a' ? '#ffd404' : '#185abd' }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.topTab,
                activeTab === 'notes' ? [styles.activeTopTab, { backgroundColor: colors.card }] : null
              ]}
              onPress={() => setActiveTab('notes')}
            >
              <Text style={[
                styles.topTabText, 
                { color: activeTab === 'notes' ? (colors.background === '#0f172a' ? '#ffd404' : '#185abd') : colors.muted }
              ]}>
                NOTE
              </Text>
              {activeTab === 'notes' && (
                <View style={[styles.activeTabIndicator, { backgroundColor: colors.background === '#0f172a' ? '#ffd404' : '#185abd' }]} />
              )}
            </TouchableOpacity>
          </View>

          {/* Courses Tab Content */}
          {activeTab === 'courses' && (
            <View style={styles.coursesTabContainer}>
              <ScrollView 
                style={styles.coursesScrollView}
                contentContainerStyle={styles.coursesScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Header */}
                <View style={[styles.coursesHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.coursesTitle, { color: colors.foreground }]}>
                    {course.courseName}
                  </Text>
                  <ProgressBar value={progress} height={8} />
                </View>

                {/* Chapter list */}
                <View style={styles.chaptersListContainer}>
                  {course.chapters.map((chapter, chapterIdx) => (
                    <View key={chapterIdx} style={styles.chapterContainer}>
                      {/* Chapter header */}
                      <TouchableOpacity
                        style={[styles.chapterHeaderButton, { borderBottomColor: colors.border }]}
                        onPress={() => toggleChapter(chapterIdx)}
                      >
                        <View style={styles.chapterHeaderContent}>
                          {expandedChapters[chapterIdx] ? (
                            <ChevronDown size={20} color={colors.muted} />
                          ) : (
                            <ChevronRight size={20} color={colors.muted} />
                          )}
                          <Text style={[styles.chapterName, { color: colors.foreground }]}>
                            {chapter.name}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Chapter progress bar */}
                      <View style={styles.chapterProgressContainer}>
                        <ProgressBar value={chapterProgress[chapterIdx] || 0} height={6} />
                      </View>

                      {/* Subchapters */}
                      {expandedChapters[chapterIdx] && (
                        <View style={styles.subChaptersContainer}>
                          {chapter.subChapters.map((subChapter, subChapterIdx) => (
                            <TouchableOpacity
                              key={subChapterIdx}
                              style={[
                                styles.subChapterItem,
                                {
                                  backgroundColor: currentChapterIndex === chapterIdx && currentSubChapterIndex === subChapterIdx
                                    ? (colors.background === '#0f172a' ? '#1e3a2e' : '#f0fdf4')
                                    : colors.card,
                                  borderColor: colors.border
                                }
                              ]}
                              onPress={() => navigateToQuestion(chapterIdx, subChapterIdx, 0)}
                            >
                              <Text
                                style={[
                                  styles.subChapterName,
                                  {
                                    color: currentChapterIndex === chapterIdx && currentSubChapterIndex === subChapterIdx
                                      ? (colors.background === '#0f172a' ? '#10b981' : '#059669')
                                      : colors.foreground
                                  }
                                ]}
                              >
                                {subChapter.name}
                              </Text>
                              <Text
                                style={[
                                  styles.subChapterProgress,
                                  {
                                    color: isSubChapterComplete(chapterIdx, subChapterIdx)
                                      ? (colors.background === '#0f172a' ? '#10b981' : '#059669')
                                      : colors.muted
                                  }
                                ]}
                              >
                                {getSubChapterProgress(chapterIdx, subChapterIdx)}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Main Quiz Content */}
          {activeTab === 'quiz' && (
            <View style={styles.quizContent}>

              {/* Progress bar */}
              <View style={styles.mainProgressContainer}>
                <ProgressBar value={progress} height={6} />
              </View>

              {/* Question content */}
              {currentQuestion ? (
                <View style={styles.questionContainer}>
                  <View style={styles.questionHeader}>
                    <Text style={[styles.questionCounter, { color: '#10b981' }]}>
                      Q. <Text style={{ fontWeight: '900' }}>{getQuestionNumber()}</Text> of <Text style={{ fontWeight: '900' }}>{totalQuestions}</Text>
                    </Text>
                    <View style={styles.questionActions}>
                      <TouchableOpacity style={styles.actionButton} onPress={handleSkip}>
                        <SkipForward size={16} color={colors.muted} strokeWidth={2} />
                        <Text style={[styles.actionText, { color: colors.muted, fontWeight: '900' }]}>Skip</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.actionButton,
                          flaggedQuestions[currentChapterIndex]?.[currentSubChapterIndex]?.[currentQuestionIndex] ? styles.flaggedButton : null
                        ]} 
                        onPress={handleFlag}
                      >
                        <Flag size={16} color={colors.muted} strokeWidth={2} />
                        <Text style={[styles.actionText, { color: colors.muted, fontWeight: '900' }]}>Flag</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.submitButton}
                        onPress={() => router.push('/course/result/stats')}
                      >
                        <Text style={[styles.submitText, { color: colors.foreground, fontWeight: '900' }]}>
                          Submit Quiz
                        </Text>
                        <ChevronRightIcon size={16} color={colors.foreground} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Question */}
                  <View style={styles.questionSection}>
                    <Text style={[styles.questionText, { color: colors.foreground }]}>
                      {currentQuestion?.question || 'No question available'}
                    </Text>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                      {(currentQuestion?.options || []).map((option, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.optionItem,
                          { borderColor: colors.border },
                          // Only highlight after user selects an option
                          selectedOption === option && 
                            option === currentQuestion?.correctOption && {
                              backgroundColor: colors.background === '#0f172a' ? '#064e3b' : '#f0fdf4', // Dark green in dark mode, light green in light mode
                              borderColor: colors.background === '#0f172a' ? '#059669' : '#bbf7d0',
                            },
                          selectedOption === option && 
                            option !== currentQuestion?.correctOption && {
                              backgroundColor: colors.background === '#0f172a' ? '#7f1d1d' : '#fef2f2', // Dark red in dark mode, light red in light mode
                              borderColor: colors.background === '#0f172a' ? '#dc2626' : '#fecaca',
                            },
                          !isAnswered && { borderColor: colors.border }
                        ]}
                        onPress={() => handleOptionSelect(option)}
                      >
                        <View style={styles.optionContent}>
                          <View style={[
                            styles.optionRadio,
                            { borderColor: colors.border }
                          ]} />
                          <Text style={[styles.optionText, { color: colors.foreground, fontWeight: '600' }]}>
                            {option || 'No option text'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Explanation */}
                  {isAnswered && currentQuestion?.explanation && (
                    <View style={[styles.explanationContainer, { 
                      backgroundColor: colors.background === '#0f172a' ? '#064e3b' : '#f0fdf4',
                      borderColor: colors.background === '#0f172a' ? '#059669' : '#bbf7d0'
                    }]}>
                      <Text style={[styles.explanationTitle, { color: colors.foreground, fontWeight: '600' }]}>
                        Explanation:
                      </Text>
                      <Text style={[styles.explanationText, { color: colors.foreground, fontWeight: '600' }]}>
                        {currentQuestion.explanation}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Continue button */}
                {isAnswered && (
                  <TouchableOpacity 
                    style={[styles.continueButton, { 
                      borderColor: colors.border,
                      backgroundColor: colors.card
                    }]}
                    onPress={handleContinue}
                  >
                    <Text style={[styles.continueText, { color: colors.foreground, fontWeight: '900' }]}>
                      Continue
                    </Text>
                  </TouchableOpacity>
                )}

                  {/* Report issue */}
                  <View style={styles.reportSection}>
                    <Text style={[styles.reportText, { color: colors.muted, fontWeight: '900' }]}>
                      have issue in this question?
                    </Text>
                    <TouchableOpacity style={styles.reportButton} onPress={openSupportModal}>
                      <Text style={[styles.reportButtonText, { color: colors.foreground, fontWeight: '900' }]}>
                        report an issue
                      </Text>
                      <AlertTriangle size={12} color={colors.foreground} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.questionContainer}>
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                      {isLoading ? 'Loading questions...' : 'No questions available for this course.'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* AI Assistant Tab Content */}
          {activeTab === 'ai' && (
            <View style={styles.aiTabContainer}>
              <AIChatInterface />
            </View>
          )}

          {/* Notes Tab Content */}
          {activeTab === 'notes' && (
            <View style={styles.notesTabContainer}>
              <ScrollView 
                style={styles.notesScrollView}
                contentContainerStyle={styles.notesScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.notesContainer, { backgroundColor: colors.card }]}>
                  <View style={styles.notesForm}>
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: colors.foreground }]}>
                        Title
                      </Text>
                      <TextInput
                        style={[styles.inputField, { 
                          borderColor: colors.border,
                          color: colors.foreground,
                          backgroundColor: colors.background
                        }]}
                        placeholder="Enter note title"
                        placeholderTextColor={colors.muted}
                      />
                    </View>
                    
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: colors.foreground }]}>
                        Description
                      </Text>
                      <TextInput
                        style={[styles.textAreaField, { 
                          borderColor: colors.border,
                          color: colors.foreground,
                          backgroundColor: colors.background
                        }]}
                        placeholder="Enter note description"
                        placeholderTextColor={colors.muted}
                        multiline
                        numberOfLines={4}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
              
              {/* Fixed Add Note Button */}
              <View style={[styles.fixedAddNoteArea, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity 
                  style={[
                    styles.fixedAddNoteButton, 
                    { backgroundColor: colors.background === '#0f172a' ? '#ffd404' : '#185abd' }
                  ]}
                >
                  <Text style={[
                    styles.fixedAddNoteButtonText, 
                    { color: colors.background === '#0f172a' ? '#0f172a' : '#ffffff' }
                  ]}>
                    Add Note
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Input area is now handled by AIChatInterface component */}
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
    paddingBottom: 40, // Add bottom padding for better scrolling
  },
  topTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    position: 'relative',
  },
  topTab: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    paddingVertical: 4,
  },
  activeTopTab: {
    // backgroundColor will be set dynamically
  },
  topTabText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -13,
    left: -4,
    right: -4,
    height: 3,
    borderRadius: 2,
    zIndex: 1,
  },
  quizContent: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  mainProgressContainer: {
    marginBottom: 24,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  questionContainer: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: '900',
  },
  questionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flaggedButton: {
    opacity: 0.7,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '900',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '900',
  },
  questionSection: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    borderWidth: 1,
    borderRadius: 2,
    padding: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  explanationContainer: {
    borderWidth: 1,
    borderRadius: 2,
    padding: 16,
    marginTop: 16,
  },
  explanationTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  continueButton: {
    width: 128,
    borderWidth: 1,
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  continueText: {
    fontSize: 14,
    
  },
  reportSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  reportText: {
    fontSize: 12,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportButtonText: {
    fontSize: 12,
    fontWeight: '900',
  },
  progressBar: {
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  tabContent: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  aiTabContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 0,
  },
  chatScrollView: {
    flex: 1,
  },
  chatScrollContent: {
    paddingBottom: 100,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginLeft: '20%',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginRight: '15%',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  fixedInputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 0,
    marginBottom: 0,
    zIndex: 1000,
    minHeight: 48,
  },
  attachButton: {
    padding: 8,
  },
  attachButtonText: {
    fontSize: 20,
  },
  textInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  textInput: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 2,
    minHeight: 32,
    maxHeight: 80,
  },
  sendButton: {
    padding: 6,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 20,
  },
  notesContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    padding: 20,
  },
  notesForm: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
  },
  inputField: {
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputText: {
    fontSize: 14,
  },
  textAreaField: {
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textAreaText: {
    fontSize: 14,
    textAlignVertical: 'top',
  },
  addNoteButton: {
    borderRadius: 2,
    paddingVertical: 0,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    alignSelf: 'flex-end',
  },
  addNoteButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  notesTabContainer: {
    flex: 1,
    position: 'relative',
  },
  notesScrollView: {
    flex: 1,
    paddingBottom: 100, // Space for fixed button
  },
  notesScrollContent: {
    padding: 16,
  },
  fixedAddNoteArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 1000,
  },
  fixedAddNoteButton: {
    borderRadius: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  fixedAddNoteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  coursesTabContainer: {
    flex: 1,
  },
  coursesScrollView: {
    flex: 1,
  },
  coursesScrollContent: {
    paddingBottom: 20,
  },
  coursesHeader: {
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  coursesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  chaptersListContainer: {
    paddingHorizontal: 16,
  },
  chapterContainer: {
    marginBottom: 16,
  },
  chapterHeaderButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chapterHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  chapterProgressContainer: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 4,
  },
  subChaptersContainer: {
    marginTop: 8,
    marginLeft: 16,
    gap: 8,
  },
  subChapterItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subChapterName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  subChapterProgress: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default function ExamScreen() {
  return (
    <SupportModalProvider>
      <ExamScreenContent />
    </SupportModalProvider>
  );
}
