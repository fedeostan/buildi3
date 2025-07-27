# React Native Mobile App Development Rules

## PROJECT PHILOSOPHY

**Frontend First Approach**: Always start with visible UI components so you can see and learn immediately. Build the interface first, then add functionality. This ensures rapid visual feedback and better learning experience.

## NAMING CONVENTIONS

### Files and Directories

```typescript
// ✅ GOOD: Components use PascalCase
components / UserProfile.tsx; // React Native component
ChatScreen.tsx; // Screen component
LoginButton.tsx; // UI component

// ✅ GOOD: Utilities and helpers use camelCase
utils / apiHelpers.ts; // API utility functions
dateFormatters.ts; // Date formatting utilities
validationRules.ts; // Form validation helpers

// ✅ GOOD: Types and interfaces
types / UserTypes.ts; // Type definitions
ApiTypes.ts; // API response types
```

### Code Elements

```typescript
// ✅ GOOD: Component names in PascalCase
const UserProfile = () => {};
const ChatMessage = () => {};

// ✅ GOOD: Function names in camelCase
const sendMessage = () => {};
const formatDate = () => {};
const validateEmail = () => {};

// ✅ GOOD: Constants in UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
const MAX_MESSAGE_LENGTH = 500;
const DEFAULT_TIMEOUT = 30000;

// ✅ GOOD: Props interfaces with 'Props' suffix
interface ChatMessageProps {
  message: string;
  userId: string;
  timestamp: Date;
}
```

## ERROR HANDLING PATTERNS

### Always Handle Errors Gracefully

```typescript
// ✅ EXCELLENT: Complete error handling with user feedback
const fetchUserData = async (userId: string) => {
  try {
    // Log what we're doing for debugging
    console.log("Fetching user data for:", userId);

    // Make the Supabase query
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    // Check for database errors first
    if (error) {
      console.error("Database error:", error.message);
      // Return structured error response
      return {
        success: false,
        error: error.message,
        userMessage: "Unable to load user profile. Please try again.",
      };
    }

    // Success case - return the data
    return { success: true, data };
  } catch (error) {
    // Catch any unexpected errors
    console.error("Unexpected error in fetchUserData:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
      userMessage: "Something went wrong. Please try again later.",
    };
  }
};

// ✅ GOOD: Use the error handling in components
const UserProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = async () => {
    setLoading(true);
    setError("");

    const result = await fetchUserData("user-123");

    if (result.success) {
      setUser(result.data);
    } else {
      // Show user-friendly error message
      setError(result.userMessage || "Failed to load user");
    }

    setLoading(false);
  };

  // Always show loading and error states visually
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadUser} />;

  return <UserProfile user={user} />;
};
```

## SUPABASE INTEGRATION PATTERNS

### Simple Supabase Setup

```typescript
// ✅ GOOD: Clean Supabase client setup
import { createClient } from "@supabase/supabase-js";

// Create the Supabase client (put this in a separate file like supabase.ts)
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!, // Your Supabase project URL
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! // Your Supabase anon key
);

export default supabase;
```

### Authentication Helpers

```typescript
// ✅ EXCELLENT: Authentication functions with complete error handling
export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google sign in...");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google auth error:", error.message);
      return {
        success: false,
        error: error.message,
        userMessage: "Failed to sign in with Google. Please try again.",
      };
    }

    console.log("Google sign in successful");
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected auth error:", error);
    return {
      success: false,
      error: "Unexpected error",
      userMessage: "Sign in failed. Please try again.",
    };
  }
};

// ✅ GOOD: Check if user is authenticated
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Unexpected error getting user:", error);
    return null;
  }
};
```

## REACT NATIVE REUSABLES USAGE

### Always Use Design System Components First

```typescript
// ✅ EXCELLENT: Import from React Native Reusables UI library
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

// ✅ GOOD: Create reusable components with proper props
interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}

const LoginForm = ({ onLogin, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // Validate inputs before submitting
    if (!email || !password) {
      console.log("Missing email or password");
      return;
    }

    // Call the parent function with the form data
    onLogin(email, password);
  };

  return (
    <Card className="p-4 m-4">
      {/* Email input with proper styling */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="mb-4"
      />

      {/* Password input with security */}
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="mb-4"
      />

      {/* Submit button with loading state */}
      <Button
        variant="default"
        onPress={handleSubmit}
        disabled={isLoading || !email || !password}
        className="w-full"
      >
        <Text>{isLoading ? "Signing In..." : "Sign In"}</Text>
      </Button>
    </Card>
  );
};
```

## MOBILE-SPECIFIC BEST PRACTICES

### Screen Layout and Safety

```typescript
// ✅ EXCELLENT: Proper mobile screen structure
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'

const ChatScreen = () => {
  return (
    {/* SafeAreaView prevents content from going under status bar/notch */}
    <SafeAreaView className="flex-1 bg-white">
      {/* KeyboardAvoidingView prevents keyboard from covering input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Your screen content goes here */}
        <View className="flex-1 px-4">
          {/* Screen content */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
```

### Loading States and Network Handling

```typescript
// ✅ EXCELLENT: Always show loading states
const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Load messages function
  const loadMessages = async () => {
    try {
      console.log("Loading messages...");
      setError(""); // Clear any previous errors

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading messages:", error.message);
        setError("Failed to load messages");
        return;
      }

      setMessages(data || []);
      console.log("Messages loaded successfully:", data?.length);
    } catch (error) {
      console.error("Unexpected error loading messages:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull-to-refresh functionality
  const handleRefresh = () => {
    setRefreshing(true);
    loadMessages();
  };

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  // Show loading spinner on first load
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Loading messages...</Text>
      </View>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <Button onPress={loadMessages}>
          <Text>Try Again</Text>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <MessageCard message={item} />}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
};
```

## DEVELOPMENT WORKFLOW

### 1. Start with UI Mockups (Frontend First)

```typescript
// ✅ STEP 1: Build screens with fake data first
const ProfileScreen = () => {
  // Start with mock data to see the UI immediately
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://via.placeholder.com/100",
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        {/* Profile header with mock data */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: mockUser.avatar }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold">{mockUser.name}</Text>
          <Text className="text-gray-600">{mockUser.email}</Text>
        </View>

        {/* Profile actions */}
        <Button className="mb-4">
          <Text>Edit Profile</Text>
        </Button>
        <Button variant="outline">
          <Text>Settings</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
```

### 2. Add Navigation

```typescript
// ✅ STEP 2: Connect screens with navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Replace Mocks with Real Data

```typescript
// ✅ STEP 3: Replace mock data with Supabase calls
const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace mock data with real API call
    const loadUserProfile = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;

  return (
    // Same UI as before, but with real data
    <ProfileView user={user} />
  );
};
```

## COMMENTS AND DOCUMENTATION

### Always Explain Your Code

```typescript
// ✅ EXCELLENT: Comments explain WHY, not just WHAT
const MessageCard = ({ message }: MessageCardProps) => {
  // Format the timestamp to show relative time (e.g., "2 hours ago")
  // This makes it easier for users to understand when messages were sent
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
  });

  // Check if this message was sent by the current user
  // We need to style it differently (right-aligned, different color)
  const isCurrentUser = message.user_id === currentUserId;

  return (
    <View
      className={cn(
        "mb-4 px-4",
        // Right-align messages from current user, left-align others
        isCurrentUser ? "items-end" : "items-start"
      )}
    >
      <View
        className={cn(
          "max-w-[80%] p-3 rounded-lg",
          // Different background colors for current user vs others
          isCurrentUser ? "bg-blue-500" : "bg-gray-200"
        )}
      >
        <Text
          className={cn(
            "text-base",
            // White text on blue background, dark text on gray background
            isCurrentUser ? "text-white" : "text-gray-900"
          )}
        >
          {message.content}
        </Text>

        {/* Show timestamp below message */}
        <Text
          className={cn(
            "text-xs mt-1",
            isCurrentUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          {timeAgo}
        </Text>
      </View>
    </View>
  );
};
```

### Function Documentation

```typescript
/**
 * Sends a new message to the chat
 *
 * @param content - The text content of the message
 * @param chatId - The ID of the chat room
 * @param userId - The ID of the user sending the message
 * @returns Promise with success/error result
 *
 * Example usage:
 * const result = await sendMessage("Hello world!", "chat-123", "user-456")
 * if (result.success) {
 *   console.log("Message sent!")
 * }
 */
const sendMessage = async (
  content: string,
  chatId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate input parameters
    if (!content.trim()) {
      return { success: false, error: "Message cannot be empty" };
    }

    // Insert message into Supabase database
    const { error } = await supabase.from("messages").insert({
      content: content.trim(),
      chat_id: chatId,
      user_id: userId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Database error sending message:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
};
```

## KEY PRINCIPLES TO REMEMBER

1. **Visual First**: Always build UI components first so you can see results immediately
2. **Simple Code**: Write code that beginners can understand and modify
3. **Error Handling**: Every API call must handle errors gracefully
4. **Loading States**: Always show loading spinners and error messages
5. **Reusable Components**: Build a design system with consistent components
6. **Mobile Optimized**: Use SafeAreaView, KeyboardAvoidingView, and proper mobile patterns
7. **Comprehensive Comments**: Explain WHY you're doing something, not just what
8. **Real Device Testing**: Test on actual phones, not just simulators
9. **Figma**: We are using reausable component that comes from a figma design system, remember always to follow the variables in all cases, color and different components, check if we dont have the existing component before creating a new one and check for existing color variables before creating a new one. Im using feather icons, so just read the icon name and you will find it.
10. **No Duplicates**: Avoid duplicating files, always read the entire code base and see where to add each content.
11. **Cursor Workflow**: Always complete all your todo list before stoping the agentic flow. We have a lot of variables and components already, and we will have more, always search the entire codebase to see if you have everything you need, and only if you dont, then create. We already have spacing and color variables so use them. Also if you create new things, follow proper structure.

Remember: The goal is to learn by seeing. Build the interface first, then add the data and functionality. This way, you can always see your progress and understand what's happening.
