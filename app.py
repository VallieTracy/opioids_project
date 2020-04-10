from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base 
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt 
import numpy as np
import pandas as pd
from sqlalchemy.pool import SingletonThreadPool

app = Flask(__name__)

engine = create_engine('sqlite:///opioidsDB.db',
                        echo=True,
                        connect_args={"check_same_thread": False})

Base = automap_base()
Base.prepare(engine, reflect=True)

# table names are deaths and prescriptions, so I matched their variables with the names.
deaths = Base.classes.deaths
prescriptions = Base.classes.prescriptions



session = Session(engine)

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/api/v1.0/deathTest')
def deathRoute():
    session = Session(engine)
    deathByState = session.query(deaths.Location, deaths.Data, deaths.Fips, deaths.Drug_Type, deaths.TimeFrame)
    session.close()

    deathList = []
    for row in deathByState:
        deathList.append({"State ": row[0], 
                          "Deaths per 100,000 ": row [1],
                          "Fips": row[2],
                          "Drug Type": row[3],
                          "Year": row[4]})
    
    return jsonify(deathList)

@app.route('/api/v1.0/prescriptionTest')
def prescriptionRoute():
    session = Session(engine)
    prescriptionsByState = session.query(prescriptions.Location, prescriptions.Data)
    session.close()

    presList = []
    for row in prescriptionsByState:
        presList.append({"State ": row[0], "Prescriptions per 100,000 ": row[1]})

    return jsonify(presList)

session.close()

if __name__ == '__main__':
    app.run(debug=True)