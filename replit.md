# ArcherKiwi Note-Taking App

## Overview

ArcherKiwi is an intelligent note-taking application that combines the simplicity of traditional note editors with modern AI-powered features. The application is designed as a full-stack solution with a React frontend, Express.js backend, and PostgreSQL database, focusing on content-first design principles inspired by leading productivity apps like Notion, Obsidian, and Apple Notes.

The app features rich text editing capabilities, AI-powered content analysis (including image, PDF, audio, and YouTube video analysis), voice-to-text functionality, and a clean, mobile-optimized interface. The architecture supports both authenticated users through Firebase and guest users with local storage fallback.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system based on shadcn/ui components
- **State Management**: TanStack Query for server state management, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with proper error handling and middleware
- **File Handling**: Multer for file uploads with type validation (images, PDFs, audio files)
- **Development**: Hot reload with Vite integration for development server

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM schema management
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **File Storage**: Local filesystem with configurable upload directory
- **Development Fallback**: In-memory storage implementation for development/testing

### Authentication and Authorization
- **Primary Auth**: Firebase Authentication with Google OAuth integration
- **Fallback**: Simple header-based authentication for development
- **Session Management**: Express sessions with PostgreSQL persistence
- **User Context**: React Context API for auth state management throughout the app

### Database Schema Design
- **Users Table**: Basic user information with unique username constraints
- **Notes Table**: Core content storage with title, content, user association, and folder organization
- **Folders Table**: Organizational structure for note categorization
- **Relationships**: Foreign key relationships between users, notes, and folders with cascade handling

### AI Integration Architecture
- **AI Provider**: OpenAI GPT-5 integration for content analysis
- **Supported Analysis Types**: 
  - Image analysis with base64 encoding
  - PDF text extraction and summarization
  - Audio transcription and content analysis
  - YouTube video content analysis
  - Note summarization and key point extraction
- **Security**: Server-side API key management, no client-side AI credentials
- **Response Format**: Structured JSON responses with confidence scores and typed results

### Theme and Design System
- **Theme Management**: System/light/dark mode support with CSS custom properties
- **Design Tokens**: Comprehensive color system with HSL values for both light and dark modes
- **Typography**: Inter font family for UI, JetBrains Mono for code
- **Component Library**: Consistent design language with hover/active states and elevation system
- **Mobile Optimization**: Responsive design with touch-friendly interfaces

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL (Neon serverless for production deployment)
- **Authentication**: Firebase Authentication service
- **AI Services**: OpenAI API for content analysis and summarization

### Development and Build Tools
- **Build System**: Vite for frontend bundling and development server
- **TypeScript**: Full type coverage across frontend, backend, and shared schemas
- **ESBuild**: Backend bundling for production deployment
- **PostCSS**: CSS processing with Tailwind CSS integration

### Frontend Dependencies
- **UI Framework**: React with React DOM
- **Query Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React icon library

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **File Processing**: Multer for multipart form handling
- **Validation**: Zod schemas for runtime type validation
- **Session Management**: express-session with connect-pg-simple

### Firebase Integration
- **Authentication**: Firebase Auth with Google provider
- **Real-time Database**: Firebase Realtime Database for note synchronization (configurable)
- **Web SDK**: Firebase JavaScript SDK for client-side integration
- **React Hooks**: react-firebase-hooks for React integration

### AI and Media Processing
- **OpenAI**: Official OpenAI SDK for GPT model integration
- **Audio Processing**: Web Speech API for voice-to-text functionality
- **File Validation**: MIME type checking for uploaded media files
- **Content Analysis**: Structured prompt engineering for consistent AI responses