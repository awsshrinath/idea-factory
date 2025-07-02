# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Idea Factory is a full-stack content creation platform that combines a React/TypeScript frontend with an Express.js backend. The application generates AI-powered content (text, images, videos) for social media platforms, featuring authentication, scheduling, content management, and analytics capabilities.

## Architecture

### Monorepo Structure
- **Frontend**: React + TypeScript + Vite + shadcn/ui components in root directory
- **Backend**: Express.js + TypeScript in `/backend` directory
- **Shared Configuration**: Supabase integration for auth/database across both

### Frontend Stack (Root Directory)
- **Framework**: React 18 with TypeScript and Vite
- **UI**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, React hooks for local state
- **Authentication**: Supabase Auth with session management
- **Routing**: React Router v6 with protected routes

### Backend Stack (`/backend`)
- **Runtime**: Node.js with Express.js and TypeScript
- **Database**: Supabase (PostgreSQL) with service role access
- **Authentication**: JWT validation middleware for Supabase tokens
- **AI Services**: OpenAI GPT-4o for text/image generation
- **Content Processing**: Job queue system with worker processes
- **Social Media**: Instagram Basic Display API integration

## Development Commands

### Frontend (from root directory)
```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production (TypeScript + Vite)
npm run lint         # Run ESLint
npm run test         # Run Vitest tests
npm run preview      # Preview production build
```

### Backend (from `/backend` directory)
```bash
# No npm scripts available - backend uses direct commands or task management
# Check backend/package.json for available npm scripts if any
```

### Task Management System (Backend)
The backend uses a custom Notion integration for task management:
```bash
npm run task:next          # Get next task
npm run task:current       # Show current task
npm run task:complete      # Mark current task complete
npm run task:list          # List all tasks
npm run task:status        # Show task status
```

## Key Architectural Patterns

### Authentication Flow
1. **Frontend**: Supabase Auth UI components handle login/signup
2. **Session Management**: `SessionContextProvider` wraps the entire app
3. **Protected Routes**: `ProtectedRoute` component guards authenticated pages
4. **Backend Auth**: JWT middleware validates Supabase tokens on all protected endpoints
5. **Auto-logout**: 15-minute idle timeout with `useIdleTimeout` hook

### Content Generation Pipeline
1. **Request**: Frontend calls backend AI endpoints (`/api/v1/ai/*`)
2. **Processing**: Backend uses OpenAI GPT-4o for text and DALL-E for images
3. **Validation**: Content goes through quality and appropriateness checks
4. **Storage**: Media files stored in Supabase Storage buckets
5. **Scheduling**: Content queued for social media posting via cron jobs

### Error Handling Strategy
- **Frontend**: Global `ErrorBoundary` catches unhandled errors
- **Backend**: Express middleware with proper error responses
- **API Calls**: Retry logic with exponential backoff for network failures
- **User Feedback**: Toast notifications via Sonner library

### State Management Patterns
- **Server State**: React Query for API data with caching and background refetching
- **Auth State**: Custom `useAuth` hook wraps Supabase session
- **Form State**: React Hook Form with Zod validation
- **UI State**: Local component state and context for global UI concerns

## Database and Storage

### Supabase Integration
- **Authentication**: Row Level Security (RLS) policies protect user data
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: Media files in organized buckets with signed URLs
- **Edge Functions**: Server-side logic for complex operations

### Content Storage Structure
- Generated content stored with metadata and performance tracking
- Media files organized by content type and creation date
- User profiles linked to Supabase auth users with additional metadata

## API Design Patterns

### Backend Routes Structure
- `/api/v1/health` - Health check endpoint
- `/api/v1/ai/*` - Content generation endpoints
- `/api/v1/content/*` - Content management
- `/api/v1/scheduler/*` - Content scheduling
- `/api/v1/storage/*` - File upload/management
- `/api/v1/jobs/*` - Background job management

### Frontend API Integration
- Centralized `ApiClient` class handles all backend communication
- Custom hooks for specific API operations (`useContentGeneration`, `useFileUpload`)
- Automatic token attachment and refresh via Supabase session
- Request deduplication and response caching for performance

## Development Workflow

### Code Quality Standards
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Linting**: ESLint with React and TypeScript rules
- **Testing**: Vitest for unit tests, Testing Library for component tests
- **Formatting**: Prettier for consistent code style

### Component Architecture
- **UI Components**: Reusable shadcn/ui components in `/src/components/ui`
- **Feature Components**: Domain-specific components organized by feature
- **Page Components**: Route-level components in `/src/pages`
- **Layout Components**: Shared layouts and navigation

### Environment Configuration
- **Frontend**: Environment variables prefixed with `VITE_`
- **Backend**: Standard Node.js environment variables in `.env`
- **Supabase**: Separate anon key (frontend) and service role key (backend)

## Content Generation Features

### AI-Powered Content Creation
- Text generation using OpenAI GPT-4o with context-aware prompts
- Image generation with DALL-E 3 integration
- Content validation for appropriateness and quality
- Multi-platform optimization (Instagram, YouTube)

### Social Media Integration
- Instagram Basic Display API for account management
- Automated posting and scheduling capabilities
- Hashtag optimization and trend integration
- Performance analytics and engagement tracking

### Quality Assurance Pipeline
- Content uniqueness validation to prevent repetition
- Cultural sensitivity checks for appropriate content
- Technical quality assessment for media files
- Community feedback integration for continuous improvement

## Testing Strategy

### Frontend Testing
- Component testing with React Testing Library
- Hook testing for custom React hooks
- Integration testing for complete user flows
- Visual regression testing for UI components

### Backend Testing
- Unit tests for service functions and utilities
- Integration tests for API endpoints
- Database operation testing with test fixtures
- Mock external API dependencies for reliable testing

## Deployment and Production

### Frontend Deployment
- Static site generation optimized for modern browsers
- Environment-specific configuration management
- CDN integration for optimal performance
- Progressive Web App features for mobile experience

### Backend Deployment
- Express server with production optimizations
- Environment variable management for secrets
- Rate limiting and security middleware
- Health checks and monitoring endpoints

## Common Patterns and Conventions

### File Naming
- React components use PascalCase: `ContentForm.tsx`
- Utility functions use camelCase: `validateContent.ts`
- API routes use kebab-case: `content-generation.ts`
- Type definitions grouped in dedicated files

### Import Organization
- Third-party imports first
- Internal imports organized by relative path depth
- Type-only imports explicitly marked
- Barrel exports for clean public APIs

### Error Handling Conventions
- Consistent error response format across API endpoints
- User-friendly error messages in UI components
- Comprehensive logging for debugging and monitoring
- Graceful degradation for non-critical features

This documentation provides the foundation for efficient development and maintenance of the Idea Factory platform while ensuring code quality and architectural consistency.