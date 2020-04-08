from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base 
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt 
import numpy as np
import pandas as pd

engine = create_engine("sqlite:///../opioids_project/Resources/drugPoisoningDeaths.db")

Base = automap_base()
Base.prepare(engine, reflect=True)
session = Session(engine)
app = Flask(__name__)




@app.route('/')
def index():
    print("testing")
    return render_template('index.html')






if __name__ == '__main__':
    app.run()