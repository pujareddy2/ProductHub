# FastAPI + React Product Manager

A full-stack product manager built with FastAPI (Python) backend and React (Vite) frontend in `frontend/`.
--- 
## 🚀 Project Structure

- `main.py` — FastAPI application and API endpoints.
- `models.py` — Pydantic request model for products.
- `database_models.py` — SQLAlchemy ORM model and table schema.
- `database.py` — SQLAlchemy engine/session configuration.
- `frontend/` — React app (Vite) with product create/read/update/delete UI.

## 🧠 Features

- Create, read, update, and delete products
- Validated product model with Pydantic
- SQLAlchemy ORM database persistence (PostgreSQL by default)
- CORS enabled for React dev server
- Creative modern UI with Neon style

## 📦 Backend API Endpoints

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/` | - | Welcome string |
| GET | `/product` | - | All products array |
| GET | `/products/{id}` | - | Product object or "product not found" |
| POST | `/products` | JSON `id, name, description, price, quantity` | Created product |
| PUT | `/products?id={id}` | JSON updated product object | Success message or not found |
| DELETE | `/products?id={id}` | JSON product object | Success message or not found |

### Product JSON Shape

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "This is a laptop",
  "price": 1000,
  "quantity": 10
}
```

## ⚙️ Setup & Run

### 1) Python backend (from project root)

1. Activate your virtual environment (example):
   ```bash
   .\.venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic psycopg2-binary
   ```
3. Ensure your database URL in `database.py` is correct (PostgreSQL default in this repo):
   ```python
   db_url = "postgresql://postgres:puja@localhost:5555/mydata"
   ```
4. Run backend:
   ```bash
   uvicorn main:app --reload
   ```
5. Open API docs:
   - Swagger: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

### 2) React frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open app:
   - http://localhost:5173

## 🎨 Frontend Features

- Add a product
- Update product in-place via "Edit"
- Delete product from inventory
- Live inventory table with total stock value
- Refresh button to reload from backend

## ✅ Integration Details

The React frontend talks to backend endpoint base `http://127.0.0.1:8000`. CORS is enabled in `main.py` for:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## 🧪 Quick End-to-End Flow

1. Start backend (`uvicorn main:app --reload`)
2. Start frontend (`cd frontend && npm run dev`)
3. Open UI and add product
4. React calls `POST /products`, then refreshes with `GET /product`
5. Use Edit/Delete buttons for update/delete actions

## 🛠️ Optional Improvements

- Switch backend to SQLAlchemy async + asyncpg
- Add user authentication and per-user product lists
- Add pagination/search/filter in React table
- Add proper error status handling in API responses

## 🤝 Notes

- This repo currently uses a minimal FastAPI endpoint design; update the `/products` PUT/DELETE signatures to path parameters (e.g. `/products/{id}`) for cleaner REST later.
- The frontend currently posts JSON for delete because backend expects body + query param.

---

If you want, I can now add a one-click Docker compose setup with backend + frontend containers and PostgreSQL. 
