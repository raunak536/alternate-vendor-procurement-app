# Quick Setup Guide

## Prerequisites
- Node.js v18+
- Python 3.10+

## 1. Frontend Setup
```bash
npm install
```

## 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 3. Environment (Optional - for pipeline only)
Create `.env` in project root:
```
OPENAI_API_KEY=your_key_here
```

## Running the App

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Access
- App: http://localhost:5173
- API: http://localhost:8000
