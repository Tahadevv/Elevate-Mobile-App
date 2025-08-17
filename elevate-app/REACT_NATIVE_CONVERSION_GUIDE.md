# React Native Expo Conversion Guide

This document outlines the conversion of Next.js components to React Native Expo components for your mobile app.

## 🚀 Converted Components

### ✅ Theme System
- **`components/theme-provider.tsx`** - Custom React context-based theme provider
- **`components/theme-toggle.tsx`** - Theme toggle button with Ionicons

### ✅ Dashboard Items
- **`components/dashboardItems/calender.tsx`** - Full calendar component with event management
- **`components/dashboardItems/chat-modal.tsx`** - AI chat interface with modal and mobile versions
- **`components/dashboardItems/note-modal.tsx`** - Note creation/editing modal
- **`components/dashboardItems/support-modal.tsx`** - Support ticket submission modal

### ✅ Shared Components
- **`components/shared/notification-modal.tsx`** - Notification display modal

## 📱 Key Changes Made

### 1. Component Replacements
- `div` → `View`
- `button` → `TouchableOpacity`
- `input` → `TextInput`
- `textarea` → `TextInput` (with multiline)
- `form` → `View` (form handling moved to state)
- `span`, `p`, `h1-h6` → `Text`

### 2. Event Handling
- `onClick` → `onPress`
- `onChange` → `onChangeText`
- `onSubmit` → Custom handler functions

### 3. Styling
- CSS classes → `StyleSheet.create()`
- CSS properties → React Native style properties
- Flexbox → React Native flexbox (similar but with some differences)

### 4. Icons
- Lucide React icons → Expo Vector Icons (Ionicons)
- `@expo/vector-icons` package required

### 5. Modals
- Next.js Dialog → React Native Modal
- Custom overlay and content styling

## 📦 Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-screens": "^3.29.0"
  }
}
```

Install with:
```bash
npx expo install @expo/vector-icons react-native-safe-area-context react-native-screens
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd elevate-app
npx expo install @expo/vector-icons react-native-safe-area-context react-native-screens
```

### 2. Update App Entry Point
Wrap your app with the theme provider in your main App component:

```tsx
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 3. Import Components
Import and use the converted components in your screens:

```tsx
import { ChatbotModal } from './components/dashboardItems/chat-modal';
import { CalendarSchedule } from './components/dashboardItems/calender';
import { NoteModal } from './components/dashboardItems/note-modal';
import { SupportModalProvider, useSupportModal } from './components/dashboardItems/support-modal';
import { NotificationModal } from './components/shared/notification-modal';
```

## 🎨 Styling Notes

### Colors
- Replaced CSS color classes with hex values
- Used consistent color palette throughout
- Dark/light theme support via context

### Layout
- Flexbox-based layouts maintained
- Responsive design using `Dimensions.get('window')`
- Platform-specific adjustments for iOS/Android

### Typography
- Font sizes converted to numbers
- Font weights maintained
- Line heights added for better readability

## 📱 Mobile-Specific Features

### 1. Touch Interactions
- Touch feedback with `TouchableOpacity`
- Haptic feedback ready (can add `expo-haptics`)

### 2. Keyboard Handling
- `KeyboardAvoidingView` for form inputs
- Platform-specific behavior

### 3. Scrolling
- `ScrollView` for long content
- Performance optimized with `showsVerticalScrollIndicator={false}`

### 4. Modals
- Native modal animations
- Backdrop press handling
- Platform-specific modal behavior

## 🔄 Usage Examples

### Theme Toggle
```tsx
import { ThemeToggle } from './components/theme-toggle';

function Header() {
  return (
    <View style={styles.header}>
      <ThemeToggle />
    </View>
  );
}
```

### Chat Modal
```tsx
import { ChatbotModal } from './components/dashboardItems/chat-modal';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <ChatbotModal triggerButtonText="Chat with AI" />
    </View>
  );
}
```

### Support Modal
```tsx
import { SupportModalProvider, useSupportModal } from './components/dashboardItems/support-modal';

function App() {
  return (
    <SupportModalProvider>
      <YourAppContent />
    </SupportModalProvider>
  );
}

function SupportButton() {
  const { openSupportModal } = useSupportModal();
  
  return (
    <TouchableOpacity onPress={openSupportModal}>
      <Text>Get Help</Text>
    </TouchableOpacity>
  );
}
```

## 🚨 Important Notes

### 1. Platform Differences
- iOS and Android may render slightly differently
- Test on both platforms
- Use platform-specific code when needed

### 2. Performance
- Large lists should use `FlatList` instead of `ScrollView`
- Images should be optimized for mobile
- Consider lazy loading for heavy components

### 3. Navigation
- These components work with any navigation library
- Test with your chosen navigation solution
- Consider deep linking for modals

### 4. Testing
- Test on physical devices
- Test different screen sizes
- Test in both orientations

## 🔮 Future Enhancements

### 1. Animation
- Add `react-native-reanimated` for smooth animations
- Implement gesture-based interactions

### 2. Accessibility
- Add accessibility labels
- Implement screen reader support
- Add haptic feedback

### 3. Offline Support
- Implement offline state handling
- Add data persistence
- Sync when online

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
- [React Native Styling](https://reactnative.dev/docs/style)

## 🆘 Troubleshooting

### Common Issues
1. **Icon not showing**: Ensure `@expo/vector-icons` is installed
2. **Styles not applying**: Check StyleSheet syntax
3. **Modal not working**: Verify Modal import from 'react-native'
4. **Touch not responding**: Check `TouchableOpacity` implementation

### Getting Help
- Check Expo documentation
- Review React Native troubleshooting guides
- Test on different devices/simulators
- Verify all dependencies are installed

---

Your Next.js components have been successfully converted to React Native Expo! 🎉
