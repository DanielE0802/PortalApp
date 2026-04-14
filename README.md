# PortalApp - Portal API

User & Posts Management Portal with NestJS backend and Next.js frontend.

## 🏗️ Architecture

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: Next.js 16 + React 19 + Redux Toolkit + TailwindCSS
- **Database**: PostgreSQL 16
- **Deployment**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Copy environment file
cp .env.example .env

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure Environment

Edit the `.env` file in the root directory with your configuration. See `ENV_SETUP.md` for details.

### 3. Development Mode

```bash
# Start PostgreSQL
docker-compose up -d

# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- Swagger Docs: http://localhost:3001/api/docs (dev only)

### 4. Production Mode

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up --build
```

## 📁 Project Structure

```
PortalApp/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── database/       # Migrations
│   │   ├── modules/        # Feature modules
│   │   └── main.ts         # Application entry
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Development compose
├── docker-compose.prod.yml # Production compose
├── .env                    # Environment variables (gitignored)
└── .env.example           # Environment template
```

## 🔧 Backend Features

- Swagger API documentation (non-production only)
- Global validation with class-validator
- Helmet security headers
- CORS configuration
- Cookie parser
- TypeORM with PostgreSQL
- Migration system
- Global prefix: `/api/v1`


## 🎨 Frontend Features

- Next.js 16 with App Router
- Redux Toolkit for state management
- TailwindCSS + Radix UI components
- Vitest for testing
- Standalone output for Docker


## 🐳 Docker Commands

```bash
# Development (PostgreSQL only)
docker-compose up -d
docker-compose down

# Production (All services)
docker-compose -f docker-compose.prod.yml up --build
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose logs -f
docker-compose -f docker-compose.prod.yml logs -f backend
```

## Environment Variables

All environment variables are centralized in the root `.env` file. Both backend and frontend read from this single file.

**Key variables:**
- `DATABASE_URL` - PostgreSQL connection
- `PORT` - Backend port
- `CORS_ORIGINS` - Allowed origins
- `NEXT_PUBLIC_API_URL` - Frontend API URL

## Testing

```bash
# Backend tests
cd backend
npm test
npm run test:e2e
npm run test:cov

# Frontend tests
cd frontend
npm test
npm run test:watch
npm run test:coverage
```

## API Documentation

When running in development mode, Swagger documentation is available at:
```
http://localhost:3001/api/docs
```

## Security Features

- Helmet for security headers
- CORS configuration
- Input validation with class-validator
- Whitelist and forbid non-whitelisted properties
- Cookie parser for secure cookie handling


