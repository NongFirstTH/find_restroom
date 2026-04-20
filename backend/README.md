# Backend Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- PostgreSQL PostGIS extension

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create a `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/restroom_finder
NODE_ENV=development
```

### 3. Setup Database

#### Create Database
```bash
createdb restroom_finder
```

#### Enable PostGIS
```bash
psql restroom_finder -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### 4. Run Migrations with Drizzle
```bash
npx drizzle-kit push:pg
```

### 5. Start Development Server
```bash
npm install
npm run dev
```

Server will run on `http://localhost:3000`

## Database Schema

### Users Table
- `id` (UUID, PK)
- `username` (VARCHAR, unique)
- `email` (VARCHAR, unique) 
- `password` (VARCHAR)
- `createdAt` (TIMESTAMP)

### Restrooms Table
- `id` (UUID, PK)
- `name` (VARCHAR)
- `detail` (TEXT)
- `address` (TEXT)
- `openingHours` (VARCHAR)
- `closingHours` (VARCHAR)
- `type` (VARCHAR) - squat, flush, other
- `isFree` (BOOLEAN)
- `location` (GEOMETRY, Point with SRID 32647)
- `createdBy` (UUID, FK → Users.id)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## API Endpoints

### GET /restrooms
Get all restrooms with creator info

### GET /restrooms/bounds?minLat=&maxLat=&minLng=&maxLng=
Get restrooms within viewport bounds using PostGIS

### GET /restrooms/count
Get total count of restrooms

### GET /restrooms/:id
Get single restroom by ID

### POST /restrooms
Create new restroom (requires X-User-ID header)

**Body:**
```json
{
  "name": "Central Park",
  "detail": "Clean public restroom",
  "address": "123 Main St",
  "openingHours": "09:00",
  "closingHours": "18:00",
  "type": "flush",
  "isFree": true,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### PUT /restrooms/:id
Update restroom (owner only, requires X-User-ID header)

### DELETE /restrooms/:id
Delete restroom (owner only, requires X-User-ID header)

## Development Commands

```bash
npm run dev
npm run build
npm start
```

