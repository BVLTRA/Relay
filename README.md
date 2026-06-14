# RELAY // Operational Fault Logging & Team Communication

An operational fault-logging and communication handoff system for teams that prioritizes real-time visibility, structured incident response, and seamless team collaboration.

## Description

Relay is a full-stack operational dashboard built to streamline fault detection, logging, and team communication. Rather than siloing incident data across disparate tools, Relay provides a unified interface where teams can ingest telemetry from edge devices and services, log faults with structured metadata, assign work, and communicate in context.

The platform leverages modern web technologies to deliver a responsive, interactive experience. Built on a JavaScript/React frontend with a Node.js/Express backend, Relay integrates with external services for alerting (Discord, Slack, SMS) and authentication (JWT-based with RBAC). The system is designed to scale: event pipelines handle high-volume telemetry ingestion, stateful filtering enables client-side performance, and role-based access control ensures team security.

---

## Screenshots

### Dashboard Overview
![Dashboard](./public/images/dashboard-overview.png)
*The main dashboard showing real-time fault feed, filtered by severity and device, with team member activity indicators.*

### Fault Detail View
![Fault Details](./public/images/fault-detail.png)
*A detailed fault view including telemetry payload, severity metadata, assigned owner, and comment thread.*

### Team Management
![Team Members](./public/images/team-members.png)
*The team management interface showing members, roles, and permission levels.*

### Report Form
![Report Form](./public/images/report-form.png)
*The fault report form with fields for title, description, severity, device selection, and file attachments.*

---

## Demo & Documentation

### Project Links:
- **[GitHub Repository](https://github.com/BVLTRA/bvltra-relay)**
- **[Live Demo](#)** *(link to deployed instance)*
- **[API Documentation](#api-endpoints)** *(see below)*

---

## Table of Contents

- [Description](#description)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## How It Works

Relay operates as an integrated system for fault capture, team communication, and alerting:

- **Telemetry Ingestion**: Devices and edge services send fault events via the `POST /api/v1/faults` intake route. Each payload is validated against a strict JSON Schema, deduped, and routed into the internal event pipeline.

- **Fault Pipeline**: Once ingested, faults are processed through internal queues, enriched with metadata (device context, team assignments), and published to the event system for real-time dashboard updates.

- **Dashboard Filtering**: The React frontend implements a client-side state machine for filtering faults by severity (Info, Warning, Critical), device, and assignee. Filters persist to localStorage for user convenience.

- **Team Collaboration**: Authenticated team members (via JWT) can view faults, assign work, add comments, and trigger alerts. Role-based access control (RBAC) ensures members can only perform authorized actions.

- **Alert Integration**: When critical faults occur or team actions are needed, Relay can trigger notifications via pluggable adapters—Discord webhooks, Slack messages, SMS (via Twilio), or email. Adapters support retry logic, rate-limiting, and dead-letter queues for failed deliveries.

- **Real-Time Updates**: The backend uses WebSocket connections (or SSE fallback) to push live fault updates and team activity to connected clients, eliminating the need for polling.

---

## Features

- **Real-time Fault Ingestion**: Secure HTTP endpoint with validation and deduplication for incoming telemetry payloads.
- **Structured Logging**: Fault events capture device ID, timestamp, fault code, severity, and optional vendor-specific telemetry.
- **Client-side Filtering**: State machine-based fault filtering by severity levels with persistent user preferences.
- **Team Management**: Create teams, assign members, define roles, and manage permissions via the dashboard.
- **Secure Authentication**: JWT-based authentication with configurable JWKS support and role-based access control (RBAC).
- **Alert Notifications**: Pluggable notification framework supporting Discord, Slack, SMS, and email with retries and backoff strategies.
- **Activity Feed**: Track recent reports, team actions, and audit trails for compliance and debugging.
- **Responsive UI**: Mobile-friendly dashboard built with React, featuring modals, forms, tables, and real-time updates.
- **Observability**: Metrics for request latency, fault ingestion rates, filter performance, and alert delivery success.
- **RESTful API**: Comprehensive API for programmatic access to faults, teams, and alerts.

---

## Tech Stack

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://www.javascript.com/)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)

| **Frontend** | **Purpose** | **Backend** | **Purpose** |
|---|---|---|---|
| React | UI framework & component library | Node.js | Runtime environment |
| React Hooks & Context | State management for filters and auth | Express.js | HTTP routing and middleware |
| Zustand / Redux | Global state (optional) | JWT Middleware | Authentication & RBAC verification |
| localStorage API | Filter persistence | RESTful Routes | API endpoints for faults, teams, alerts |
| CSS Modules / Tailwind | Styling and responsive layout | Event Queue / Pipeline | Async fault processing and alerting |
| Fetch / Axios | HTTP client for API calls | Node Mailer / Adapter Pattern | Pluggable notification handlers |

---

## Setup & Installation

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- A text editor or IDE (VS Code recommended)
- Optional: [MongoDB](https://www.mongodb.com/) or alternative database

### 1. Clone the Repository

```bash
git clone https://github.com/BVLTRA/bvltra-relay.git
cd bvltra-relay
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies (from root)
cd ../server
npm install
```

### 3. Configure Environment Variables

Create `.env` files in both the `client` and `server` directories.

**In `server/.env`:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=your_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_ISSUER=https://your-auth-provider.com
JWKS_URL=https://your-auth-provider.com/.well-known/jwks.json

# Notification Adapters
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
SLACK_BOT_TOKEN=xoxb-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Optional: WebSocket or SSE Configuration
WS_ENABLED=true
WS_PORT=5001
```

**In `client/.env`:**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5001
```

### 4. Run Both Servers

From the `server` directory:

```bash
npm start
# Server runs on http://localhost:5000
```

From the `client` directory (new terminal):

```bash
npm start
# Client runs on http://localhost:3000
```

---

## API Endpoints

**Base URL:** `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Request Body | Auth |
|---|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | `{ username, email, password }` | None |
| `POST` | `/auth/login` | Authenticate and return JWT | `{ email, password }` | None |
| `POST` | `/auth/refresh` | Refresh expired JWT | `{ refresh_token }` | None |

### Faults

| Method | Endpoint | Description | Request Body | Auth |
|---|---|---|---|---|
| `POST` | `/v1/faults` | Ingest a new fault event | `{ device_id, timestamp, fault_code, severity, payload, ... }` | API Token or JWT |
| `GET` | `/v1/faults` | List faults with filters | Query params: `severity, device_id, limit, offset` | JWT |
| `GET` | `/v1/faults/:id` | Get fault details | None | JWT |
| `PATCH` | `/v1/faults/:id` | Update fault (e.g., assign owner) | `{ assigned_to, status }` | JWT (requires admin) |

### Team Management

| Method | Endpoint | Description | Request Body | Auth |
|---|---|---|---|---|
| `POST` | `/teams` | Create a new team | `{ name, description }` | JWT (admin) |
| `GET` | `/teams` | List all teams | None | JWT |
| `GET` | `/teams/:id` | Get team details | None | JWT |
| `POST` | `/teams/:id/members` | Add member to team | `{ user_id, role }` | JWT (admin) |
| `GET` | `/teams/:id/members` | List team members | None | JWT |
| `PATCH` | `/teams/:id/members/:user_id` | Update member role | `{ role }` | JWT (admin) |
| `DELETE` | `/teams/:id/members/:user_id` | Remove member from team | None | JWT (admin) |

### Alerts

| Method | Endpoint | Description | Request Body | Auth |
|---|---|---|---|---|
| `POST` | `/alerts/config` | Configure alert channels | `{ channels: [{ type: 'slack', config: {...} }] }` | JWT (admin) |
| `GET` | `/alerts/config` | Get alert configuration | None | JWT (admin) |
| `POST` | `/alerts/test` | Send test alert | `{ channel_type }` | JWT (admin) |
| `GET` | `/alerts/history` | Get alert delivery history | Query params: `limit, offset, status` | JWT |

### Reports

| Method | Endpoint | Description | Request Body | Auth |
|---|---|---|---|---|
| `POST` | `/reports` | Create a fault report | `{ title, description, severity, device_id, tags, attachments }` | JWT |
| `GET` | `/reports` | List reports | Query params: `limit, offset, assigned_to, status` | JWT |
| `GET` | `/reports/:id` | Get report details | None | JWT |
| `POST` | `/reports/:id/comments` | Add comment to report | `{ content }` | JWT |

---

## Data Model

### Fault Schema

```json
{
  "id": "string (UUID)",
  "device_id": "string",
  "timestamp": "ISO8601",
  "fault_code": "string",
  "severity": "enum(info, warning, critical)",
  "payload": "object (vendor-specific telemetry)",
  "metrics": "object (numeric metrics)",
  "correlation_id": "string (optional, for deduplication)",
  "status": "enum(open, assigned, resolved, archived)",
  "assigned_to": "string (user_id or null)",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

### User / Team Schema

```json
{
  "id": "string (UUID)",
  "email": "string (unique)",
  "username": "string (unique)",
  "password_hash": "string (bcrypt)",
  "display_name": "string",
  "avatar_url": "string (optional)",
  "role": "enum(admin, manager, member)",
  "teams": ["string (team_ids)"],
  "created_at": "ISO8601"
}
```

### Alert Configuration Schema

```json
{
  "id": "string (UUID)",
  "team_id": "string",
  "channels": [
    {
      "type": "enum(discord, slack, sms, email)",
      "enabled": "boolean",
      "config": {
        "webhook_url": "string (Discord/Slack)",
        "phone_number": "string (SMS)",
        "email_address": "string (Email)"
      },
      "rate_limit": { "max_per_minute": "integer" }
    }
  ],
  "created_at": "ISO8601"
}
```

---

## Project Structure

```text
bvltra-relay/
├── client/                       # React frontend
│   ├── public/
│   │   └── images/              # Screenshots and assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Modal.jsx
│   │   │   ├── FormInput.jsx
│   │   │   ├── FaultCard.jsx
│   │   │   ├── FaultTable.jsx
│   │   │   ├── TeamMemberCard.jsx
│   │   │   └── ...
│   │   ├── pages/               # Route/page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FaultDetail.jsx
│   │   │   ├── TeamManagement.jsx
│   │   │   ├── ReportForm.jsx
│   │   │   ├── CoworkerDetail.jsx
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useFaults.js     # Fault fetching and filtering
│   │   │   ├── useTeam.js       # Team data management
│   │   │   └── useAuth.js       # Authentication state
│   │   ├── state/               # State management
│   │   │   ├── faultFilterStore.js  # Zustand/Redux for filters
│   │   │   ├── authStore.js
│   │   │   └── ...
│   │   ├── utils/               # Utility functions
│   │   │   ├── api.js           # API client
│   │   │   ├── formatters.js    # Date/severity formatting
│   │   │   └── validators.js    # Form validation
│   │   ├── styles/              # Global styles
│   │   │   ├── App.css
│   │   │   ├── Dashboard.css
│   │   │   └── variables.css
│   │   ├── App.jsx              # Root component
│   │   └── index.jsx            # React entry point
│   └── package.json
│
├── server/                       # Node.js + Express backend
│   ├── routes/                  # API route handlers
│   │   ├── auth.js
│   │   ├── faults.js
│   │   ├── teams.js
│   │   ├── alerts.js
│   │   └── reports.js
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # JWT verification & RBAC
│   │   ├── validation.js        # Request validation
│   │   ├── errorHandler.js      # Global error handling
│   │   └── logging.js           # Request logging
│   ├── models/                  # Data models / schemas
│   │   ├── Fault.js
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Alert.js
│   │   └── Report.js
│   ├── services/                # Business logic
│   │   ├── faultService.js      # Fault ingestion & processing
│   │   ├── teamService.js       # Team operations
│   │   ├── alertService.js      # Alert notification dispatch
│   │   ├── authService.js       # JWT and RBAC helpers
│   │   └── ...
│   ├── adapters/                # Pluggable alert adapters
│   │   ├── DiscordAdapter.js
│   │   ├── SlackAdapter.js
│   │   ├── SmsAdapter.js        # Twilio integration
│   │   ├── EmailAdapter.js
│   │   └── BaseAdapter.js       # Abstract base class
│   ├── queue/                   # Event/message queue
│   │   ├── faultQueue.js
│   │   ├── alertQueue.js
│   │   └── worker.js
│   ├── schemas/                 # Validation schemas
│   │   ├── faults.json          # JSON Schema for fault payloads
│   │   ├── reports.json
│   │   └── ...
│   ├── utils/                   # Utility functions
│   │   ├── jwt.js               # JWT signing/verification
│   │   ├── logger.js            # Logging setup
│   │   ├── cache.js             # JWKS caching
│   │   └── ...
│   ├── server.js                # Express app setup & route registration
│   ├── index.js                 # Entry point (calls server.js)
│   └── package.json
│
├── .gitignore
├── package.json                 # Root workspace config (if monorepo)
└── README.md                    # This file
```

---

## Environment Configuration

### Key Environment Variables Explained

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Deployment environment | `development`, `production` |
| `DATABASE_URL` | Database connection string | `mongodb://localhost:27017/relay` |
| `JWT_SECRET` | Secret for signing JWTs | `your_random_secret_key_min_32_chars` |
| `JWT_ISSUER` | Issuer claim for JWTs | `https://auth.example.com` |
| `JWKS_URL` | URL to fetch public keys | `https://auth.example.com/.well-known/jwks.json` |
| `DISCORD_WEBHOOK_URL` | Discord incoming webhook | `https://discord.com/api/webhooks/...` |
| `SLACK_BOT_TOKEN` | Slack bot OAuth token | `xoxb-...` |
| `TWILIO_ACCOUNT_SID` | Twilio account ID | `AC...` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `...` |
| `REACT_APP_API_URL` | Backend API base URL (client) | `http://localhost:5000` |
| `REACT_APP_WS_URL` | WebSocket server URL (client) | `ws://localhost:5001` |

---

## Development & Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd ../client
npm test
```

### Code Quality

```bash
# Lint backend code
cd server
npm run lint

# Lint frontend code
cd ../client
npm run lint
```

### Building for Production

```bash
# Build frontend
cd client
npm run build
# Output: build/

# Production server startup
cd ../server
NODE_ENV=production npm start
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Acknowledgments

- **React & Node.js communities** - For the robust frameworks and tooling.
- **Express.js & Middleware ecosystem** - For powerful routing and composable middleware.
- **JWT / OAuth2 standards** - For industry-standard authentication practices.
- **Discord, Slack, Twilio** - For reliable APIs and extensive integrations.
- **MongoDB & Mongoose** - For flexible data modeling and query capabilities.
- **All contributors and testers** - For feedback, bug reports, and collaborative spirit.

---

**Questions or feedback?** [Open an issue](https://github.com/BVLTRA/bvltra-relay/issues) or reach out to the maintainers.
