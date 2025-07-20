# Meal Planner Application

## Overview

This is a React-based meal planning application that allows users to build custom plates by selecting ingredients. The application features a modern UI built with shadcn/ui components, utilizes a PostgreSQL database with Drizzle ORM, and supports Arabic content for a Middle Eastern meal planning experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for ingredients and plate management
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Development Storage**: In-memory storage implementation for development
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Core Application Components
1. **MealPlanner**: Main page component orchestrating the meal planning experience
2. **IngredientCard**: Interactive cards displaying ingredient information with add functionality
3. **PlateBuilder**: Sidebar component for managing selected ingredients and plate actions
4. **PlateVisualization**: Realistic SVG plate showing selected ingredients in designated sections
5. **ProgressBar**: Visual feedback showing nutritional progress toward daily goals
6. **Recommendations**: Health tips and suggestions for better meal planning

### Data Schema
- **Users**: Authentication and user management
- **Ingredients**: Nutritional information, categorization, and pricing
- **Plates**: User-created meal combinations with calculated totals

### UI System
- Comprehensive component library based on shadcn/ui
- Consistent theming with CSS variables
- Mobile-responsive design patterns
- Arabic language support with proper RTL considerations

## Data Flow

1. **Ingredient Loading**: React Query fetches ingredients from `/api/ingredients` endpoint
2. **Selection Management**: Local React state manages selected ingredients array
3. **Real-time Calculations**: Nutritional totals computed on each selection change
4. **Plate Persistence**: Selected plates saved via `/api/plates` endpoint
5. **User Feedback**: Toast notifications for user actions and confirmations

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for component foundation
- **wouter**: Lightweight routing solution
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Backend Dependencies
- **express**: Web application framework
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL database driver
- **zod**: Schema validation and type inference

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and enhanced developer experience
- **drizzle-kit**: Database migration and schema management
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets in `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Type Checking**: TypeScript compiler validates all code before build

### Environment Configuration
- **Development**: Uses in-memory storage with Vite HMR
- **Production**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Database**: Drizzle migrations manage schema updates

### Deployment Requirements
- Node.js runtime environment
- PostgreSQL database instance
- Environment variables configured for database connection
- Static file serving capability for frontend assets

The application is designed for easy deployment on platforms like Replit, Vercel, or traditional VPS environments with minimal configuration requirements.

## Recent Updates

### Order Management System (July 20, 2025)
- Added PostgreSQL database integration for persistent data storage
- Implemented complete order management system with checkout flow
- Created developer dashboard for order tracking and status management
- Added Google Maps integration for precise delivery location selection
- Implemented payment method selection (cash on delivery / online payment)
- Added comprehensive order status tracking (pending, confirmed, preparing, delivered)
- Created navigation system with links to orders dashboard
- Enhanced PlateBuilder with order functionality that redirects to checkout
- Added automatic ingredient database seeding on first access