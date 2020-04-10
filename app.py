from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base 
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt 
import numpy as np
import pandas as pd

app = Flask(__name__)

engine = create_engine("sqlite:///opioidsDB.db")

Base = automap_base()
Base.prepare(engine, reflect=True)

# table names are deaths and prescriptions, so I matched their variables with the names.
deaths = Base.classes.deaths
prescriptions = Base.classes.prescriptions

session = Session(engine)


@app.route("/")
def index():
    return(f"Route Options <br/><br/>"
            f"/api/v1.0/deathTest <br/>"
            f"/api/v1.0/prescriptionTest <br/>")



@app.route('/api/v1.0/deathTest')
def deathRoute():
    deathByState = session.query(deaths.Location, deaths.Data)

    deathList = []
    for row in deathByState:
        deathList.append({"State ": row[0], "Deaths per 100,000 ": row [1]})

    return jsonify(deathList)

@app.route('/api/v1.0/prescriptionTest')
def prescriptionRoute():
    
    prescriptionsByState = session.query(prescriptions.Location, prescriptions.Data)

    presList = []
    for row in presList:
        presList.append({"State ": row[0], "Prescriptions per 100,000 ": row[1]})

    return jsonify(presList)



if __name__ == '__main__':
    app.run(debug=True)