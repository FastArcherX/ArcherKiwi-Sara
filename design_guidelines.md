# ArcherKiwi Note-Taking App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from leading productivity apps like Notion, Obsidian, and Apple Notes to create a clean, focused note-taking experience that prioritizes usability and content clarity.

## Core Design Principles
- **Content-First**: Typography and readability are paramount
- **Distraction-Free**: Clean interface that keeps focus on writing
- **Mobile-Optimized**: Touch-friendly interface for Android users
- **AI-Enhanced**: Subtle integration of AI features without overwhelming the core experience

## Color Palette

### Light Mode
- **Primary**: 47 69% 58% (Modern teal-blue for trust and focus)
- **Background**: 0 0% 98% (Near-white for content clarity)
- **Surface**: 0 0% 100% (Pure white for note cards)
- **Text Primary**: 220 13% 18% (Dark charcoal for readability)
- **Text Secondary**: 220 9% 46% (Medium gray for metadata)
- **Border**: 220 13% 91% (Light gray for subtle divisions)

### Dark Mode
- **Primary**: 47 69% 68% (Slightly brighter teal for dark backgrounds)
- **Background**: 220 13% 8% (Deep charcoal)
- **Surface**: 220 13% 12% (Elevated dark gray for note cards)
- **Text Primary**: 0 0% 95% (Near-white for readability)
- **Text Secondary**: 220 9% 70% (Light gray for metadata)
- **Border**: 220 13% 18% (Dark borders for subtle divisions)

### Accent Colors
- **Success**: 142 76% 36% (Green for saved states)
- **Warning**: 38 92% 50% (Orange for alerts)
- **AI Accent**: 280 100% 70% (Purple for AI features)

## Typography
- **Primary Font**: Inter (Google Fonts) - excellent readability for UI text
- **Editor Font**: JetBrains Mono (Google Fonts) - for code blocks and structured content
- **Headings**: Inter 600-700 weight
- **Body**: Inter 400-500 weight
- **UI Elements**: Inter 500 weight

## Layout System
**Spacing Scale**: Consistent use of Tailwind units 2, 4, 6, 8, 12, 16
- Tight spacing (p-2, m-2) for compact UI elements
- Standard spacing (p-4, m-4) for general padding/margins
- Generous spacing (p-8, m-8) for section separation
- Large spacing (p-16) for major layout divisions

## Component Library

### Navigation
- **Sidebar**: Collapsible folder tree with note organization
- **Toolbar**: Rich text formatting controls (bold, italic, lists, headers)
- **Search Bar**: Prominent search with live filtering

### Core Components
- **Note Cards**: Clean cards with title, preview, and metadata
- **Editor**: Full-screen writing mode with formatting toolbar
- **AI Panel**: Slide-out panel for AI suggestions and tools
- **Voice Recorder**: Floating action button for speech-to-text

### Mobile Adaptations
- **Bottom Navigation**: Quick access to create, search, folders, settings
- **Swipe Gestures**: Archive, delete, and organize notes
- **Touch Targets**: Minimum 44px for all interactive elements

## Interaction Patterns
- **Auto-save**: Subtle indicators showing save status
- **Folder Management**: Drag-and-drop organization
- **AI Integration**: Contextual suggestions that don't interrupt writing flow
- **Voice Notes**: One-tap recording with visual feedback

## Visual Hierarchy
- **Note Titles**: Large, bold typography
- **Content Preview**: Subtle gray text with line clamping
- **Metadata**: Small, muted text for dates and tags
- **AI Features**: Purple accent badges for AI-enhanced content

## Progressive Web App Features
- **Install Prompt**: Clean banner encouraging app installation
- **Offline Indicator**: Status bar showing connectivity
- **Loading States**: Skeleton screens for content loading

This design creates a professional, distraction-free environment that rivals native note-taking apps while leveraging modern web capabilities for cross-platform accessibility.