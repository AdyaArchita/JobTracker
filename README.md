# JobTracker – AI-Assisted Job Application Tracker

A modern, production-ready MERN stack application for tracking job applications on a Kanban board with intelligent AI assistance.

## 🌟 What Makes This Project Stand Out

Unlike a standard Kanban board, this project acts as an intelligent career copilot:
- **Intelligent Match Scoring**: Parses Job Descriptions using AI to assign a **Match Score (0-100)** visually represented with an elegant SVG progress ring.
- **Career Copilot Insights**: Automatically generates a highly tailored **Cover Letter Hook**, explains **"Why You Fit"** the role, and creates 3-5 specific **Resume Bullets** based on your candidate persona.
- **Premium SaaS UX/UI**: Implements a dark-mode first glassmorphism design system (soft blurs, inner glows, mesh gradients), creating a calming, high-end user experience inspired by top-tier tools like Linear.
- **Smart Mock Mode**: A deeply robust AI Mock Mode that instantly returns high-quality, realistic engineering data. This guarantees the application is always 100% demo-ready even without an OpenAI API key.
- **Optimized Kanban Experience**: Features smooth drag-and-drop (`@dnd-kit`) with visual ghost states, color-coded priority tags, and Optimistic UI updates (React Query) for zero-latency interactions.

## ✨ Overview

JobTracker allows users to manage their entire job search pipeline using a 5-column Kanban board. It features powerful AI capabilities that automatically parse job descriptions and generate tailored resume bullet points.

The project fully satisfies all core requirements from the assignment while incorporating several thoughtful enhancements for a polished, SaaS-like experience.

## 🚀 Features

### Core Features (Fully Implemented)
- Secure JWT authentication with register and login
- 5-column draggable Kanban board: **Applied → Phone Screen → Interview → Offer → Rejected**
- AI Job Description Parser – extracts company, role, required skills, nice-to-have skills, seniority, and location
- AI-generated tailored resume bullet points (4–5 per role) with copy buttons
- Full CRUD operations (Create, View, Edit, Delete) with clean modals

### Additional Enhancements
- **Match Score** (0–100%) with elegant circular progress indicator
- **"Why You Fit"** insights and Cover Letter opening line
- Executive KPI Dashboard with key metrics (Total, In Progress, Offers, Avg Match Score)
- Search and filter functionality
- One-click Export to CSV
- Priority tags on cards (High / Medium / Low)
- Follow-up reminders with overdue highlighting
- Dark / Light mode toggle
- Streaming AI responses (SSE)

## 🛠 Tech Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Frontend         | React 18 + TypeScript + Vite + Tailwind CSS     |
| Backend          | Node.js + Express + TypeScript                  |
| Database         | MongoDB + Mongoose                              |
| Authentication   | JWT + bcryptjs                                  |
| AI               | OpenAI (gpt-4o with JSON mode + streaming)      |
| State Management | TanStack React Query                            |
| Drag & Drop      | @dnd-kit                                        |
| Notifications    | react-hot-toast                                 |

## 📂 Project Structure

```text
JobTracker/
├── backend/
│   ├── src/
│   │   ├── config/        # Environment & DB config
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # User & Application schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # AI service layer (core business logic)
│   │   ├── types/         # TypeScript interfaces
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth & Theme context
│   │   ├── pages/         # Dashboard, Auth pages
│   │   └── types/
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/AdyaArchita/JobTracker
cd JobTracker
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend setup (new terminal)
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173`

> **Note:** You can leave `OPENAI_API_KEY=change-me` in the backend `.env` file to use the built-in Smart Mock Mode (recommended for rapid review without API costs).

## 🏗 Architecture & Design Decisions

- **AI Service Layer**: All AI logic is cleanly separated in `backend/src/services/aiService.ts`. This includes both real OpenAI calls and a high-quality mock fallback.
- **Optimistic UI**: Drag-and-drop updates feel instant thanks to React Query's optimistic updates.
- **Type Safety**: Strict TypeScript with shared interfaces between frontend and backend.
- **Glassmorphism UI**: Subtle, elegant glass effects for a premium dark-first experience without visual clutter.
- **Smart Mock Mode**: Ensures the entire app is fully functional during evaluation even without an OpenAI key.

## 📜 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Create new application |
| PATCH | `/api/applications/:id/status` | Update status (drag & drop) |
| POST | `/api/applications/parse-jd` | Parse job description with AI |
| GET | `/api/applications/export/csv` | Export applications as CSV |

## 📄 License
MIT