# ProductHub - Integrated Deployment Guide

This version has the frontend and backend integrated into a single deployment.

## Architecture

```
User Browser → FastAPI (Serves both API + Frontend Static Files) → PostgreSQL Database
```

All routes:

- `/` → Serves the React frontend
- `/api/*` → API endpoints
- `/assets/*` → Static frontend assets

## Project Structure

```
ProductHub/
├── main.py              # FastAPI app with API + static file serving
├── database.py          # Database configuration
├── models.py            # Pydantic models
├── database_models.py   # SQLAlchemy models
├── requirements.txt     # Python dependencies
├── render.yaml          # Render deployment config
├── frontend/            # React frontend
│   ├── src/
│   ├── dist/           # Build output (generated)
│   └── vite.config.js
└── dist/               # Copied from frontend/dist for serving
```

## API Endpoints

All API endpoints are prefixed with `/api`:

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api`                  | API status               |
| GET    | `/api/products`         | Get all products         |
| GET    | `/api/product`          | Get all products (alias) |
| GET    | `/api/products/{id}`    | Get product by ID        |
| POST   | `/api/products`         | Create new product       |
| PUT    | `/api/products?id={id}` | Update product           |
| DELETE | `/api/products?id={id}` | Delete product           |

## Local Development

### Backend Only

```bash
pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8000/api
```

### Full Stack (with frontend)

```bash
# Terminal 1 - Backend
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Frontend available at http://localhost:5173
```

### Build for Production

```bash
# On Windows
build.bat

# On Mac/Linux
bash build.sh
```

This will:

1. Install Python dependencies
2. Build the React frontend
3. Copy `frontend/dist` to root `dist` folder

## Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Push code to GitHub
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your repository
4. Render will automatically:
   - Create the PostgreSQL database
   - Deploy the web service with build commands

### Option 2: Manual Setup

1. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Name: `producthub-db`
   - Free plan

2. **Create Web Service**
   - New → Web Service
   - Connect repository
   - Settings:
     - **Name**: `producthub`
     - **Runtime**: Python 3
     - **Build Command**:
       ```
       pip install -r requirements.txt && cd frontend && npm install && npm run build && cd .. && cp -r frontend/dist .
       ```
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
   - Add environment variable:
     - Key: `DATABASE_URL`
     - Value: (from your PostgreSQL database)

## Environment Variables

### Local Development (.env)

```
DATABASE_URL=postgresql://postgres:puja@localhost:5555/mydata
```

### Production (Render)

- `DATABASE_URL` - Automatically set by Render PostgreSQL

## Key Changes from Separate Deployment

1. **API routes** now prefixed with `/api`
2. **Frontend** uses relative URLs (`/api/products`)
3. **Vite config** uses relative base (`./`)
4. **FastAPI** serves static files from `dist/` folder
5. **All routes** serve `index.html` for SPA behavior

## Troubleshooting

### Frontend shows "Frontend not built"

Run the build script:

```bash
bash build.sh  # or build.bat on Windows
```

### API returns 404

Ensure you're using `/api/` prefix:

- ✅ `GET /api/products`
- ❌ `GET /products`

### Changes not showing

Rebuild the frontend:

```bash
cd frontend
npm run build
cd ..
cp -r frontend/dist .
```
