
from sqlalchemy.orm  import sessionmaker
from sqlalchemy import create_engine


db_url = "postgresql://postgres:puja@localhost:5555/mydata"
engine= create_engine(db_url)
Session = sessionmaker(autocommit=False,autoflush=False,bind=engine)

