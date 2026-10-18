# BookLeaf Publishing — Author Support & Operations Portal

A production-ready Author Support & Operations Communication Portal built for **BookLeaf Publishing**. The portal provides dedicated dual workspaces for **Authors** (literary manuscript paper studio) and **Operations Admins** (airy, high-density triage desk) powered by a shared contracts monorepo, strict RBAC security, and an asynchronous, token-optimized AI triage engine.

---

## 1. Quick Start & Test Accounts

The database includes pre-seeded accounts matching BookLeaf's author catalog and publishing workflows:

| Role | Name | Email | Password | Catalog / Access Context |
|---|---|---|---|---|
| **Author** | Priya Sharma | `priya.sharma@email.com` | `Password@123` | Multi-book author (*Whispers of the Ganges*, *The Saffron Diaries*) |
| **Author** | Rohit Kapoor | `rohit.kapoor@email.com` | `Password@123` | Single-book author (*Code & Karma*) |
| **Admin** | BookLeaf Ops Admin | `admin@authorsupport.com` | `Password@123` | Full operations triage, SLA prioritization & private notes access |

> **Evaluator Convenience**: The login interface features an **Instant Evaluator 1-Click Login** selector (`DemoUserSwitcher`). Clicking any demo persona populates credentials and logs in immediately without manual typing.

---

## 2. Local Setup & Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string

### 1. Clone & Install Dependencies
From the repository root:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the environment template in `backend/`:
```bash
cd backend
cp .env.example .env
```

Ensure your `backend/.env` is configured (defaults work out-of-the-box for local development):
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/author_support_portal
LOG_LEVEL=info
ADMIN_EMAIL=admin@authorsupport.com
ADMIN_NAME=System Administrator
SEED_DEFAULT_PASSWORD=Password@123
JWT_SECRET=bookleaf_author_portal_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
AI_MAX_RETRIES=3
```

### 3. Seed Database
Seed authors, published titles, production manuscripts, and initial sample tickets:
```bash
npm run seed
```

### 4. Run Development Servers
Start both backend and frontend development servers concurrently:
```bash
# Start backend API (http://localhost:5000) and frontend SPA (http://localhost:5173)
npm run dev
```

Alternatively, run each workspace in separate terminal tabs:
```bash
# Terminal 1: Backend API
npm run dev:backend

# Terminal 2: Frontend Client
npm run dev:frontend
```

---

## 3. Project Architecture & Monorepo Structure

The workspace is organized as an npm monorepo with strict package boundaries:

```text
author-support-portal/
├── contracts/                 # @author-support/contracts (Shared Source of Truth)
│   ├── package.json
│   └── src/
│       ├── enums/             # Canonical domain enums (roles, statuses, categories, priorities)
│       ├── auth/              # Auth request & response schemas
│       ├── books/             # Book catalog item & filter query schemas
│       ├── tickets/           # Ticket creation, detail, reply, notes & triage schemas
│       ├── health/            # Health check schemas
│       └── common/            # Strict payload validator (no unexpected fields) & UTC date utilities
│
├── backend/                   # Node.js / Express 5 REST API
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js             # Express application assembly, security middleware & CORS
│       ├── index.js           # Server bootstrap & port listener
│       ├── config/            # Fail-fast environment validation & MongoDB connection
│       ├── constants/         # Re-exported domain enums
│       ├── errors/            # Custom domain error class hierarchy (AppError, ValidationError, etc.)
│       ├── middleware/        # JWT auth, role guard (RBAC), error handler, contract validators
│       ├── modules/
│       │   ├── auth/          # Authentication & user session (/api/auth)
│       │   ├── books/         # Author catalog & royalty ledger (/api/books)
│       │   ├── tickets/       # Queries, replies & confidential notes (/api/tickets)
│       │   ├── ai/            # Decoupled AI orchestrator, prompt templates & provider adapters
│       │   └── health/        # Liveness & readiness probes (/api/health)
│       ├── scripts/seed/      # Canonical seed dataset & upsert service
│       └── utils/             # Structured JSON logger & date parsing helpers
│
└── frontend/                  # React 19 + Vite Single-Page Application
    ├── package.json
    ├── vite.config.js
    ├── index.html             # Google Fonts (Playfair Display, Lora, Inter) & BookLeaf favicon
    └── src/
        ├── main.jsx           # React DOM root entry
        ├── App.jsx            # Dynamic role-based route view router
        ├── index.css          # Unified dual-theme design system & responsive layout utilities
        ├── context/           # AuthContext (JWT persistence, login/logout state)
        ├── hooks/             # useUrlState (bidirectional URL query sync), useTicketSync (smart polling)
        ├── services/          # Centralized API service wrappers (auth, books, tickets)
        └── components/
            ├── common/        # Navbar, StatusBadge, PriorityBadge, DemoUserSwitcher
            ├── author/        # Author Studio (BookCatalog, BookManuscriptCard, RoyaltyLedger, TicketThreadView)
            ├── admin/         # Operations Desk (AdminDashboard, QueueStatsBar, TicketQueueTable, TicketTriagePane)
            └── auth/          # LoginPage with 1-click test persona switcher
```

---

## 4. Architectural Decisions & Rationale

### 1. Centralized Shared Contracts Monorepo (`contracts/`)
- **Why**: Prevents frontend and backend divergence in request/response formats. The shared contract library defines schemas, enums, and payload shapes in a single location consumed by both tiers.
- **Strict Payload Validation**: Payloads are strictly validated to prevent unexpected or missing fields. If a client sends extraneous properties or omits required fields, the request fails fast with an explicit `ValidationError`.

### 2. Functional Code by Default vs. Extensible OOP Patterns
- **Functional Programming**: All route handlers, controllers, services, middleware, and React components utilize clean, predictable functional programming without unnecessary class boilerplate.
- **OOP Where Polymorphic Extensibility is Required**:
  - **AI Provider Strategy Pattern**: `BaseAiProvider` defines the contract for LLM integrations, extended by `GeminiAiProvider` and `MockAiProvider`, and instantiated via `AiProviderFactory`. Switching or upgrading model providers requires zero changes to core ticket services.
  - **Domain Error Hierarchy**: Class inheritance (`AppError` -> `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConfigurationError`) ensures consistent HTTP status codes, structured JSON error payloads, and diagnostic metadata across the backend.

### 3. Normalized Reference-Based Data Models
- **Separation of Concerns**: Instead of unbounded embedded document arrays that cause document bloat and concurrency contention in MongoDB, messages and notes are modeled as distinct collections:
  - `User`: Accounts, credentials, author imprint metadata, and role.
  - `Book`: Title, ISBN, format, publisher status, pricing, and historical royalty payout dates.
  - `Ticket`: Core inquiry metadata referencing the author and linked book.
  - `TicketResponse`: Public conversation thread between authors and operations staff.
  - `InternalNote`: Strictly confidential operational notes. Author API endpoints never query or populate this collection, guaranteeing complete confidentiality by design.

### 4. Dual Persona-Driven Design System
- **Author Portal (`.theme-author`)**: Built on a tactile manuscript paper aesthetic. Utilizes warm parchment canvas (`#FBF9F5`), subtle warm borders (`#E6DFD5`), deep ink text (`#1C1917`), editorial serif typography (*Playfair Display* / *Lora* for titles and statement headers), and modern sans-serif (*Inter*) for numbers and badges.
- **Admin Operations Desk (`.theme-admin`)**: Engineered for operational triage. Utilizes a clean slate canvas (`#F8FAFC`), elevated white cards (`#FFFFFF`), streamlined row padding (`10px 14px`), and subtle interactive triage links to maximize throughput without visual clutter.

### 5. URL State Synchronization & Smart Synchronization
- **Bidirectional URL State (`useUrlState`)**: Filters (status, category, priority, sort order) and selected ticket IDs synchronize with browser query strings, enabling bookmarkable links and persistent view state across refreshes.
- **Smart Polling (`useTicketSync`)**: Delivers real-time perception by polling active tickets every 3–3.5 seconds. Automatically pauses when the browser tab is hidden (`document.hidden`) or offline to conserve client and server resources.

---

## 5. AI Integration Architecture

### 1. Decoupled Asynchronous Execution
- **Instant Author Response (< 50ms)**: When an author submits a support ticket, the record is immediately committed to MongoDB with `aiStatus: "pending"`, `category: "N/A"`, and `priority: "N/A"`, and HTTP `201 Created` is returned instantly.
- **Background Orchestration**: The AI orchestrator (`ai.orchestrator.js`) triggers asynchronously in the background. It evaluates the inquiry, classifies category and priority, drafts an operational response aligned with BookLeaf policies, and updates the ticket in MongoDB.

### 2. Resilient Error Classification & Smart Retries
- **Permanent Client Failures (No Retry)**: Non-retryable errors (e.g. 400 Bad Request, 401/403 Authentication failures, 404 Model Not Found, content safety blocks) bail out immediately to prevent wasted quota. The ticket's `aiStatus` is marked as `"failed"`.
- **Transient Failures (Smart Retries)**: Rate limits (HTTP 429), server errors (5xx), and network timeouts automatically retry up to 3 times with exponential backoff and randomized jitter.
- **Safe Baseline**: AI-generated attributes remain `"N/A"` if analysis fails or is still processing. Admins can manually classify tickets and author replies without interference.

---

## 6. AI Codebase Optimizations

The AI integration incorporates targeted optimizations across the codebase to maximize processing efficiency and eliminate unnecessary overhead:

- **System Instruction Isolation**: Separates static company policies, royalty rules, and brand guidelines into dedicated system instructions so providers can cache invariant context across requests.
- **Selective Database Projection**: Queries and transmits only essential fields (author name, inquiry text, linked book title/pricing) rather than serializing entire database documents.
- **Dynamic Domain Context Routing**: Analyzes ticket keywords to match specific operational domains (Royalty, ISBN, Printing, Distribution, Production), injecting only relevant policy context rather than the entire knowledge base.
- **Strict Output Token Ceilings**: Enforces an explicit token limit on model generation to keep suggested draft responses concise and prevent runaway completion costs.
- **Native JSON Schema Enforcement**: Binds model generation directly to structured OpenAPI schemas, restricting outputs strictly to valid enums and response text while eliminating markdown wrappers and conversational filler.
- **Asynchronous Decoupled Processing**: Offloads ticket analysis to background execution so user query submissions complete with zero waiting time.
- **Error-Type Classification**: Differentiates permanent client errors from transient network issues, terminating immediately on fatal errors to avoid redundant API calls.

---

## 7. REST API Documentation

All endpoints enforce strict input validation against `@author-support/contracts` schemas.

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT token + user profile. |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile based on Bearer token. |

### Books Catalog Endpoints (`/api/books`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/books` | Author / Admin | Lists books. Authors receive only their titles; Admins receive full catalog. Supports status filter and sorting. |
| `GET` | `/api/books/:id` | Author / Admin | Retrieves detailed metadata and royalty statistics for a specific book. |

### Support Tickets Endpoints (`/api/tickets`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tickets` | Author / Admin | Lists tickets. Authors see their submissions; Admins see the triage queue. Supports status, category, priority filters and sorting. |
| `POST` | `/api/tickets` | Author Only | Creates a support inquiry. Validates subject and description, links optional book ID, and triggers background AI analysis. |
| `GET` | `/api/tickets/:id` | Author / Admin | Returns complete ticket record with conversation response history. |
| `POST` | `/api/tickets/:id/replies` | Author / Admin | Appends a public message reply to the ticket conversation. |
| `GET` | `/api/tickets/:id/notes` | Admin Only | Retrieves private internal notes. Forbidden (403) to Authors. |
| `POST` | `/api/tickets/:id/notes` | Admin Only | Adds a private internal note for operations team members. |
| `PATCH` | `/api/tickets/:id/status` | Admin Only | Updates ticket status (`Open`, `In Progress`, `Resolved`, `Closed`). |
| `PATCH` | `/api/tickets/:id/metadata` | Admin Only | Overrides category, priority, or assigns ticket to an admin user. |

### Health Endpoint (`/api/health`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns service status, uptime, environment, and MongoDB connectivity state. |

---

## 8. Known Limitations & Future Improvements

Given additional engineering time, the following enhancements would be prioritized:

1. **Cloud Object Storage for Attachments**: Ticket file proofs currently store filename metadata. In a high-volume production deployment, direct client-to-cloud uploads using Amazon S3 or Cloudflare R2 with presigned URLs and antivirus scanning would be introduced.
2. **WebSocket / Server-Sent Events (SSE)**: Smart polling currently provides responsive updates with tab visibility throttling. Implementing WebSockets or SSE for the admin triage queue would further minimize HTTP connection overhead at high concurrent user scale.
3. **Distributed Job Queue**: The background AI orchestrator currently runs in-process via Node.js asynchronous task scheduling. For multi-instance clustered server deployments, integrating a Redis-backed queue (such as BullMQ) would provide distributed worker pooling, rate-limit scheduling, and persistent job tracking across instances.
4. **Multi-Department Routing**: Expanding admin roles into specialized teams (Editorial, Royalties & Finance, Printing Logistics) with automated ticket routing based on the AI-classified category.
5. **Real-Time Token Usage Dashboard**: An operations analytics view tracking cumulative model token consumption, latency metrics, and AI categorization accuracy over time.
