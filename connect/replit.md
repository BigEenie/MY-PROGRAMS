# University of Ibadan Social Platform

## Overview

This is a social media platform specifically designed for the University of Ibadan community. It allows students and lecturers to connect, share posts, and engage with each other through a department-focused social network. The platform is built using Flask (Python) with in-memory storage and provides basic social media functionality including user registration, post creation, image uploads, and social interactions.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Data Storage**: In-memory Python dictionaries (no persistent database)
- **Session Management**: Flask sessions with server-side storage
- **File Upload**: Local file system storage in `uploads/` directory
- **Image Processing**: PIL (Python Imaging Library) for image resizing and optimization

### Frontend Architecture
- **Templates**: Jinja2 templating engine
- **CSS Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.0.0
- **JavaScript**: Vanilla JavaScript for interactive features
- **Responsive Design**: Mobile-first approach using Bootstrap grid system

### Authentication System
- **Password Security**: Werkzeug password hashing
- **Session-based Authentication**: Flask sessions for user state management
- **Role-based Access**: Students, lecturers, and admin roles
- **Email Restriction**: Only @ui.edu.ng email addresses allowed

## Key Components

### User Management
- **User Model**: Stores user information including profile data, role, and department
- **Authentication**: Email-based login with password hashing
- **Profile Management**: Profile photos, bio, and personal information
- **Role System**: Different user types (student, lecturer, admin)

### Content Management
- **Post System**: Text posts with optional image attachments
- **Visibility Control**: Public posts and department-specific posts
- **Image Handling**: Automatic image resizing and format conversion
- **File Upload**: Secure file handling with extension validation

### Social Features
- **Like System**: Users can like/unlike posts
- **Comment System**: Threaded comments on posts (partially implemented)
- **Feed System**: Public feed and department-specific feeds
- **User Profiles**: Public profile pages with user posts

### Department Integration
- **18 Departments**: Predefined list of University of Ibadan departments
- **Department Feeds**: Filtered content by department
- **Department-specific Visibility**: Posts can be limited to department members

## Data Flow

### User Registration Flow
1. User fills registration form with UI email requirement
2. Server validates email domain (@ui.edu.ng)
3. Password is hashed and user object created
4. User data stored in in-memory dictionary
5. Session created and user redirected to dashboard

### Post Creation Flow
1. User creates post with text content and optional image
2. Image uploaded to local storage and resized if present
3. Post object created and stored in posts dictionary
4. Post appears in relevant feeds based on visibility settings

### Feed Generation Flow
1. System filters posts based on visibility and user's department
2. Posts sorted by creation date (newest first)
3. Like counts and user interaction data added
4. Template renders posts with user information

## External Dependencies

### Python Packages
- **Flask**: Web framework
- **Werkzeug**: WSGI utilities and security functions
- **Pillow (PIL)**: Image processing library
- **uuid**: Unique identifier generation

### Frontend Libraries
- **Bootstrap 5.3.0**: CSS framework (CDN)
- **Font Awesome 6.0.0**: Icon library (CDN)

### File Storage
- **Local File System**: Images stored in `uploads/` directory
- **No Cloud Storage**: All files stored locally on server

## Deployment Strategy

### Development Setup
- **Debug Mode**: Enabled for development with auto-reload
- **Local Storage**: In-memory data storage for development
- **File Uploads**: Local directory for image storage
- **Port Configuration**: Runs on port 5000 by default

### Production Considerations
- **Data Persistence**: Current in-memory storage will not persist between restarts
- **File Storage**: Local file storage not suitable for distributed deployments
- **Security**: Session secret should be changed from default
- **Proxy Configuration**: ProxyFix middleware configured for reverse proxy deployment

### Scalability Limitations
- **In-memory Storage**: No data persistence, not suitable for production
- **File Storage**: Local storage not suitable for load-balanced deployments
- **Session Storage**: Server-side sessions not suitable for multi-server setup

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Phase 3: Real-Time Messaging (June 30, 2025)
- Added Flask-SocketIO for real-time communication
- Implemented direct messaging between users
- Created group chat functionality for departments and study groups
- Added messaging models: Message, Conversation, GroupChat
- Built comprehensive messaging UI with chat windows and conversation lists
- Integrated real-time message delivery and notifications
- Added message routing and SocketIO event handlers
- Created sample data with users, posts, and group chats for testing

### System Architecture Updates
- **Real-Time Communication**: Flask-SocketIO with eventlet for WebSocket support
- **Messaging Models**: Message tracking with conversations and group chats
- **UI Components**: Chat interfaces, message lists, and group management
- **Navigation**: Added Messages and Groups links to main navigation

## Changelog

- June 30, 2025: Initial setup with authentication and social feed
- June 30, 2025: Added real-time messaging system (Phase 3)