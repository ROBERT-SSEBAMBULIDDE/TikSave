# Architecture Overview

## Overview

This application is a TikTok video downloader service named "SamaBrains TikTok Downloader". It allows users to download TikTok videos without watermarks in various formats (mp4, mp3, webm) and quality options. The application follows a modern web architecture with a clear separation between the client and server components.

## System Architecture

The system follows a client-server architecture with the following high-level components:

1. **Frontend**: A React-based single-page application (SPA) built with TypeScript and styled using Tailwind CSS and shadcn/ui components.
2. **Backend**: A Node.js Express server that handles API requests, processes TikTok videos, and serves the frontend assets.
3. **Database**: PostgreSQL database via Neon Serverless accessed through Drizzle ORM for storing user data and download history.
4. **File Processing**: Server-side processing to remove watermarks from TikTok videos using video manipulation tools.

### Architecture Diagram

```
┌─────────────────┐        ┌────────────────────┐       ┌─────────────────┐
│                 │        │                    │       │                 │
│    Frontend     │◄─────► │ Backend API Server │◄─────►│    Database     │
│  (React + Vite) │        │  (Express + Node)  │       │  (PostgreSQL)   │
│                 │        │                    │       │                 │
└─────────────────┘        └────────────────────┘       └─────────────────┘
                                     │
                                     ▼
                           ┌─────────────────────┐
                           │                     │
                           │  TikTok Processing  │
                           │     (ffmpeg)        │
                           │                     │
                           └─────────────────────┘
```

## Key Components

### Frontend

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components (based on Radix UI primitives)
- **State Management**: React Query for server state management
- **Routing**: wouter for lightweight client-side routing
- **Build Tool**: Vite
- **Directory Structure**:
  - `client/src/components/`: UI components including shared components and page-specific components
  - `client/src/pages/`: Application views/pages
  - `client/src/lib/`: Utility functions, types, and API client code
  - `client/src/hooks/`: Custom React hooks

### Backend

- **Framework**: Express.js on Node.js
- **API Design**: RESTful API endpoints
- **File Processing**: Video processing using ffmpeg (referenced in configuration files)
- **Directory Structure**:
  - `server/`: Express application with routes, middleware, and business logic
  - `server/routes.ts`: API route definitions
  - `server/tiktok.ts`: TikTok video processing logic
  - `server/db.ts`: Database connection and setup

### Database

- **Engine**: PostgreSQL (via Neon Serverless)
- **ORM**: Drizzle ORM
- **Schema Definition**: `shared/schema.ts` defines the database tables and validation schemas
- **Key Tables**:
  - `users`: User authentication information
  - `tiktok_videos`: Stores information about downloaded videos
  - Future tables for download history

### Shared Code

- **Directory**: `shared/`
- **Purpose**: Contains code shared between frontend and backend, such as:
  - Database schema definitions
  - Type definitions
  - Validation schemas using Zod

## Data Flow

### Video Download Process

1. **URL Submission**:
   - User enters a TikTok video URL in the frontend UI
   - Frontend validates the URL format
   - URL is sent to the `/api/tiktok/info` endpoint

2. **Video Information Retrieval**:
   - Backend fetches video metadata from TikTok
   - Information is returned to the client (title, author, thumbnail)
   - User can select format and quality options

3. **Video Processing**:
   - User initiates download with selected options
   - Request sent to `/api/tiktok/download` endpoint
   - Backend processes the video to remove watermarks
   - Processed video is stored temporarily

4. **Download Delivery**:
   - Backend serves the processed video file to the user
   - Download history is recorded in the database
   - Temporary files are cleaned up

## External Dependencies

### Frontend Dependencies

- **UI Components**: Radix UI primitives with shadcn/ui styling
- **HTTP Client**: Built-in fetch API wrapped with custom utilities
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies

- **Web Framework**: Express
- **Database**: Neon Serverless PostgreSQL client and Drizzle ORM
- **Media Processing**: ffmpeg for video manipulation
- **HTTP Client**: node-fetch for making requests to TikTok
- **File System**: Node.js fs module for temporary file storage

## Deployment Strategy

The application is configured for deployment on Replit, as indicated by the `.replit` configuration file:

1. **Development Mode**:
   - Uses `npm run dev` command to start a development server
   - Vite provides hot module replacement
   - Express serves API endpoints and forwards frontend requests to Vite

2. **Production Mode**:
   - Build process: `npm run build`
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: esbuild bundles server code to `dist/index.js`
   - Runtime: `npm run start` runs the bundled server which serves both API and static frontend assets

3. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: Determines environment (development/production)

4. **Database Migration**:
   - Drizzle handles schema migration through `db:push` command
   - Schema defined in `shared/schema.ts`

## Security Considerations

- User passwords are stored in the database, but the implementation of password hashing isn't shown in the provided code
- Express error handling is implemented to avoid exposing sensitive information
- No API authentication appears to be implemented currently

## Future Extensions

Based on the codebase structure, these areas are likely candidates for future expansion:

1. User authentication and account management
2. Enhanced video processing options
3. Expanded download history tracking
4. Support for additional social media platforms beyond TikTok