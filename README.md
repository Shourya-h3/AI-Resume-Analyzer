# 🤖 AI Resume Analyzer & Job Matcher

A full-stack MERN application that uses **TF-IDF vectorization + cosine similarity** to compute match scores between resumes and job descriptions.

## Features
- 📄 **PDF Upload** — Upload resume & job description (PDF or paste text)
- 🎯 **Match Score** — Animated circular gauge with TF-IDF cosine similarity score
- 🔍 **Skill Extraction** — 500+ skill taxonomy matching
- 📊 **Skill Gap Analysis** — Bar chart breakdown by category (technical, soft, tools)
- 💡 **Suggestions** — Personalized improvement tips
- 📚 **History** — Paginated analysis history with search
- 🔐 **JWT Auth** — Optional user accounts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Framer Motion + Recharts |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| NLP | `natural` (TF-IDF) + Cosine Similarity |
| PDF Parsing | `pdf-parse` |
| Auth | JWT + bcryptjs |

## Project Structure

```
AI Resume Analyzer/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, UploadCard, ScoreGauge, etc.
│       ├── pages/        # HomePage, ResultsPage, HistoryPage, Auth
│       ├── services/     # API, analysis, auth services
│       └── context/      # AuthContext
│
└── server/          # Express backend
    ├── config/      # MongoDB connection
    ├── controllers/ # Route handlers
    ├── middleware/  # Auth, upload, errors
    ├── models/      # User, Analysis schemas
    ├── routes/      # API routes
    ├── services/    # pdfParser, skillExtractor, tfidf, matcher
    └── data/        # skills.json taxonomy
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env: add your MONGODB_URI and JWT_SECRET
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm run dev
```

Visit `http://localhost:5173`

### Environment Variables

**server/.env**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyses` | Run analysis (multipart/form-data) |
| GET | `/api/analyses` | List analyses (paginated) |
| GET | `/api/analyses/:id` | Get single analysis |
| DELETE | `/api/analyses/:id` | Delete analysis |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

Set `VITE_API_URL` in Vercel to your Render backend URL.
