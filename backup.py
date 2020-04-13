# from flask import Flask, render_template, jsonify
# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base 
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func
# import datetime as dt 
# import numpy as np
# import pandas as pd
# from sqlalchemy.pool import SingletonThreadPool


# app = Flask(__name__)

# engine = create_engine('sqlite:///opioidsDB.db',
#                         echo=True,
#                         connect_args={"check_same_thread": False})

# Base = automap_base()
# Base.prepare(engine, reflect=True)

# # table names are deaths and prescriptions, so I matched their variables with the names.
# deaths = Base.classes.deaths
# prescriptions = Base.classes.prescriptions



# session = Session(engine)

# @app.route('/')
# def index():
#     return render_template('index.html')

# # Route to our about page
# @app.route('/about')
# def about():
#     return render_template('about.html')

# # Route to a dataset page
# @app.route('/deathsData')
# def deathsData():
#     return render_template('deathsData.html')

# @app.route('/api/v1.0/deathTest')
# def deathRoute():
#     session = Session(engine)
#     deathByState = session.query(deaths.Location, deaths.Data, deaths.Fips, deaths.Drug_Type, deaths.TimeFrame)
#     session.close()

#     # deathList = []
#     # for row in deathByState:

#     #     deathList.append({"State ": row[0], 
#     #                       "Deaths per 100,000 ": row [1],
#     #                       "Fips": row[2],
#     #                       "Drug Type": row[3],
#     #                       "Year": row[4]})
    
#     # return jsonify(deathList)


#     # deathList={}
#     # for item in deathByState:
#     #     state = item[0]
#     #     deaths_per_100000 = item[1]
#     #     fips = item[2]
#     #     drug_type = item[3]
#     #     year = item[4]
#     #     found = False
#     #     for key in deathList:
#     #         if state == key:
#     #             deathList[key][year] = {"info": {"Deaths per 100,000": deaths_per_100000, "Drug Type": drug_type, "Year": year, "Fips": fips}}
#     #             found = True
#     #     if not found:
#     #         deathList[state] = {year: {"info": {"Deaths per 100,000": deaths_per_100000, "Drug Type": drug_type, "Year": year, "Fips": fips}}}
#     # return jsonify(deathList)

#     drugTypeList= ["Cocaine", "Heroin", "Natural and semi-synthetic opioids", "Psychostimulants", "Synthetic opioids", "All drugs", "All opioids"]
#     deathList={}
#     for item in deathByState:
#         state = item[0]
#         deaths_per_100000 = item[1]
#         if deaths_per_100000 != "N/A":
#             deaths_per_100000 = float(deaths_per_100000)
#         fips = item[2]
#         drug_type = item[3]
#         year = item[4]
#         found = False
#         for key in deathList:
#             if state == key:
#                 for drug in drugTypeList:
#                     test = {drug: deaths_per_100000}
#                     deathList[key][year] = {"deaths": test}
#                     found = True
#         if not found:
#             for drug in drugTypeList:
#                 test = {drug: deaths_per_100000}
#             deathList[state] = {year: {"deaths": test}}
        
#     return deathList

# @app.route('/api/v1.0/prescriptionTest')
# def prescriptionRoute():
#     session = Session(engine)
#     prescriptionsByState = session.query(prescriptions.Location, prescriptions.Data, prescriptions.Fips, prescriptions.Oxy_Hydro, prescriptions.TimeFrame)
#     session.close()

#     presList = []
#     for row in prescriptionsByState:

#         presList.append({"State ": row[0], 
#                          "Prescriptions per 100,000 ": row[1],
#                          "Fips": row[2],
#                          "Oxycodone / Hydrocodone:": row[3],
#                          "Year": row[4]})

#     return jsonify(presList)

# session.close()

# if __name__ == '__main__':
#     app.run(debug=True)

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

# Route to our about page
@app.route('/about')
def about():
    return render_template('about.html')

# Route to death dataset page
@app.route('/deathsData')
def deathsData():
    return render_template('deathsData.html')

# Route to sales dataset page
@app.route('/salesData')
def salesData():
    return render_template('salesData.html')

@app.route('/api/v1.0/deathTest')
def deathRoute():
    session = Session(engine)
    deathByState = session.query(deaths.Location, deaths.Data, deaths.Fips, deaths.Drug_Type, deaths.TimeFrame)
    session.close()

    deathList=[]
    for row in deathByState:
        deathList.append({"State": row[0], 
                         "Prescriptions per 100,000": row[1],
                         "Fips": row[2],
                         "Drug Type": row[3],
                         "Year": row[4]})

    return jsonify(deathList) 

        
    #return jsonify(deathList)   

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
    #     if not found:
    #         deathList[state] = {year: {"info": {"Deaths per 100,000": deaths_per_100000, "Drug Type": drug_type, "Year": year, "Fips": fips}}}
    
    # return deathList

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

session.close()

if __name__ == '__main__':
    app.run(debug=True)