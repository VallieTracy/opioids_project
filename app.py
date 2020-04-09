from flask import Flask, render_template
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
import datetime as dt


app = Flask(__name__)

engine = create_engine("sqlite:///Resources/drugPoisoningDeaths.db")
# print(engine)
Base = automap_base()
# print(Base)
Base.prepare(engine, reflect = True)
deaths = Base.classes.drugPoisoningDeaths
session = Session(engine)





@app.route('/')
def index():

    return render_template('index.html')






if __name__ == '__main__':
    app.run()