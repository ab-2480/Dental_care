# Dental Clinic Management System

## Overview

A beginner-friendly web application for a dental clinic that supports two user roles: Patient and Doctor. Patients can register, view doctors, book appointments, and manage their healthcare. Doctors can view their appointments, manage patients, and issue prescriptions.

The application uses a React frontend with Express backend, featuring role-based authentication and a clean, modern medical-themed UI built with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for page transitions
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (compiled with tsx)
- **API Design**: RESTful endpoints defined in shared/routes.ts
- **Session Management**: express-session with MemoryStore

### Data Storage
- **Primary Storage**: JSON files in the `/data` directory for simplicity
- **Schema Definition**: Drizzle ORM schemas in shared/schema.ts (PostgreSQL-ready)
- **Current Implementation**: FileStorage class reads/writes JSON files
- **Database Ready**: Drizzle config and PostgreSQL pool are configured for future migration

### Authentication & Authorization
- **Method**: Session-based authentication with cookies
- **Session Store**: MemoryStore (in-memory, suitable for development)
- **Role-Based Access**: Two roles - "patient" and "doctor"
- **Protected Routes**: Middleware checks session.userId for authenticated routes

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components (shadcn/ui + custom)
│       ├── hooks/        # React Query hooks for data fetching
│       ├── pages/        # Route components
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Data access layer (FileStorage)
│   └── db.ts         # Database connection (for future use)
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle schemas and Zod types
│   └── routes.ts     # API route definitions with validation
└── data/             # JSON file storage
    ├── users.json
    ├── appointments.json
    └── prescriptions.json
```

### Key Design Decisions

1. **Shared Route Definitions**: API routes are defined with Zod schemas in shared/routes.ts, enabling type-safe API calls and validation on both client and server.

2. **File-Based Storage**: Uses JSON files instead of a database for simplicity, making it beginner-friendly while maintaining the structure for easy database migration.

3. **Component Library**: shadcn/ui provides accessible, customizable components that integrate with Tailwind CSS.

4. **Monorepo Structure**: Client and server share TypeScript configuration and common code through the shared directory.

## External Dependencies

### UI Components (Radix UI primitives)
- Complete set of accessible UI primitives: dialogs, dropdowns, forms, etc.
- Styled through shadcn/ui wrapper components

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe ORM (schema definitions, ready for PostgreSQL)
- **drizzle-zod**: Generate Zod schemas from Drizzle tables

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod integration for form validation
- **zod**: Schema validation library

### Backend Services
- **express-session**: Session management
- **memorystore**: In-memory session storage
- **connect-pg-simple**: PostgreSQL session store (available for production)

### Development Tools
- **Vite**: Frontend build tool with HMR
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production bundling for server

### Database (Configured but Optional)
- **PostgreSQL**: Database connection configured via DATABASE_URL
- **Drizzle Kit**: Database migration tool (`npm run db:push`)