# CodeLens AI — AI Code Reviewer SaaS

An AI-powered code review SaaS built with React, Node.js, Claude API, Stripe, and PostgreSQL.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Code Editor | Monaco Editor (VS Code's editor) |
| Backend | Node.js + Express |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + bcrypt |
| AI | Claude (Anthropic API) |
| Payments | Stripe |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
codelens-ai/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Home page
│   │   │   ├── Login.jsx         # Sign in
│   │   │   ├── Register.jsx      # Sign up
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── Editor.jsx        # Code editor + review trigger
│   │   │   ├── ReviewResult.jsx  # AI feedback display
│   │   │   ├── History.jsx       # Past reviews
│   │   │   └── Pricing.jsx       # Plans + Stripe checkout
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   └── lib/
│   │       ├── api.js            # Axios instance
│   │       └── store.js          # Zustand auth store
│   └── ...
└── server/                  # Node.js backend
    ├── index.js              # Express entry point
    ├── routes/
    │   ├── auth.js           # register, login
    │   ├── review.js         # submit, history, get
    │   ├── payment.js        # Stripe checkout, webhook, portal
    │   └── user.js           # profile + usage
    ├── middleware/
    │   ├── auth.js           # JWT verification
    │   └── planLimit.js      # Daily review limits
    ├── services/
    │   └── claude.js         # Claude API integration
    └── prisma/
        └── schema.prisma     # DB schema
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd codelens-ai
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Set up environment variables

```bash
# Server
cd server
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, STRIPE keys

# Client
cd ../client
cp .env.example .env
# Fill in: VITE_API_URL
```

### 3. Set up database

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run dev servers

```bash
# From root — runs both frontend and backend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/user/me` | Yes | Profile + usage |
| POST | `/api/review` | Yes | Submit code for review |
| GET | `/api/review/history` | Yes | Past reviews |
| GET | `/api/review/:id` | Yes | Single review |
| POST | `/api/payment/create-checkout` | Yes | Start Stripe checkout |
| POST | `/api/payment/webhook` | No | Stripe webhook |
| POST | `/api/payment/portal` | Yes | Billing portal |
| GET | `/api/health` | No | Health check |

---

## Plan Limits

| Plan | Reviews/day | Price |
|------|-------------|-------|
| Free | 5 | ₹0 |
| Pro | Unlimited | ₹749/mo |
| Team | Unlimited | ₹2,499/mo |

---

## Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL` to your backend URL

### Backend → Render
1. Push `server/` to GitHub  
2. Create a new Web Service on Render
3. Set all env vars from `.env.example`
4. Set start command: `node index.js`

---

## Built for placement portfolio
This project demonstrates:
- Full-stack React + Node.js architecture
- JWT-based authentication
- Claude AI API integration
- Stripe payment/subscription system
- PostgreSQL database with Prisma ORM
- Rate limiting and plan-based access control
- Professional SaaS UI with Tailwind CSS
