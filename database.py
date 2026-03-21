
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Load environment variables from .env file for local development
load_dotenv()

# Get database URL from environment variable or use local fallback
def get_db_url():
    # Check for Render's DATABASE_URL or use local database
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        # Render uses postgres:// but SQLAlchemy requires postgresql://
        return database_url.replace("postgres://", "postgresql://", 1)
    # Local fallback
    return "postgresql://postgres:puja@localhost:5555/mydata"

db_url = get_db_url()
engine = create_engine(db_url)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

