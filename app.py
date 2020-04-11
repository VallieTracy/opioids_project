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



<<<<<<< HEAD
# session = Session(engine)
=======
session = Session(engine)
>>>>>>> d1c52103dac259aacb0c4181618d8f89dc0b4e3f

@app.route('/')
def index():
    return render_template('index.html')

# Route to our about page
@app.route('/about')
def about():
    return render_template('about.html')

# Route to a dataset page
@app.route('/deathsData')
def deathsData():
    return render_template('deathsData.html')

@app.route('/api/v1.0/deathTest')
def deathRoute():
    session = Session(engine)
    deathByState = session.query(deaths.Location, deaths.Data, deaths.Fips, deaths.Drug_Type, deaths.TimeFrame)
    session.close()

    deathList = []
    for row in deathByState:
<<<<<<< HEAD
        deathList.append({"State": row[0], 
                          "Deaths per 100,000": row [1],
=======
        deathList.append({"State ": row[0], 
                          "Deaths per 100,000 ": row [1],
>>>>>>> d1c52103dac259aacb0c4181618d8f89dc0b4e3f
                          "Fips": row[2],
                          "Drug Type": row[3],
                          "Year": row[4]})
    
    return jsonify(deathList)

@app.route('/api/v1.0/prescriptionTest')
def prescriptionRoute():
    session = Session(engine)
    prescriptionsByState = session.query(prescriptions.Location, prescriptions.Data, prescriptions.Fips, prescriptions.Oxy_Hydro, prescriptions.TimeFrame)
    session.close()

    presList = []
    for row in prescriptionsByState:
<<<<<<< HEAD
        presList.append({"State": row[0], 
                         "Prescriptions per 100,000": row[1],
=======
        presList.append({"State ": row[0], 
                         "Prescriptions per 100,000 ": row[1],
>>>>>>> d1c52103dac259aacb0c4181618d8f89dc0b4e3f
                         "Fips": row[2],
                         "Oxycodone / Hydrocodone:": row[3],
                         "Year": row[4]})

    return jsonify(presList)

<<<<<<< HEAD
# session.close()
=======
session.close()
>>>>>>> d1c52103dac259aacb0c4181618d8f89dc0b4e3f

if __name__ == '__main__':
    app.run(debug=True)