# Task 7: Zalene Luxury Profile Screen

A premium, interactive user profile screen built with React Native and Expo. This screen represents the profile of a digital artist and luxury brand owner, featuring a modern "Lavender Soul" aesthetic with dark modes, glassmorphism, and smooth animations.

## 🚀 Features

- **Dynamic Profile Header**: Displays user avatar, verification badge, and interactive profile details.
- **Real-time Data Sync**: Fetches and updates profile information from a backend API (`leohub_api`).
- **Interactive Stat Bar**: Viewable metrics for Posts, Followers, and Following.
- **Edit Profile Modal**: A comprehensive form to update personal details (Name, Bio, Location, Website, etc.) with a sleek slide-up animation.
- **Story Highlights**: Horizontal scroll of curated brand highlights with interactive placeholders.
- **Post Grid**: A responsive 3-column grid displaying high-quality post previews with depth effects.
- **Sub-page System**: Modular pop-ups for Settings, Activity, and Post Details.
- **Rich Aesthetics**: Custom theme using deep purples (`#120D1D`) and lavender (`#C5B4E3`) with blurred background overlays.

## 🛠️ Technical Implementation

- **Framework**: Expo SDK 54 / React Native 0.81
- **Icons**: `@expo/vector-icons` (Ionicons, Feather, MaterialCommunityIcons, Octicons)
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
- **Animations**: React Native `Animated` API for fade-ins, scaling, and sliding transitions.
- **Polyfills**: `react-native-url-polyfill` for enhanced URL API support in Hermes.
- **Backend Integration**: RESTful API calls using `fetch` for data persistence.

## 📦 Installation & Setup

1. **Navigate to the task directory**:
   ```bash
   cd screens/Task7
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the application**:
   ```bash
   npx expo start
   ```

## 📸 Component Structure

- `ProfileScreen`: Main container managing global state and layout.
- `EditProfileModal`: Dedicated modal for user information management.
- `SubPage`: Reusable wrapper for secondary content views.
- `GridSection`: Optimized FlatList for displaying the post gallery.

---
*Created as part of the MyAssignment3 series.*
