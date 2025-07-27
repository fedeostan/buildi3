# Buildi3 📱

A modern React Native application built with Expo, featuring a comprehensive UI design system and clean architecture.

## 🚀 Overview

Buildi3 is a React Native mobile application that demonstrates best practices in:

- **Design System Architecture** - Reusable UI components following atomic design principles
- **TypeScript Integration** - Full type safety throughout the application
- **Modern React Native** - Built with Expo for fast development and deployment
- **Clean Code Structure** - Organized component hierarchy and theme system

## 🏗️ Project Structure

```
Buildi3/
├── Buildi3App/                 # Main React Native application
│   ├── app/                    # App screens and navigation
│   │   ├── _layout.tsx         # Root layout component
│   │   ├── index.tsx          # Home screen
│   │   └── devres.tsx         # Development resources
│   ├── components/             # Reusable UI components
│   │   └── ui/                # UI component library
│   │       ├── Button/        # Button component
│   │       ├── Typography/    # Text components
│   │       ├── DashboardHeader/ # Header with profile & notifications
│   │       ├── Icon/          # Icon components
│   │       ├── Input/         # Form input components
│   │       └── ...           # More UI components
│   ├── theme/                 # Design system theme
│   │   ├── colors.ts         # Color palette
│   │   ├── spacing.ts        # Spacing variables
│   │   └── index.ts          # Theme exports
│   ├── assets/               # Images, fonts, and static assets
│   └── package.json          # Dependencies and scripts
└── README.md                 # This file
```

## 🎨 UI Design System

The project includes a complete design system with:

### Components Available

- **Button** - Primary, secondary, and custom styled buttons
- **Typography** - Consistent text styles (h1-h6, body, caption)
- **DashboardHeader** - Header with user profile and notifications
- **Icon** - Scalable icon components
- **Input** - Form input fields with validation
- **TextArea** - Multi-line text input
- **Dropdown** - Selection dropdown component
- **Widget** - Card-like containers for content
- **ProfileIcon** - User avatar with notification badges
- **NotificationIcon** - Bell icon with count badges

### Theme System

- **Colors** - Centralized color palette
- **Spacing** - Consistent spacing variables
- **Typography** - Font sizes and weights

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fedeostan/buildi3.git
   cd Buildi3
   ```

2. **Navigate to the app directory**

   ```bash
   cd Buildi3App
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app on your phone
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 📱 Features

- **Modern UI/UX** - Clean, intuitive design
- **Component Library** - Reusable components following atomic design
- **TypeScript** - Full type safety and better developer experience
- **Responsive Design** - Works on various screen sizes
- **Theme Support** - Centralized styling system
- **Development Tools** - ESLint, TypeScript, and development utilities

## 🧩 Component Usage

### Example: Using the DashboardHeader

```tsx
import { DashboardHeader } from "./components/ui";

<DashboardHeader
  userName="Federico"
  hasNotifications={true}
  notificationCount={3}
  onProfilePress={() => console.log("Profile pressed")}
  onNotificationPress={() => console.log("Notifications pressed")}
/>;
```

### Example: Using the Button Component

```tsx
import { Button } from "./components/ui";

<Button
  variant="primary"
  size="large"
  onPress={() => console.log("Button pressed")}
>
  Click Me
</Button>;
```

## 🎯 Development Principles

- **Atomic Design** - Components are organized from atoms to organisms
- **Reusability** - Every component is designed to be reusable
- **Type Safety** - Comprehensive TypeScript integration
- **Performance** - Optimized for mobile performance
- **Accessibility** - Following React Native accessibility guidelines

## 🚀 Deployment

The app is built with Expo, making deployment straightforward:

1. **Build for production**

   ```bash
   expo build:android
   expo build:ios
   ```

2. **Publish updates**
   ```bash
   expo publish
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Federico Ostan** - _UX Designer & Developer_

- GitHub: [@fedeostan](https://github.com/fedeostan)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components inspired by modern design systems
- Following React Native best practices

---

**Happy Coding!** 🚀
