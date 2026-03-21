# ProductHub Deployment Guide

This guide explains how to deploy the ProductHub backend on Render and connect it to your GitHub Pages frontend.

## Architecture

```
User Browser → React Frontend (GitHub Pages) → FastAPI Backend (Render) → PostgreSQL Database
```

## Backend Deployment on Render

### Step 1: Create a Render Account

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Create a PostgreSQL Database

1. In Render dashboard, click "New" → "PostgreSQL"
2. Name it: `producthub-db`
3. Select the free plan
4. Click "Create Database"
5. Wait for the database to be created (note the connection string)

### Step 3: Create a Web Service for the Backend

1. Click "New" → "Web Service"
2. Connect your ProductHub GitHub repository
3. Configure the service:
   - **Name**: `producthub-api`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
4. Add Environment Variable:
   - Key: `DATABASE_URL`
   - Value: Copy the "Internal Database URL" from your PostgreSQL database (starts with `postgres://`)
5. Click "Create Web Service"

### Step 4: Verify Backend Deployment

1. Wait for the deployment to complete
2. Your backend will be available at: `https://producthub-api.onrender.com`
3. Test the API docs: `https://producthub-api.onrender.com/docs`
4. Test the products endpoint: `https://producthub-api.onrender.com/products`

## Frontend Deployment Update

### Step 1: Update Environment File

The `frontend/.env` file has been updated with the Render backend URL:

```
VITE_API_BASE=https://producthub-api.onrender.com
```

### Step 2: Rebuild and Deploy Frontend

```bash
cd frontend
npm install
npm run build
npm run deploy
```

## Local Development

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn main:app --reload

# API docs available at
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env file for local development)

```
DATABASE_URL=postgresql://postgres:puja@localhost:5555/mydata
```

### Frontend (.env file)

```
# Production
VITE_API_BASE=https://producthub-api.onrender.com

# Local development
VITE_API_BASE=http://127.0.0.1:8000
```

## API Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/`                 | Welcome message          |
| GET    | `/products`         | Get all products         |
| GET    | `/product`          | Get all products (alias) |
| GET    | `/products/{id}`    | Get product by ID        |
| POST   | `/products`         | Create new product       |
| PUT    | `/products?id={id}` | Update product by ID     |
| DELETE | `/products?id={id}` | Delete product by ID     |

## Troubleshooting

### CORS Issues

If you see CORS errors in the browser console:

1. Ensure the frontend URL (`https://pujareddy2.github.io`) is in the `origins` list in `main.py`
2. Redeploy the backend after making changes

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly in Render environment variables
2. Check that the PostgreSQL database is active

### 404 Errors on Frontend

1. Verify the API URL in `frontend/.env` matches your Render backend URL
2. Rebuild and redeploy the frontend

## File Changes Made

1. ✅ **requirements.txt** - Added all FastAPI dependencies
2. ✅ **main.py** - Updated CORS configuration and fixed API endpoints
3. ✅ **database.py** - Added environment variable support for Render
4. ✅ **frontend/.env** - Updated to use Render backend URL
5. ✅ **frontend/src/App.jsx** - Fixed DELETE request to not send body
6. ✅ **render.yaml** - Render deployment configuration
7. ✅ **.env.example** - Template for local environment variables
