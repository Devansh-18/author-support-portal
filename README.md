# BookLeaf Publishing — Author Support & Communication Portal

A production-grade, full-stack Author Support & Communication Portal built for **BookLeaf Publishing**. The portal provides dedicated dual workspaces for **Authors** and **Operations Admins** with near-real-time synchronization, strict shared payload contracts, and normalized data persistence.

---

## 1. Quick Start & Evaluator Credentials

The application is pre-seeded with 10 authors and 18 books matching BookLeaf's catalog.

### Test Login Credentials

| Role | Name | Email | Password | Context |
|---|---|---|---|---|
| **Author** | Priya Sharma | `priya.sharma@email.com` | `Password@123` | Multi-book author (*Whispers of the Ganges*, *The Saffron Diaries*) |
| **Author** | Rohit Kapoor | `rohit.kapoor@email.com` | `Password@123` | Single-book author (*Code & Karma*) |
| **Admin** | BookLeaf Ops Admin | `admin@authorsupport.com` | `Password@123` | Full operations triage & internal notes access |

> **Evaluator Tip**: The login screen includes an **Instant Evaluator 1-Click Login** selector (`DemoUserSwitcher`). You can click any test account to auto-fill credentials and sign in immediately with zero typing.

---

## 2. Local Setup & Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 1. Install Workspace Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the environment template in `backend/`:
```bash
cd backend
cp .env.example .env
```
Ensure your `backend/.env` contains:
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
GEMINI_MODEL=gemini-1.5-flash
AI_MAX_RETRIES=3
```

### 3. Seed Database
Seed the 10 authors, 18 books, and initial sample tickets:
```bash
npm run seed
```

### 4. Run Development Servers
In two terminal tabs:
```bash
# Terminal 1: Backend API (runs on http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend (Vite server on http://localhost:5173)
npm run dev:frontend
```

---

## 3. Running Hermetic Test Suites

All tests are hermetic, isolated, and validate contract schemas, models, and API endpoints without calling external services:

```bash
# Run all tests across workspaces
npm run test

# Run contract verification tests
npm run test:contracts

# Run backend unit & integration tests
npm run test:backend
```

---

## 4. Architecture & Monorepo Structure

```text
author-support-portal/
├── contracts/                 # @author-support/contracts (Shared truth)
│   ├── src/
│   │   ├── enums/             # USER_ROLES, BOOK_STATUSES, TICKET_STATUSES, TICKET_CATEGORIES, TICKET_PRIORITIES
│   │   ├── auth/              # Login & session profile contracts
│   │   ├── books/             # Book list & item contracts
│   │   ├── tickets/           # Ticket list, detail, reply, notes & filter query contracts
│   │   └── common/            # Strict contract assertion validator & date helpers
│   └── tests/                 # 24 contract validation unit tests
│
├── backend/                   # Node.js / Express 5 API
│   ├── src/
│   │   ├── config/            # Fail-fast env validation & MongoDB connection
│   │   ├── middleware/        # JWT auth, role guard (RBAC), and contract validation
│   │   ├── modules/
│   │   │   ├── auth/          # Login & session profile (/api/auth)
│   │   │   ├── books/         # Book queries & royalty tracking (/api/books)
│   │   │   ├── tickets/       # Support queries, replies & notes (/api/tickets)
│   │   │   └── health/        # Health check (/api/health)
│   │   └── scripts/seed/      # Sample dataset seeder
│   └── tests/                 # 45 backend unit and integration tests
│
└── frontend/                  # React 19 + Vite SPA
    ├── src/
    │   ├── context/           # AuthContext (session state & token persistence)
    │   ├── hooks/             # useUrlState (URL sync), useTicketSync (smart polling)
    │   ├── services/          # Centralized API fetch wrapper
    │   ├── components/
    │   │   ├── common/        # Navbar, StatusBadge, PriorityBadge, DemoUserSwitcher
    │   │   ├── author/        # Tactile paper-based author studio (Books, Ledger, Tickets)
    │   │   ├── admin/         # Clean ops workspace (Queue table, Triage drawer, Notes)
    │   │   └── auth/          # Login page with 1-click test account picker
    │   ├── index.css          # Unified dual-theme design system
    │   └── App.jsx            # Role-based route view switcher
```

---

## 5. Architectural Highlights & Engineering Decisions

### 1. Normalized Reference-Based Data Models
- **`Book`**: References `author` (`User` ObjectId). Stores `royaltyPayoutDates` as an array of dates to track historical quarterly payouts.
- **`Ticket`**: Contains only ticket metadata and references `author` (`User` ObjectId) and optional `book` (`Book` ObjectId).
- **`TicketResponse`**: Separate collection for messages between authors and staff. Avoids unbounded embedded array bloat.
- **`InternalNote`**: Standalone collection for private ops notes. Author endpoints never query this collection, guaranteeing zero data leakage by design.

### 2. Dual UI Aesthetics Tailored for User Personas
- **Author Portal (Literary / Manuscript Paper Theme)**:
  - Warm parchment canvas (`#FAF7F2`, `#F4EFEA`), deckled-edge subtle borders (`#E5DECE`), warm ink typography (`#1C1917`), and classical editorial serif typography (*Playfair Display* / *Lora*).
  - Books rendered as tactile volume cards with spine accents.
  - Financial summary rendered as a traditional publishing royalty ledger sheet.
- **Admin Portal (Clean, Breathable Ops Triage Theme)**:
  - Cool slate canvas (`#F8FAFC`), crisp white elevated surface cards (`#FFFFFF`), subtle slate borders (`#E2E8F0`), deep slate typography (`#0F172A`).
  - High information density without cognitive clutter ("no suffocation").
  - Clear SLA urgency indicators and sensible operational defaults (oldest unresolved queries prioritized first).

### 3. Strict Enum-Based Filtering & Two-Way URL State Sync
- All filters strictly adhere to enums defined in `@author-support/contracts`. Any invalid value is rejected with 400 `ValidationError`.
- Filter parameters, active tabs, and inspected ticket IDs synchronize bi-directionally with browser URL search parameters (`useUrlState`). Sharing a link or refreshing reproduces the exact view.

### 4. Near-Real-Time Synchronization
- Implemented with lightweight smart polling (`useTicketSync`) in `ticketService.js`.
- Automatically polls active tickets every 3 seconds and pauses when the browser tab is hidden (`document.hidden`) or offline. Delivers immediate perceived responsiveness without complex WebSocket proxy setup.

### 5. Decoupled Asynchronous AI Architecture
- **Strategy / Adapter Pattern (`BaseAiProvider`, `GeminiAiProvider`, `MockAiProvider`, `AiProviderFactory`)**:
  - Core ticket services never depend directly on Google Gemini or third-party SDKs. All AI interactions pass through the `BaseAiProvider` interface.
- **Zero User Wait Time (< 50ms)**:
  - When an author creates a ticket, the ticket is written to MongoDB with initial state and `aiStatus: "pending"`, and HTTP `201 Created` is returned **instantly**.
  - Background orchestrator (`ai.orchestrator.js`) dispatches the AI task asynchronously without blocking the user.
- **'N/A' Baseline for AI-Generated Attributes**:
  - Tickets start with `category: "N/A"` and `priority: "N/A"`. If AI is processing or fails, attributes remain `"N/A"`.
  - Admins are strictly prohibited by contracts and service validation from updating any ticket to `"N/A"`.
- **Resilient Retry Engine**:
  - Distinguishes permanent errors (400, 401, 403, 404, safety blocks) which bail out immediately vs. transient errors (429 rate limit, 5xx, network timeouts) which retry up to 3 times with exponential backoff and randomized jitter.

---

## 6. REST API Endpoints Specification

| Method | Endpoint | RBAC Guard | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Verify credentials, return JWT + profile |
| `GET` | `/api/auth/me` | Authenticated | Retrieve active session profile |
| `GET` | `/api/books` | Author / Admin | List books (Authors scoped to own titles; Admins see all) |
| `GET` | `/api/books/:id` | Author / Admin | Fetch single book details |
| `GET` | `/api/tickets` | Author / Admin | Query tickets (Authors scoped to own; Admins see queue) |
| `POST` | `/api/tickets` | Author Only | Raise a new support ticket |
| `GET` | `/api/tickets/:id` | Author / Admin | Ticket thread details + conversation replies |
| `POST` | `/api/tickets/:id/replies` | Author / Admin | Add a message reply to the ticket dialogue |
| `GET` | `/api/tickets/:id/notes` | Admin Only | Fetch confidential internal ops team notes |
| `POST` | `/api/tickets/:id/notes` | Admin Only | Add confidential internal ops team note |
| `PATCH` | `/api/tickets/:id/status` | Admin Only | Update ticket status (`Open`, `In Progress`, `Resolved`, `Closed`) |
| `PATCH` | `/api/tickets/:id/metadata` | Admin Only | Override category, priority, or assigned admin |
| `GET` | `/api/health` | Public | System health check |
