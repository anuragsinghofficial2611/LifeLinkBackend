# Lifelink Backend — Express.js + MongoDB

A production-grade, maintainable, and fully functional Express.js and MongoDB equivalent of the Lifelink FastAPI backend.

Built using Node.js ES Modules, Mongoose, Zod validation, JWT authentication, bcrypt password hashing, centralized error handling, and Swagger/OpenAPI documentation.

---

## 📋 Table of Contents

1. [Features & Architecture](#features--architecture)
2. [Folder Structure](#folder-structure)
3. [Request Flow](#request-flow)
4. [Technology Stack](#technology-stack)
5. [Prerequisites & Installation](#prerequisites--installation)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Running Tests](#running-tests)
9. [API Documentation (Swagger UI)](#api-documentation-swagger-ui)
10. [FastAPI to Express Endpoint Mapping](#fastapi-to-express-endpoint-mapping)
11. [MongoDB Adaptation & Schema Design](#mongodb-adaptation--schema-design)
12. [Assumptions & External Dependencies](#assumptions--external-dependencies)

---

## 🌟 Features & Architecture

- **100% Endpoint Parity**: Rebuilds every single endpoint documented in the original FastAPI specification (34 routes, 37 distinct HTTP operations).
- **Three-Tier Role-Based Security**: Complete JWT authentication with separation between `User`, `Hospital`, and `Admin`.
- **Strict Data Validation**: Zod schemas validate request bodies, URL parameters, and queries before reaching controllers.
- **Auto-Increment Integer IDs + ObjectIds**: Uses atomic MongoDB sequence counters to seamlessly support numeric IDs (e.g. `user_id`, `hospital_id`, `id`) while leveraging MongoDB's internal `_id` indexing.
- **Centralized Error Handling**: Structured `ApiError` class and global error middleware returning FastAPI-compatible HTTP status codes and detail arrays.
- **Interactive Swagger UI**: Hosted natively at `/docs` with interactive API testing.

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── app.js                          # Express application configuration & middleware stack
│   ├── server.js                       # Server entry point, DB bootstrap & graceful shutdown
│   ├── config/
│   │   ├── database.js                 # Mongoose connection and lifecycle events
│   │   └── env.js                      # Environment variable validation & exposure
│   ├── constants/
│   │   └── roles.js                    # User/Hospital/Admin roles, blood groups, enums
│   ├── models/
│   │   ├── Counter.model.js            # Auto-incrementing sequence generator
│   │   ├── User.model.js               # Donors, patients, and standard users
│   │   ├── Hospital.model.js           # Verified & pending hospitals
│   │   ├── Admin.model.js              # Platform administrators
│   │   ├── BloodRequest.model.js       # Patient blood donation requests
│   │   ├── DonorRequest.model.js       # Volunteer donor submissions
│   │   ├── EmergencyBloodRequest.model.js # Urgent emergency broadcast requests
│   │   ├── Notification.model.js       # User notifications
│   │   ├── NotificationPreference.model.js # Notification channel settings
│   │   ├── CommunityPost.model.js      # Community public messages
│   │   ├── SupportReport.model.js      # Support incident tickets
│   │   └── UserActivity.model.js       # Audit log of user activities
│   ├── middlewares/
│   │   ├── auth.middleware.js          # User, Hospital, and Admin JWT authenticators
│   │   ├── error.middleware.js         # Centralized error and 404 handlers
│   │   └── validate.middleware.js      # Zod schema validation middleware
│   ├── validators/
│   │   ├── auth.validator.js           # User registration and login schemas
│   │   ├── user.validator.js           # Settings update and password change schemas
│   │   ├── hospital.validator.js       # Hospital registration and login schemas
│   │   ├── admin.validator.js          # Admin credentials schema
│   │   ├── bloodRequest.validator.js   # Blood request creation and update schemas
│   │   ├── donor.validator.js          # Donor approval/rejection schema
│   │   ├── emergencyBloodRequest.validator.js # Emergency request schemas
│   │   ├── community.validator.js      # Community post schema (max 100 chars)
│   │   ├── support.validator.js        # Support issue schema
│   │   ├── settings.validator.js       # Notification preferences patch schema
│   │   └── chat.validator.js           # AI chatbot turn and message schema
│   ├── controllers/
│   │   ├── auth.controller.js          # Registration and login handlers
│   │   ├── user.controller.js          # User profile, activity, and settings
│   │   ├── hospital.controller.js      # Hospital CRUD and authentication
│   │   ├── admin.controller.js         # Hospital verification and admin auth
│   │   ├── platformStats.controller.js # Admin platform analytics
│   │   ├── bloodRequest.controller.js  # Blood request lifecycle
│   │   ├── donor.controller.js         # Donor request creation
│   │   ├── hospitalDonor.controller.js # Hospital-side donor approval/deletion
│   │   ├── emergencyBloodRequest.controller.js # User & hospital emergency broadcasts
│   │   ├── notification.controller.js  # Notification fetching and marking read
│   │   ├── settings.controller.js      # Notification preference management
│   │   ├── community.controller.js     # Public feed and post creation
│   │   ├── support.controller.js       # User issue reporting
│   │   └── chat.controller.js          # AI Assistant conversation
│   ├── services/
│   │   ├── auth.service.js             # Token generation, user/hospital/admin auth
│   │   ├── chat.service.js             # Healthcare AI knowledge base & LLM fallback
│   │   └── counter.service.js          # Sequence counter helper
│   ├── utils/
│   │   ├── ApiError.js                 # Standardized operational error class
│   │   ├── ApiResponse.js              # Standardized API response builder
│   │   ├── asyncHandler.js             # Async controller error wrapper
│   │   └── logger.js                   # Structured console logger
│   ├── routes/
│   │   ├── index.js                    # Consolidates and mounts all routers
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── hospital.routes.js
│   │   ├── admin.routes.js
│   │   ├── platformStats.routes.js
│   │   ├── bloodRequest.routes.js
│   │   ├── donor.routes.js
│   │   ├── hospitalDonor.routes.js
│   │   ├── emergencyBloodRequest.routes.js
│   │   ├── notification.routes.js
│   │   ├── settings.routes.js
│   │   ├── community.routes.js
│   │   ├── support.routes.js
│   │   └── chat.routes.js
│   └── docs/
│       └── swagger.js                  # Swagger UI integration at /docs
├── tests/
│   ├── setup.js                        # In-memory MongoDB lifecycle for tests
│   ├── auth.test.js                    # Auth, registration, and user profile tests
│   ├── bloodRequest.test.js            # Blood request CRUD lifecycle tests
│   ├── hospital.test.js                # Hospital registration & admin verification tests
│   ├── community.test.js               # Community post and AI chatbot tests
│   └── platformStats.test.js           # Admin platform analytics tests
├── openapi.json                        # Full OpenAPI 3.1.0 specification
├── .env.example                        # Example environment configuration
├── .gitignore
├── package.json
└── README.md
```

---

## 🔄 Request Flow

Every incoming HTTP request traverses a clean, single-responsibility pipeline:

```
[ Client Request ]
       │
       ▼
[ Express Global Middlewares ] (Helmet, CORS, JSON Body Parser, Cookie Parser, Morgan)
       │
       ▼
[ Router Match ] (e.g. POST /api/v1/blood-requests/)
       │
       ▼
[ Authentication Middleware ] (extracts Bearer token, verifies JWT, checks role, attaches entity to req)
       │
       ▼
[ Validation Middleware ] (validates req.body/params/query against Zod schema; throws ApiError(422) if invalid)
       │
       ▼
[ Controller Handler (asyncHandler) ] (processes request, invokes service or Mongoose model)
       │
       ▼
[ Mongoose Model / MongoDB ] (reads or persists data with atomic updates and hooks)
       │
       ▼
[ JSON Response ] (returns expected schema with status code: 200, 201, 204)
       │
   (If error thrown)
       ▼
[ Centralized Error Middleware ] (transforms error into consistent JSON response with status code)
```

---

## 💻 Technology Stack

- **Runtime**: Node.js >= 18 (ES Modules)
- **Framework**: Express.js 4.x
- **Database**: MongoDB via Mongoose 8.x
- **Validation**: Zod 3.x
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Security**: `helmet`, `cors`, `cookie-parser`
- **API Documentation**: `swagger-ui-express`
- **Testing**: Vitest + Supertest + `mongodb-memory-server`

---

## 🛠️ Prerequisites & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x, v20.x, or v22.x recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection URI)

### 2. Clone and Install

In Windows PowerShell or terminal:

```powershell
# Navigate to the project directory
cd "d:\Programming\Web dev\backend\lifelink backend express js"

# Install dependencies
npm install
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server to listen on | `8000` |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/lifelink` |
| `FRONTEND_URL` | Allowed origin for CORS | `http://localhost:3000` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | *(Required)* |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `DEFAULT_ADMIN_NAME` | Seed admin name | `Super Admin` |
| `DEFAULT_ADMIN_EMAIL` | Seed admin login email | `admin@lifelink.org` |
| `DEFAULT_ADMIN_PASSWORD` | Seed admin login password | `Admin@SecurePass123!` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for AI Chatbot | `""` |
| `OPENAI_API_KEY` | *(Optional)* OpenAI API key for AI Chatbot | `""` |

---

## 🚀 Running the Application

### Development Mode (with nodemon auto-reload)
```powershell
npm run dev
```

### Production Mode
```powershell
npm start
```

Once started:
- API Server: `http://localhost:8000`
- Swagger UI Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`
- Raw OpenAPI Spec: `http://localhost:8000/openapi.json`

---

## 🧪 Running Tests

The test suite uses Vitest, Supertest, and `mongodb-memory-server` so that tests execute in complete isolation without modifying production or development databases:

```powershell
npm test
```

---

## 📖 API Documentation (Swagger UI)

Navigate to **`http://localhost:8000/docs`** in any web browser to explore:
- Interactive Swagger UI matching the FastAPI schema.
- Try-it-out functionality for all endpoints.
- Authorization support via Bearer tokens for `UserOAuth2`, `HospitalOAuth2`, and `AdminOAuth2`.

---

## 🗺️ FastAPI to Express Endpoint Mapping

| FastAPI Endpoint | Method | Express Endpoint | Auth Required | Description |
| :--- | :---: | :--- | :---: | :--- |
| `/api/v1/register/` | POST | `/api/v1/register/` | None | Register a new user |
| `/api/v1/login/` | POST | `/api/v1/login/` | None | Log in user, return JWT |
| `/api/v1/users/me` | GET | `/api/v1/users/me` | UserOAuth2 | Get authenticated user profile |
| `/api/v1/users/activity` | GET | `/api/v1/users/activity` | UserOAuth2 | Get user activity history |
| `/api/v1/users/settings/` | PUT | `/api/v1/users/settings/` | UserOAuth2 | Update user settings (name, phone) |
| `/api/v1/users/settings/password` | PUT | `/api/v1/users/settings/password` | UserOAuth2 | Change user password |
| `/api/v1/hospitals/` | POST | `/api/v1/hospitals/` | None | Register a new hospital |
| `/api/v1/hospitals/login` | POST | `/api/v1/hospitals/login` | None | Log in hospital, return JWT |
| `/api/v1/hospitals/{id}` | GET | `/api/v1/hospitals/:id` | HospitalOAuth2 | Get hospital details |
| `/api/v1/hospitals/{id}` | PUT | `/api/v1/hospitals/:id` | HospitalOAuth2 | Update hospital details |
| `/api/v1/hospitals/{id}` | DELETE | `/api/v1/hospitals/:id` | HospitalOAuth2 | Delete hospital account |
| `/api/v1/hospitals/settings/password` | PUT | `/api/v1/hospitals/settings/password` | HospitalOAuth2 | Change hospital password |
| `/api/v1/admin/login` | POST | `/api/v1/admin/login` | None | Log in admin, return JWT |
| `/api/v1/admin/hospitals/pending` | GET | `/api/v1/admin/hospitals/pending` | AdminOAuth2 | List hospitals awaiting verification |
| `/api/v1/admin/hospitals/{id}/verify` | PUT | `/api/v1/admin/hospitals/:id/verify` | AdminOAuth2 | Verify hospital account |
| `/api/v1/platform-stats/active_blood_requests` | GET | `/api/v1/platform-stats/active_blood_requests` | AdminOAuth2 | Total active blood requests |
| `/api/v1/platform-stats/registered_hospitals` | GET | `/api/v1/platform-stats/registered_hospitals` | AdminOAuth2 | Total registered hospitals |
| `/api/v1/platform-stats/total_donations` | GET | `/api/v1/platform-stats/total_donations` | AdminOAuth2 | Total completed donations |
| `/api/v1/blood-requests/` | POST | `/api/v1/blood-requests/` | UserOAuth2 | Create a blood request |
| `/api/v1/blood-requests/` | GET | `/api/v1/blood-requests/` | HospitalOAuth2 | List blood requests (pagination) |
| `/api/v1/blood-requests/status` | GET | `/api/v1/blood-requests/status` | HospitalOAuth2 | List blood requests by status |
| `/api/v1/blood-requests/{id}` | GET | `/api/v1/blood-requests/:id` | HospitalOAuth2 | Get blood request by ID |
| `/api/v1/blood-requests/{id}` | PUT | `/api/v1/blood-requests/:id` | HospitalOAuth2 | Update blood request status |
| `/api/v1/blood-requests/{id}` | DELETE | `/api/v1/blood-requests/:id` | HospitalOAuth2 | Delete blood request |
| `/api/v1/donor/request` | POST | `/api/v1/donor/request` | UserOAuth2 | Submit a blood donation request |
| `/api/v1/Donor_Hospital/donor-request` | GET | `/api/v1/Donor_Hospital/donor-request` | HospitalOAuth2 | View donor requests for hospital |
| `/api/v1/Donor_Hospital/{id}` | PUT | `/api/v1/Donor_Hospital/:id` | HospitalOAuth2 | Approve/reject donor request |
| `/api/v1/Donor_Hospital/donor-request-delete/{id}` | DELETE | `/api/v1/Donor_Hospital/donor-request-delete/:id` | HospitalOAuth2 | Delete donor request |
| `/api/v1/emergency-blood-request/create-emergency-blood-request` | POST | `/api/v1/emergency-blood-request/create-emergency-blood-request` | UserOAuth2 | User broadcasts emergency request |
| `/api/v1/emergency-blood-request/create-emergency-blood-request-hospital` | POST | `/api/v1/emergency-blood-request/create-emergency-blood-request-hospital` | HospitalOAuth2 | Hospital broadcasts emergency request |
| `/api/v1/emergency-blood-request/get-emergency-blood-requests` | GET | `/api/v1/emergency-blood-request/get-emergency-blood-requests` | HospitalOAuth2 | View all emergency blood requests |
| `/api/v1/notifications/` | GET | `/api/v1/notifications/` | UserOAuth2 | List user notifications |
| `/api/v1/notifications/{id}/read` | PUT | `/api/v1/notifications/:id/read` | UserOAuth2 | Mark notification as read |
| `/api/v1/settings/notifications` | GET | `/api/v1/settings/notifications` | UserOAuth2 | Get notification preferences |
| `/api/v1/settings/notifications` | PATCH | `/api/v1/settings/notifications` | UserOAuth2 | Update notification preferences |
| `/api/v1/community/` | GET | `/api/v1/community/` | None | Public community feed |
| `/api/v1/community/` | POST | `/api/v1/community/` | UserOAuth2 | Post message to community feed |
| `/api/v1/support/report` | POST | `/api/v1/support/report` | UserOAuth2 | Submit support ticket |
| `/api/v1/chat/` | POST | `/api/v1/chat/` | None | AI Chatbot for blood donation Q&A |
| `/health` | GET | `/health` | None | Health check status |
| `/` | GET | `/` | None | Root welcome endpoint |

---

## 🗄️ MongoDB Adaptation & Schema Design

1. **Auto-Increment Integer IDs**:
   The original PostgreSQL/SQLAlchemy backend exposed integer IDs (`id`, `user_id`, `hospital_id`, `admin_id`). In MongoDB, each document receives an internal `_id` (ObjectId) as well as an atomic sequence `id: Number` generated by `Counter.model.js`. Lookups support both integer IDs (`1`, `2`) and MongoDB ObjectIds (`507f1f77bcf86cd799439011`), ensuring zero breaking changes for existing API clients.

2. **Foreign Key Translation**:
   - `BloodRequest.user` -> references `User` ObjectId.
   - `DonorRequest.user` -> references `User` ObjectId.
   - `Notification.user` -> references `User` ObjectId with indexed queries.
   - `NotificationPreference.user` -> 1-to-1 unique relationship with `User`.
   - `CommunityPost.user` -> references `User` ObjectId, with denormalized `user_name` for ultra-fast feed reads without joins.

3. **Password Security**:
   Passwords are never stored in plaintext. Mongoose `pre('save')` hooks automatically hash passwords with bcrypt (10 rounds) and `toJSON` transforms automatically strip password hashes and version keys (`__v`) from all output responses.

4. **Resource Ownership**:
   Hospital modification/deletion endpoints strictly enforce that the authenticated hospital can only modify their own record.

---

## 🔍 Assumptions & External Dependencies

1. **Auto-Seeded Admin**: In the original backend, admin accounts exist in the database. In this Express backend, an initial administrator (`admin@lifelink.org`) is automatically created on startup using `DEFAULT_ADMIN_PASSWORD` if no admin exists.
2. **AI Chatbot**: The `/api/v1/chat/` endpoint includes a built-in healthcare and blood donation knowledge base covering donor eligibility, universal donors/recipients, donation intervals, and preparation. If `GEMINI_API_KEY` is provided, it seamlessly delegates to the external LLM.
3. **Integer ID Dual Compatibility**: URL path parameters such as `/:id` accept both integer numbers (e.g. `1`, `42`) and 24-character hexadecimal MongoDB ObjectIds.
