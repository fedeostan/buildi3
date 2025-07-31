import React, { useState } from "react";
import { ScrollView, View, SafeAreaView, TouchableOpacity } from "react-native";
import {
  Typography,
  Button,
  Widget,
  DashboardHeader,
  Input,
  TextArea,
  Dropdown,
  Spinner,
} from "../../components";
import { colors } from "../../theme";

export default function DevRes() {
  // State for input demos
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [commentsValue, setCommentsValue] = useState("");

  // Dropdown state
  const [countryValue, setCountryValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  // Spinner state
  const [isSpinnerAnimating, setIsSpinnerAnimating] = useState(true);

  // Sample dropdown options
  const countryOptions = [
    { id: "us", label: "United States", value: "us" },
    { id: "ca", label: "Canada", value: "ca" },
    { id: "mx", label: "Mexico", value: "mx" },
    { id: "uk", label: "United Kingdom", value: "uk" },
    { id: "fr", label: "France", value: "fr" },
    { id: "de", label: "Germany", value: "de" },
    { id: "jp", label: "Japan", value: "jp" },
    { id: "au", label: "Australia", value: "au" },
  ];

  const priorityOptions = [
    { id: "low", label: "Low Priority", value: "low" },
    { id: "medium", label: "Medium Priority", value: "medium" },
    { id: "high", label: "High Priority", value: "high" },
    { id: "urgent", label: "Urgent", value: "urgent" },
  ];

  const categoryOptions = [
    { id: "work", label: "Work", value: "work" },
    { id: "personal", label: "Personal", value: "personal" },
    { id: "shopping", label: "Shopping", value: "shopping" },
    { id: "health", label: "Health", value: "health" },
    { id: "travel", label: "Travel", value: "travel" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Typography
            variant="h1"
            style={{ marginBottom: 8, color: colors.text }}
          >
            🛍️ Dev Resources
          </Typography>
          <Typography
            variant="bodyMedium"
            style={{ color: colors.textSecondary }}
          >
            Explore your design system components - like browsing stores in a
            mall!
          </Typography>
        </View>

        {/* Main Components Store */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            🏪 Main Components Store
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/index.ts
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              Main directory - points you to the UI section
            </Typography>

            <View
              style={{
                backgroundColor: colors.background,
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
              }}
            >
              <Typography variant="code" style={{ color: colors.text }}>
                export * from "./ui";
              </Typography>
            </View>
          </View>
        </View>

        {/* UI Components Department */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            🎨 UI Components Department
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/ui/index.ts
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              UI department - lists all available components
            </Typography>

            <View style={{ gap: 12 }}>
              {/* Typography Store */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.background,
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.primary + "20",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Typography
                    variant="labelLarge"
                    style={{ color: colors.text, flex: 1 }}
                  >
                    📝 Typography Store
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.primary }}
                  >
                    Available ✅
                  </Typography>
                </View>
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary, marginBottom: 8 }}
                >
                  components/ui/Typography/
                </Typography>
                <Typography
                  variant="code"
                  style={{ color: colors.textTertiary }}
                >
                  export default from "./Typography"
                </Typography>
              </TouchableOpacity>

              {/* Button Store */}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.background,
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.primary + "20",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Typography
                    variant="labelLarge"
                    style={{ color: colors.text, flex: 1 }}
                  >
                    🔘 Button Store
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.primary }}
                  >
                    Available ✅
                  </Typography>
                </View>
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary, marginBottom: 8 }}
                >
                  components/ui/Button/
                </Typography>
                <Typography
                  variant="code"
                  style={{ color: colors.textTertiary }}
                >
                  export default from "./Button"
                </Typography>
              </TouchableOpacity>

              {/* Future Components */}
              <View
                style={{
                  backgroundColor: colors.background,
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.textTertiary + "20",
                  opacity: 0.6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Typography
                    variant="labelLarge"
                    style={{ color: colors.textSecondary, flex: 1 }}
                  >
                    📋 Input Store
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textTertiary }}
                  >
                    Coming Soon
                  </Typography>
                </View>
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textTertiary, fontStyle: "italic" }}
                >
                  // export default from "./Input"
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Live Demo Section */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            🎬 Live Component Demo
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              gap: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary }}
            >
              See your components in action:
            </Typography>

            {/* Typography Demo */}
            <View style={{ gap: 8 }}>
              <Typography variant="h6" style={{ color: colors.text }}>
                Typography Variants:
              </Typography>
              <Typography variant="h1" style={{ color: colors.text }}>
                H1 Heading
              </Typography>
              <Typography variant="h3" style={{ color: colors.text }}>
                H3 Heading
              </Typography>
              <Typography
                variant="bodyLarge"
                style={{ color: colors.textSecondary }}
              >
                Body Large Text
              </Typography>
              <Typography
                variant="bodySmall"
                style={{ color: colors.textTertiary }}
              >
                Body Small Text
              </Typography>
            </View>

            {/* Button Demo */}
            <View style={{ gap: 8 }}>
              <Typography variant="h6" style={{ color: colors.text }}>
                Button Variants:
              </Typography>
              <Button variant="primary" title="Primary Button" />
              <Button variant="secondary" title="Secondary Button" />
              <Button variant="text" title="Text Button" />
            </View>
          </View>
        </View>

        {/* Widget Component Demo */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            🧩 New Widget Component (Atomic Design)
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/ui/Widget/ (Organism)
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              Reusable skeleton component built with atomic design principles.
              Combines WidgetTitle + SwapItem + Button molecules.
            </Typography>

            {/* Live Widget Demo */}
            <Widget
              title="Widget Demo"
              actionText="View All"
              buttonText="Secondary Button"
              onActionPress={() => console.log("Action pressed!")}
              onButtonPress={() => console.log("Button pressed!")}
              placeholderText="This is where content will be swapped in!"
            />
          </View>

          {/* Widget with Custom Content */}
          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              Example with custom content (this will replace "Swap Item"):
            </Typography>

            <Widget
              title="Custom Content Widget"
              hasAction={false}
              buttonText="Primary Action"
              buttonVariant="primary"
              onButtonPress={() => console.log("Primary action!")}
            >
              <View style={{ alignItems: "center", gap: 8 }}>
                <Typography variant="h6" style={{ color: colors.text }}>
                  🎯 Custom Content Here
                </Typography>
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary, textAlign: "center" }}
                >
                  Later this could be a list, form, chart, or any other
                  component!
                </Typography>
              </View>
            </Widget>
          </View>
        </View>

        {/* NEW: Dashboard Header Component Demo */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            🏗️ Dashboard Header (Atomic Design)
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/ui/DashboardHeader/ (Organism)
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              Dashboard header following Atomic Design principles:
              {"\n"}• ProfileIcon (Atom) - User avatar with initials
              {"\n"}• NotificationIcon (Atom) - Bell with notification badge
              {"\n"}• Typography (Atom) - Date and greeting text
              {"\n"}• Spacing variables from design system
            </Typography>

            {/* Live Dashboard Header Demo - No Notifications */}
            <View style={{ marginBottom: 16 }}>
              <Typography
                variant="bodySmall"
                style={{ color: colors.textSecondary, marginBottom: 8 }}
              >
                Without Notifications:
              </Typography>
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <DashboardHeader
                  userName="Federico"
                  hasNotifications={false}
                  onProfilePress={() => console.log("Profile pressed!")}
                  onNotificationPress={() =>
                    console.log("Notifications pressed!")
                  }
                />
              </View>
            </View>

            {/* Live Dashboard Header Demo - With Notifications */}
            <View>
              <Typography
                variant="bodySmall"
                style={{ color: colors.textSecondary, marginBottom: 8 }}
              >
                With Notifications (3):
              </Typography>
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <DashboardHeader
                  userName="Federico"
                  hasNotifications={true}
                  notificationCount={3}
                  onProfilePress={() => console.log("Profile pressed!")}
                  onNotificationPress={() =>
                    console.log("Notifications pressed!")
                  }
                />
              </View>
            </View>
          </View>
        </View>

        {/* NEW: Dropdown Component Demo */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            📋 Dropdown Component (Bottom Sheet + Figma Design)
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/ui/Dropdown/ (Atom)
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              Mobile-first dropdown with native bottom sheet:
              {"\n"}• Matches exact Input field Figma design with chevron
              {"\n"}• Opens smooth bottom sheet instead of dropdown menu
              {"\n"}• Perfect for mobile UX - no tiny dropdown menus!
              {"\n"}• All states: default, filled, success, error
              {"\n"}• Powered by @gorhom/bottom-sheet (industry standard)
            </Typography>

            {/* Interactive Dropdown Demo */}
            <View style={{ gap: 16 }}>
              <Typography
                variant="h6"
                style={{ color: colors.text, marginBottom: 8 }}
              >
                🎯 Interactive Demo - Tap to see bottom sheet!
              </Typography>

              {/* Country Dropdown */}
              <Dropdown
                label="Country"
                options={countryOptions}
                value={countryValue}
                onSelect={(option) =>
                  setCountryValue(option.value || option.id)
                }
                placeholder="Select your country"
                bottomSheetTitle="Choose your country"
              />

              {/* Priority with Success */}
              <Dropdown
                label="Priority"
                options={priorityOptions}
                value={priorityValue}
                onSelect={(option) =>
                  setPriorityValue(option.value || option.id)
                }
                successMessage={
                  priorityValue ? "Priority level set!" : undefined
                }
              />

              {/* Category with Error */}
              <Dropdown
                label="Category"
                options={categoryOptions}
                value={categoryValue}
                onSelect={(option) =>
                  setCategoryValue(option.value || option.id)
                }
                errorMessage={
                  !categoryValue ? "Category is required" : undefined
                }
              />
            </View>
          </View>

          {/* State Examples */}
          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              🎨 All Dropdown States from Figma:
            </Typography>

            <View style={{ gap: 12 }}>
              {/* Default State */}
              <Dropdown
                label="Default State"
                options={[
                  { id: "1", label: "Option 1" },
                  { id: "2", label: "Option 2" },
                  { id: "3", label: "Option 3" },
                ]}
                placeholder="Select an option"
              />

              {/* Filled State */}
              <Dropdown
                label="Filled State"
                options={[
                  { id: "1", label: "Option 1" },
                  { id: "2", label: "Option 2" },
                ]}
                value="1"
              />

              {/* Success State */}
              <Dropdown
                label="Success State"
                options={priorityOptions}
                value="high"
                successMessage="Perfect choice!"
              />

              {/* Error State */}
              <Dropdown
                label="Error State"
                options={priorityOptions}
                errorMessage="This field is mandatory!"
              />

              {/* Disabled State */}
              <Dropdown
                label="Disabled State"
                options={priorityOptions}
                value="medium"
                disabled
              />
            </View>
          </View>
        </View>

        {/* NEW: Input Components Demo */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            📝 Input Components (React Native + Figma Design)
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/ui/Input/ & TextArea/ (Atoms)
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              React Native TextInput with your exact Figma design:
              {"\n"}• All states: default, focus, filled, success, error
              {"\n"}• Floating labels, proper accessibility
              {"\n"}• Custom cursor color (#FF8B7B from Figma)
              {"\n"}• Focus background (#E8EBF2 from Figma)
              {"\n"}• Perfect typography matching (Inter font, exact spacing)
            </Typography>

            {/* Input States Demo */}
            <View style={{ gap: 16 }}>
              <Typography
                variant="h6"
                style={{ color: colors.text, marginBottom: 8 }}
              >
                🎯 Interactive Demo - Try typing!
              </Typography>

              {/* Basic Input */}
              <Input
                label="Name"
                placeholder="Enter your name"
                value={nameValue}
                onChangeText={setNameValue}
              />

              {/* Email with Success */}
              <Input
                label="Email"
                placeholder="your@email.com"
                value={emailValue}
                onChangeText={setEmailValue}
                keyboardType="email-address"
                autoCapitalize="none"
                successMessage={
                  emailValue.includes("@") ? "Valid email format!" : undefined
                }
              />

              {/* Password with Error */}
              <Input
                label="Password"
                placeholder="Enter password"
                value={passwordValue}
                onChangeText={setPasswordValue}
                secureTextEntry
                errorMessage={
                  passwordValue.length > 0 && passwordValue.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined
                }
              />

              {/* TextArea Basic */}
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself..."
                value={bioValue}
                onChangeText={setBioValue}
                maxLength={200}
                showCharacterCount
              />

              {/* TextArea with Custom Height */}
              <TextArea
                label="Comments"
                placeholder="Leave your comments here..."
                value={commentsValue}
                onChangeText={setCommentsValue}
                minHeight={120}
                maxHeight={200}
              />
            </View>
          </View>

          {/* State Examples */}
          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              🎨 All States from Figma Design:
            </Typography>

            <View style={{ gap: 12 }}>
              {/* Default State - shows only label as placeholder */}
              <Input label="Default State" />

              {/* Default State with custom placeholder */}
              <Input label="Email" placeholder="Enter your email address" />

              {/* Filled State */}
              <Input label="Filled State" value="Federico" />

              {/* Success State */}
              <Input
                label="Success State"
                value="validation@passed.com"
                successMessage="Great! This looks good."
              />

              {/* Error State */}
              <Input
                label="Error State"
                value="invalid-email"
                errorMessage="Please enter a valid email address."
              />

              {/* Disabled State */}
              <Input label="Disabled State" value="Cannot edit this" disabled />
            </View>
          </View>
        </View>

        {/* NEW: Spinner Component Demo */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            ⚡ Custom Spinner Component (Figma Design)
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 12 }}
            >
              📍 components/ui/Spinner/ (Atom)
            </Typography>
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              Custom loading spinner matching your Figma design exactly:
              {"\n"}• Ring that rotates and pulses but never fully closes
              {"\n"}• Smooth animations inspired by One UI & Material M3
              {"\n"}• Uses design system colors (#495D92 default)
              {"\n"}• Size variants: small (24px), medium (32px), large (48px)
              {"\n"}• Replaces React Native's ActivityIndicator
              {"\n"}• Built with react-native-svg for crisp rendering
            </Typography>

            {/* Interactive Spinner Demo */}
            <View style={{ gap: 16 }}>
              <Typography
                variant="h6"
                style={{ color: colors.text, marginBottom: 8 }}
              >
                🎯 Interactive Demo
              </Typography>

              {/* Size Variants */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: colors.background,
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Spinner size="small" animating={isSpinnerAnimating} />
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textSecondary, marginTop: 8 }}
                  >
                    Small
                  </Typography>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Spinner size="medium" animating={isSpinnerAnimating} />
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textSecondary, marginTop: 8 }}
                  >
                    Medium
                  </Typography>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Spinner size="large" animating={isSpinnerAnimating} />
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textSecondary, marginTop: 8 }}
                  >
                    Large
                  </Typography>
                </View>
              </View>

              {/* Color Variants */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: colors.background,
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Spinner
                    size="medium"
                    color={colors.buttonPrimary}
                    animating={isSpinnerAnimating}
                  />
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textSecondary, marginTop: 8 }}
                  >
                    Primary
                  </Typography>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Spinner
                    size="medium"
                    color={colors.actionText}
                    animating={isSpinnerAnimating}
                  />
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textSecondary, marginTop: 8 }}
                  >
                    Action
                  </Typography>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Spinner
                    size="medium"
                    color={colors.success}
                    animating={isSpinnerAnimating}
                  />
                  <Typography
                    variant="bodySmall"
                    style={{ color: colors.textSecondary, marginTop: 8 }}
                  >
                    Success
                  </Typography>
                </View>
              </View>

              {/* Animation Control */}
              <Button
                variant="secondary"
                title={
                  isSpinnerAnimating ? "Stop Animation" : "Start Animation"
                }
                onPress={() => setIsSpinnerAnimating(!isSpinnerAnimating)}
              />

              {/* Usage in Button */}
              <View style={{ marginTop: 8 }}>
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary, marginBottom: 8 }}
                >
                  🔘 Already integrated in Button component:
                </Typography>
                <Button
                  variant="primary"
                  title="Loading Button"
                  loading={true}
                />
              </View>
            </View>
          </View>

          {/* Technical Details */}
          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Typography
              variant="bodySmall"
              style={{ color: colors.textTertiary, marginBottom: 16 }}
            >
              🛠️ Technical Implementation:
            </Typography>

            <View style={{ gap: 8 }}>
              <Typography
                variant="code"
                style={{
                  color: colors.text,
                  backgroundColor: colors.background,
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                &lt;Spinner size="medium" color={colors.primary} /&gt;
              </Typography>

              <Typography
                variant="bodySmall"
                style={{ color: colors.textSecondary, marginTop: 8 }}
              >
                • 3 layered animations: rotation (1.2s), arc length (1.8s),
                radius (2s)
                {"\n"}• Native driver for smooth 60fps rotation
                {"\n"}• Ring spans 10% to 85% but never closes completely
                {"\n"}• Proportional stroke width based on size
                {"\n"}• SVG-based for crisp rendering at any density
              </Typography>
            </View>
          </View>
        </View>

        {/* Theme Colors Reference */}
        <View style={{ marginBottom: 32 }}>
          <Typography
            variant="h5"
            style={{
              color: colors.text,
              marginBottom: 16,
            }}
          >
            🎨 Theme Colors Store
          </Typography>

          <View
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Typography
              variant="labelMedium"
              style={{ color: colors.textSecondary, marginBottom: 16 }}
            >
              📍 theme/colors.ts
            </Typography>

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    marginBottom: 4,
                  }}
                />
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary }}
                >
                  primary
                </Typography>
              </View>

              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.success,
                    borderRadius: 8,
                    marginBottom: 4,
                  }}
                />
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary }}
                >
                  success
                </Typography>
              </View>

              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.backgroundSecondary,
                    borderRadius: 8,
                    marginBottom: 4,
                    borderWidth: 1,
                    borderColor: colors.textTertiary + "30",
                  }}
                />
                <Typography
                  variant="bodySmall"
                  style={{ color: colors.textSecondary }}
                >
                  bg-2nd
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
