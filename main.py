from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import Session,engine
import database_models
import sqlalchemy.orm as session

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"]

)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)


@app.get("/")

def greet():
    return "good welcome to my home  midde "

product =[
    

]

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
def init_db():
    db = Session()
    count = db.query(database_models.products).count()
    if count == 0:
        for products in product:
            db.add(database_models.products(**products.model_dump()))
        db.commit()

init_db()




@app.get("/product")
def get_all_product(db : session = Depends(get_db)):
    #db coonnection
    db_products = db.query(database_models.products).all()
    return db_products

@app.get("/products/{id}")
def get_product_by_id(id: int, db: session = Depends(get_db)):
    db_products = db.query(database_models.products).filter(database_models.products.id == id).first()
    if db_products:
        return db_products
    return "product not found"

@app.post("/products")
def add_products(new_product: models.products, db: session = Depends(get_db)):
    db.add(database_models.products(**new_product.model_dump()))
    db.commit()
    return new_product

@app.put("/products")
def update_product(id:int,updated_product:models.products, db: session = Depends(get_db)):
    db_products = db.query(database_models.products).filter(database_models.products.id == id).first()
    if db_products:
        db_products.name = updated_product.name
        db_products.description = updated_product.description
        db_products.price = updated_product.price
        db_products.quantity = updated_product.quantity
        db.commit()
        return "product updated successfully"
    return "product not found"

@app.delete("/products")
def delete_product(id:int , delete_products:models.products,db:session = Depends(get_db)):
    db_product = db.query(database_models.products).filter(database_models.products.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "product deleted successfully"
    return "product not found"