# Tip Share Pro - Backend API

Backend API server for the Tip Share Pro restaurant tip pooling platform.

## Technology Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Validation:** Zod
- **Testing:** Vitest
- **Logging:** Pino

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd tip-share-pro-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Generate Prisma client:

```bash
npm run db:generate
```

5. Run database migrations:

```bash
npm run db:migrate
```

6. Seed the database (optional):

```bash
npm run db:seed
```

### Running the Server

Development mode with hot reload:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## API Endpoints

### Core Tip Calculation Engine

#### Calculate Distribution

```
POST /api/v1/pay-periods/:periodId/calculate
```

Runs the Hours × Rate × Weight algorithm to calculate tip distribution.

**Request Body:**
```json
{
  "employeeHours": [
    { "employeeId": "uuid", "hours": 32.5 },
    { "employeeId": "uuid", "hours": 40.0 }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payPeriod": {
      "id": "uuid",
      "startDate": "2026-01-01",
      "endDate": "2026-01-15",
      "status": "ACTIVE"
    },
    "distribution": [
      {
        "employeeId": "uuid",
        "employeeName": "Maria Santos",
        "locationId": "uuid",
        "locationName": "Downtown",
        "jobCategory": {
          "id": "uuid",
          "name": "Server",
          "badgeColor": "#4A90D9"
        },
        "hoursWorked": 32.5,
        "hourlyRate": 18.50,
        "percentage": 15.23,
        "shareCents": 37314,
        "receivedCents": 37300
      }
    ],
    "summary": {
      "totalParticipants": 8,
      "totalHours": 285.5,
      "totalPoolCents": 245000,
      "distributedCents": 245000,
      "varianceCents": 0
    },
    "calculatedAt": "2026-01-16T14:30:00Z"
  }
}
```

#### Get Distribution

```
GET /api/v1/pay-periods/:periodId/distribution
```

Returns the stored distribution for a pay period.

#### Preview Calculation (Sandbox)

```
POST /api/v1/calculate/preview
```

Calculates distribution without saving to database. Useful for "what-if" scenarios.

### Health Check

```
GET /api/v1/health
```

Returns server status.

## Core Algorithm

The tip distribution is calculated using the proprietary **Hours × Rate × Weight** formula:

1. **Calculate basis** for each employee: `hours × rate × weight`
2. **Sum all basis values** to get `totalBasis`
3. **Calculate percentage** for each: `basis / totalBasis`
4. **Calculate share** for each: `totalPool × percentage`
5. **Reconcile rounding** to ensure total matches pool exactly

**CRITICAL:** The `basis` value is NEVER exposed to API responses or clients.

## Testing

Run all tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── config/           # Configuration
├── middleware/       # Express middleware
├── routes/           # API route handlers
├── services/         # Business logic
├── types/            # TypeScript types
├── utils/            # Utilities
└── index.ts          # Entry point

prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed data

tests/
└── *.test.ts         # Unit tests
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing secret | Required in production |
| `ALLOWED_ORIGINS` | CORS origins | http://localhost:3000 |
| `LOG_LEVEL` | Logging level | info |

## License

Proprietary - All rights reserved.
