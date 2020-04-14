from flask import Flask, render_template, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base 
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt 
import numpy as np
import pandas as pd


app = Flask(__name__)


engine = create_engine('sqlite:///opioidsDB.db')

Base = automap_base()
Base.prepare(engine, reflect=True)

# table names are deaths and prescriptions, so I matched their variables with the names.
deaths = Base.classes.deaths
prescriptions = Base.classes.prescriptions


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
    deathByState = session.query(deaths.Location, deaths.Data, deaths.Fips, deaths.Drug_Type, deaths.TimeFrame).all()
    session.close()

    deathList = []
    for row in deathByState:

        deathList.append({"State": row[0], 
                          "Deaths per 100,000": row[1],
                          "Fips": row[2],
                          "Drug Type": row[3],
                          "Year": row[4]})
    # print (deathList)
    return jsonify(deathList)

    # drugTypeList= ["Cocaine", "Heroin", "Natural and semi-synthetic opioids", "Psychostimulants", "Synthetic opioids", "All drugs", "All opioids"]
    # deathList={}
    
    # for item in deathByState:
    #     state = item[0]
    #     deaths_per_100000 = item[1]
    #     if deaths_per_100000 != "N/A":
    #         deaths_per_100000 = float(deaths_per_100000)
    #     fips = item[2]
    #     drug_type = item[3]
    #     year = item[4]

    #     found = False
    #     for key in deathList:
    #         if state == key:
    #             deathList[key][year] = {"info": {"Deaths per 100,000": deaths_per_100000, "Drug Type": drug_type, "Year": year, "Fips": fips}}
    #             found = True
    #         if not found:
    #             deathList[state] = {year: {"info": {"Deaths per 100,000": deaths_per_100000, "Drug Type": drug_type, "Year": year, "Fips": fips}}}

        # for state in deathList:
        #     for drug in drugTypeList:
        #         if (state == state) and (year == year):
        #             if drug == drug_type:
        #                 deathList[state][year][info] = {drug_type: deaths_per_10000}




@app.route('/api/v1.0/prescriptionTest')
def prescriptionRoute():
    session = Session(engine)
    prescriptionsByState = session.query(prescriptions.Location, prescriptions.Data, prescriptions.Fips, prescriptions.Oxy_Hydro, prescriptions.TimeFrame)
    session.close()

    presList = []
    for row in prescriptionsByState:
        presList.append({"State": row[0], 
                         "Prescriptions per 100,000": row[1],
                         "Fips": row[2],
                         "Oxycodone / Hydrocodone": row[3],
                         "Year": row[4]})

    return jsonify(presList)


if __name__ == '__main__':
    app.run(debug=True)